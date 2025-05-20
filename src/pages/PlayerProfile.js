import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { ref, onValue, get, child, update } from "firebase/database";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Divider,
} from "@mui/material";
import Layout from "../components/LayoutInstructor";

function PlayerProfile() {
  const [focusAreas, setFocusAreas] = useState({});
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [focusItems, setFocusItems] = useState([]);
  const [trainingTypes, setTrainingTypes] = useState({});
  const [activeFocus, setActiveFocus] = useState(null);
  const [allPlayers, setAllPlayers] = useState({});
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const fetchRefs = async () => {
      const focusSnap = await get(child(ref(db), "focusAreas"));
      if (focusSnap.exists()) setFocusAreas(focusSnap.val());
    };
    fetchRefs();

    const playerRef = ref(db, `players/${playerId}`);
    const unsubPlayer = onValue(playerRef, (snap) => {
      if (snap.exists()) setPlayer(snap.val());
    });

    const sessionRef = ref(db, "sessions");
    const unsubSessions = onValue(sessionRef, (snap) => {
      if (snap.exists()) {
        const list = Object.entries(snap.val()).filter(([, session]) =>
          session.playerIds?.includes(playerId)
        );
        setSessions(list);
      }
    });

    const fetchTrainingTypes = async () => {
      try {
        const snap = await get(child(ref(db), "trainingTypes"));
        if (snap.exists()) {
          setTrainingTypes(snap.val());
        }
      } catch (err) {
        console.error("Failed to load training types", err);
      }
    };

    fetchTrainingTypes();

    const focusRef = ref(db, "playerFocusHistory");
    const unsubFocus = onValue(focusRef, (snap) => {
      if (snap.exists()) {
        const focusData = snap.val();

        let list = Object.entries(focusData).filter(
          ([, item]) => item.playerId === playerId
        );

        // Optional filtering by toggle
        if (!showCompleted) {
          list = list.filter(([, item]) => !item.endDate);
        }

        // Sort by start date descending
        list.sort(
          ([, a], [, b]) => new Date(b.startDate) - new Date(a.startDate)
        );

        setFocusItems(list);

        // Set active focus if available
        if (player?.activeFocusId) {
          const match = list.find(([id]) => id === player.activeFocusId);
          setActiveFocus(match ? match[1] : null);
        }
      }
    });

    const allPlayersRef = ref(db, "players");
    const unsubAllPlayers = onValue(allPlayersRef, (snap) => {
      if (snap.exists()) {
        const filtered = Object.entries(snap.val()).filter(([, p]) =>
          (p.instructorIds || []).includes(
            "a4ce8917-68a7-4e3e-bfe3-7a5f9bd4fa0d"
          )
        );
        setAllPlayers(Object.fromEntries(filtered));
      }
    });

    return () => {
      unsubPlayer();
      unsubSessions();
      unsubFocus();
      unsubAllPlayers();
    };
  }, [playerId, player?.activeFocusId, showCompleted]);

  useEffect(() => {
    if (!player || !focusItems.length) return;
    const match = focusItems.find(([id]) => id === player.activeFocusId);
    setActiveFocus(match ? match[1] : null);
  }, [player, focusItems]);

  if (!player || Object.keys(player).length === 0)
    return (
      <Layout>
        <Container>
          <Typography>Loading...</Typography>
        </Container>
      </Layout>
    );

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box display="flex" gap={4} flexDirection={{ xs: "column", md: "row" }}>
          {/* Right: Player Details */}
          <Box flex={3}>
            {/* Player Info */}
            <Box
              mb={4}
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box mb={4}>
                <Typography variant="h4" gutterBottom>
                  {player.firstName} {player.lastName}
                </Typography>
                <Typography variant="subtitle1">
                  Ranking: {player.currentRanking || "N/A"}
                </Typography>
                <Typography variant="subtitle1">
                  Gender: {player.gender || "N/A"}
                </Typography>
                <Typography variant="subtitle1">
                  Date of Birth: {player.dob || "N/A"}
                </Typography>
                {activeFocus && (
                  <Box
                    mb={2}
                    p={2}
                    border="1px solid"
                    borderColor="grey.300"
                    borderRadius={2}
                  >
                    <Typography variant="h6" color="primary">
                      🎯 Active Focus:{" "}
                      {focusAreas[activeFocus.focusArea]?.name ||
                        activeFocus.focusArea}
                    </Typography>
                    <Typography variant="body2">
                      Notes: {activeFocus.progressNotes || "—"}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Button
                  variant="contained"
                  component={Link}
                  to={`/start-session?playerId=${playerId}`}
                >
                  Start New Session
                </Button>
              </Box>
              {/* Profile Picture Placeholder */}
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

            {/* Focus Items */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h5">Focus Areas</Typography>

              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/add-focus?playerId=${playerId}`}
                >
                  Add Focus
                </Button>
                <Button
                  size="small"
                  onClick={() => setShowCompleted((prev) => !prev)}
                >
                  {showCompleted ? "Hide Completed" : "Show Completed"}
                </Button>
              </Box>
            </Box>

            <List>
              {focusItems.map(([id, focus]) => (
                <ListItem key={id} divider>
                  <Button
                    onClick={async () => {
                      await update(ref(db, `players/${playerId}`), {
                        activeFocusId: id,
                      });
                      const snap = await get(
                        child(ref(db), `players/${playerId}`)
                      );
                      if (snap.exists()) setPlayer(snap.val());
                    }}
                    sx={{ minWidth: "auto", mr: 2 }}
                    title="Set as Active Focus"
                  >
                    🎯
                  </Button>
                  <ListItemText
                    primary={
                      focusAreas[focus.focusArea]?.name || focus.focusArea
                    }
                    secondary={
                      <>
                        Start: {focus.startDate}, End: {focus.endDate || "—"}
                        <br />
                        Notes: {focus.progressNotes || "—"}
                      </>
                    }
                  />
                  {/* ✏️ Add Edit Button */}
                  <Button
                    component={Link}
                    to={`/edit-focus/${id}`}
                    variant="outlined"
                    size="small"
                    sx={{ ml: 2 }}
                  >
                    Edit
                  </Button>
                </ListItem>
              ))}
            </List>
            {/* Session History */}
            <Box>
              <Typography variant="h5" gutterBottom>
                Session History
              </Typography>
              <List>
                {sessions.map(([id, session]) => (
                  <ListItem key={id} divider>
                    <ListItemText
                      primary={`Session on ${session.date}`}
                      secondary={`Training Type: ${
                        trainingTypes[session.trainingTypeId]?.name ||
                        session.trainingTypeId
                      }`}
                    />
                    <Button
                      component={Link}
                      to={`/session/${id}`}
                      variant="outlined"
                      size="small"
                    >
                      View
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}

export default PlayerProfile;
