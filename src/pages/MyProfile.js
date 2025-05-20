// pages/MyProfile.js
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { ref, onValue, update, get, child } from "firebase/database";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Divider,
} from "@mui/material";

function MyProfile() {
  const [player, setPlayer] = useState(null);
  const [focusAreas, setFocusAreas] = useState({});
  const [focusItems, setFocusItems] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [trainingTypes, setTrainingTypes] = useState({});
  const [shots, setShots] = useState({});
  const [strategies, setStrategies] = useState({});
  const [variations, setVariations] = useState({});
  const [playerNotes, setPlayerNotes] = useState({});
  const [editProfile, setEditProfile] = useState(false);
  const [editData, setEditData] = useState({});

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const playerRef = ref(db, `players/${uid}`);
    onValue(playerRef, (snap) => {
      if (snap.exists()) {
        const val = snap.val();
        setPlayer(val);
        setEditData(val);
      } else {
        setPlayer({});
        setEditData({});
      }
    });

    const focusAreaRef = ref(db, "focusAreas");
    onValue(focusAreaRef, (snap) => {
      if (snap.exists()) setFocusAreas(snap.val());
    });

    const focusRef = ref(db, "playerFocusHistory");
    onValue(focusRef, (snap) => {
      if (snap.exists()) {
        const items = Object.entries(snap.val()).filter(
          ([, item]) => item.playerId === uid
        );
        setFocusItems(items);
      }
    });

    const sessionRef = ref(db, "sessions");
    onValue(sessionRef, (snap) => {
      if (snap.exists()) {
        const items = Object.entries(snap.val()).filter(([, session]) =>
          session.playerIds?.includes(uid)
        );
        setSessions(items);
      }
    });

    const fetchRefs = async () => {
      const dbRef = ref(db);
      const [trainingSnap, shotSnap, strategySnap, variationSnap] =
        await Promise.all([
          get(child(dbRef, "trainingTypes")),
          get(child(dbRef, "shots")),
          get(child(dbRef, "strategies")),
          get(child(dbRef, "shotVariations")),
        ]);

      if (trainingSnap.exists()) setTrainingTypes(trainingSnap.val());
      if (shotSnap.exists()) setShots(shotSnap.val());
      if (strategySnap.exists()) setStrategies(strategySnap.val());
      if (variationSnap.exists()) setVariations(variationSnap.val());
    };

    fetchRefs();
  }, [uid]);

  const handleSetActive = async (focusId) => {
    await update(ref(db, `players/${uid}`), {
      activeFocusId: focusId,
    });
  };

  const handleSaveNote = async (focusId, note) => {
    await update(ref(db, `playerFocusHistory/${focusId}`), {
      playerNote: note,
    });
    setPlayerNotes({ ...playerNotes, [focusId]: note });
  };

  const handleProfileUpdate = async () => {
    await update(ref(db, `players/${uid}`), editData);
    setEditProfile(false);
  };

  return (
    <Container>
      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box mb={4} flex={1}>
          {editProfile ? (
            <>
              <TextField
                label="First Name"
                value={editData.firstName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, firstName: e.target.value })
                }
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Last Name"
                value={editData.lastName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, lastName: e.target.value })
                }
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Ranking"
                value={editData.currentRanking || ""}
                onChange={(e) =>
                  setEditData({ ...editData, currentRanking: e.target.value })
                }
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Gender"
                value={editData.gender || ""}
                onChange={(e) =>
                  setEditData({ ...editData, gender: e.target.value })
                }
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Date of Birth"
                value={editData.dob || ""}
                onChange={(e) =>
                  setEditData({ ...editData, dob: e.target.value })
                }
                fullWidth
                sx={{ mb: 1 }}
              />
              <Button
                onClick={handleProfileUpdate}
                variant="contained"
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button onClick={() => setEditProfile(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                {player?.firstName || ""} {player?.lastName || ""}
              </Typography>
              <Typography variant="subtitle1">
                Ranking: {player?.currentRanking || "N/A"}
              </Typography>
              <Typography variant="subtitle1">
                Gender: {player?.gender || "N/A"}
              </Typography>
              <Typography variant="subtitle1">
                Date of Birth: {player?.dob || "N/A"}
              </Typography>
              <Button onClick={() => setEditProfile(true)} sx={{ mt: 1 }}>
                Edit Profile
              </Button>
            </>
          )}
        </Box>
        <Box
          sx={{
            width: 120,
            height: 120,
            backgroundColor: "grey.300",
            borderRadius: "50%",
            ml: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "text.secondary",
          }}
        >
          Profile
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5">Focus Areas</Typography>
      <List>
        {focusItems.map(([id, item]) => (
          <ListItem key={id} divider>
            <Box flex={1}>
              <Typography variant="subtitle1">
                {focusAreas[item.focusArea]?.name || item.focusArea}
              </Typography>
              <Typography variant="body2">
                Start: {item.startDate}, End: {item.endDate || "—"}
              </Typography>
              <Typography variant="body2">
                Instructor Notes: {item.progressNotes || "—"}
              </Typography>
              <TextField
                label="My Notes"
                fullWidth
                multiline
                minRows={2}
                value={playerNotes[id] ?? item.playerNote ?? ""}
                onChange={(e) =>
                  setPlayerNotes({ ...playerNotes, [id]: e.target.value })
                }
                onBlur={(e) => handleSaveNote(id, e.target.value)}
                sx={{ mt: 1 }}
              />
            </Box>
            <Button
              onClick={() => handleSetActive(id)}
              sx={{ ml: 2, minWidth: 40 }}
            >
              🎯
            </Button>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5">Session History</Typography>
      {sessions.map(([id, session]) => (
        <Box key={id} mb={3}>
          <Typography variant="h6">
            {session.date} -{" "}
            {trainingTypes[session.trainingTypeId]?.name || "Unknown"}
          </Typography>

          <Typography variant="subtitle1" mt={1}>
            Shot Observations:
          </Typography>
          {(session.shotObservationIds || []).map((obsId) => (
            <ObservationItem
              key={obsId}
              path={`shotBasedObservations/${obsId}`}
              shots={shots}
              variations={variations}
            />
          ))}

          <Typography variant="subtitle1" mt={1}>
            Strategy Observations:
          </Typography>
          {(session.strategyObservationIds || []).map((obsId) => (
            <ObservationItem
              key={obsId}
              path={`strategyBasedObservations/${obsId}`}
              strategies={strategies}
            />
          ))}
        </Box>
      ))}
    </Container>
  );
}

function ObservationItem({
  path,
  shots = {},
  variations = {},
  strategies = {},
}) {
  const [obs, setObs] = useState(null);

  useEffect(() => {
    const obsRef = ref(db, path);
    onValue(obsRef, (snap) => {
      if (snap.exists()) setObs(snap.val());
    });
  }, [path]);

  if (!obs) return null;

  let label = "";
  if (obs.shotType) {
    label += shots[obs.shotType]?.name || obs.shotType;
    if (obs.shotVariation) {
      label += ` (${variations[obs.shotVariation]?.name || obs.shotVariation})`;
    }
  } else if (obs.strategyType) {
    label += strategies[obs.strategyType]?.name || obs.strategyType;
  }

  return (
    <Box ml={2} mb={1}>
      <Typography variant="body2">
        {label} - Rating: {obs.performanceRating || "—"}
      </Typography>
      <Typography variant="caption">{obs.comments || "—"}</Typography>
    </Box>
  );
}

export default MyProfile;
