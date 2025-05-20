import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { ref, onValue, get, child } from "firebase/database";
import {
  Container,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Layout from "../components/LayoutInstructor";

function SessionDetail() {
  const [trainingTypes, setTrainingTypes] = useState({});
  const [shots, setShots] = useState({});
  const [variations, setVariations] = useState({});
  const [strategies, setStrategies] = useState({});
  const [focusAreas, setFocusAreas] = useState({});
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [shotObservations, setShotObservations] = useState([]);
  const [strategyObservations, setStrategyObservations] = useState([]);
  const [focusItems, setFocusItems] = useState([]);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const dbRef = ref(db);
    const fetchRefs = async () => {
      const [trainingSnap, shotsSnap, varsSnap, stratSnap, focusSnap] =
        await Promise.all([
          get(child(dbRef, "trainingTypes")),
          get(child(dbRef, "shots")),
          get(child(dbRef, "shotVariations")),
          get(child(dbRef, "strategies")),
          get(child(dbRef, "focusAreas")),
        ]);
      if (trainingSnap.exists()) setTrainingTypes(trainingSnap.val());
      if (shotsSnap.exists()) setShots(shotsSnap.val());
      if (varsSnap.exists()) setVariations(varsSnap.val());
      if (stratSnap.exists()) setStrategies(stratSnap.val());
      if (focusSnap.exists()) setFocusAreas(focusSnap.val());
    };
    fetchRefs();
    const sessionRef = ref(db, `sessions/${sessionId}`);
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        setSession(snapshot.val());
      }
    });

    const fetchData = async () => {
      try {
        const dbRef = ref(db);

        // fetch session
        const sessionSnap = await get(child(dbRef, `sessions/${sessionId}`));
        if (sessionSnap.exists()) {
          const sessionData = sessionSnap.val();
          setSession(sessionData);

          // fetch player
          const playerId = sessionData.playerIds?.[0];
          if (playerId) {
            const playerSnap = await get(child(dbRef, `players/${playerId}`));
            if (playerSnap.exists()) {
              setPlayer(playerSnap.val());
            }
          }
        }
      } catch (err) {
        console.error("Failed to load session or player", err);
      }
    };

    fetchData();

    const shotRef = ref(db, "shotBasedObservations");
    const strategyRef = ref(db, "strategyBasedObservations");
    const focusRef = ref(db, "playerFocusHistory");

    const unsubShot = onValue(shotRef, (snap) => {
      if (snap.exists()) {
        const filtered = Object.entries(snap.val()).filter(
          ([, item]) => item.sessionId === sessionId
        );
        setShotObservations(filtered);
      }
    });

    const unsubStrategy = onValue(strategyRef, (snap) => {
      if (snap.exists()) {
        const filtered = Object.entries(snap.val()).filter(
          ([, item]) => item.sessionId === sessionId
        );
        setStrategyObservations(filtered);
      }
    });

    const unsubFocus = onValue(focusRef, (snap) => {
      if (snap.exists()) {
        const filtered = Object.entries(snap.val()).filter(
          ([, item]) => item.playerId === session?.playerIds?.[0]
        );
        setFocusItems(filtered);
      }
    });

    return () => {
      unsubscribe();
      unsubShot();
      unsubStrategy();
      unsubFocus();
    };
  }, [sessionId, session?.playerIds]);

  if (!session)
    return (
      <Layout>
        <Container>
          <Typography>Loading...</Typography>
        </Container>
      </Layout>
    );

  return (
    <Layout>
      <Container maxWidth="md">
        {player && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Button
              component={Link}
              to={`/player/${session.playerIds[0]}`}
              variant="text"
              sx={{ textTransform: "none" }}
            >
              ← Back to Profile
            </Button>

            <Typography variant="h4" textAlign="center" flexGrow={1}>
              {player.firstName} {player.lastName}
            </Typography>

            {/* Optional space filler for layout symmetry */}
            <Box width={150} />
          </Box>
        )}
        <Typography variant="h4" gutterBottom>
          Session Details
        </Typography>

        <Typography variant="subtitle1">Date: {session.date}</Typography>
        <Typography variant="subtitle1" gutterBottom>
          Training Type:{" "}
          {trainingTypes[session.trainingTypeId]?.name ||
            session.trainingTypeId}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Shot Observations */}
        <Box mb={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Shot Observations</Typography>
            <Button
              variant="outlined"
              component={Link}
              to={`/session/${sessionId}/add-shot`}
            >
              Add Shot
            </Button>
          </Box>
          <List>
            {shotObservations.map(([id, item]) => (
              <ListItem key={id} divider alignItems="flex-start">
                <ListItemText
                  primary={`${shots[item.shotType]?.name || item.shotType} (${variations[item.shotVariation]?.name || "—"}) - Rating: ${item.performanceRating}`}
                  secondary={item.comments || "—"}
                />
                <Button
                  component={Link}
                  to={`/edit-shot/${id}`}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  Edit
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Strategy Observations */}
        <Box mb={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Strategy Observations</Typography>
            <Button
              variant="outlined"
              component={Link}
              to={`/session/${sessionId}/add-strategy`}
            >
              Add Strategy
            </Button>
          </Box>
          <List>
            {strategyObservations.map(([id, item]) => (
              <ListItem key={id} divider alignItems="flex-start">
                <ListItemText
                  primary={`${
                    strategies[item.strategyType]?.name || item.strategyType
                  } - Rating: ${item.performanceRating}`}
                  secondary={item.comments || "—"}
                />
                <Button
                  component={Link}
                  to={`/edit-strategy/${id}`}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  Edit
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Focus Items */}
        <Box mb={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Focus History</Typography>
            <Button
              variant="outlined"
              component={Link}
              to={`/add-focus?playerId=${session.playerIds[0]}`}
            >
              Add Focus
            </Button>
          </Box>
          <List>
            {focusItems.map(([id, item]) => (
              <ListItem key={id} divider>
                <ListItemText
                  primary={focusAreas[item.focusArea]?.name || item.focusArea}
                  secondary={
                    <>
                      Start: {item.startDate}, End: {item.endDate || "—"}
                      <br />
                      Notes: {item.progressNotes || "—"}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Layout>
  );
}

export default SessionDetail;
