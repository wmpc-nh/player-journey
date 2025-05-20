import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { ref, get, child, push } from "firebase/database";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
} from "@mui/material";
import Layout from "../components/LayoutInstructor";
import useToast from "../hooks/useToast"; // 👈 import hook

function StartSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preselectedPlayerId = params.get("playerId") || "";

  const [players, setPlayers] = useState({});
  const [trainingTypes, setTrainingTypes] = useState({});
  const { showSuccess, showError, ToastComponent } = useToast(); // 👈 get toast methods

  const [formData, setFormData] = useState({
    playerId: preselectedPlayerId,
    trainingTypeId: "",
    date: new Date().toISOString().split("T")[0],
  });

  const instructorId = "instructor_001";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerSnap = await get(child(ref(db), "players"));
        if (playerSnap.exists()) {
          setPlayers(playerSnap.val());
        }

        const trainingSnap = await get(child(ref(db), "trainingTypes"));
        if (trainingSnap.exists()) {
          setTrainingTypes(trainingSnap.val());
        }
      } catch (error) {
        console.error("Error loading data:", error);
        showError("Failed to load data");
      }
    };
    fetchData();
  }, [showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionData = {
      trainingTypeId: formData.trainingTypeId,
      playerIds: [formData.playerId],
      instructorId,
      date: formData.date,
      generalObservations: "",
      shotObservationIds: [],
      strategyObservationIds: [],
      focus: "",
    };

    try {
      const sessionRef = ref(db, "sessions");
      const newSession = await push(sessionRef, sessionData);
      showSuccess("Session created!");
      setTimeout(() => navigate(`/session/${newSession.key}`), 1000);
    } catch (err) {
      console.error("Failed to create session", err);
      showError("Failed to create session");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Start New Session
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {formData.playerId ? (
            <TextField
              label="Player"
              value={
                players[formData.playerId]?.firstName +
                  " " +
                  players[formData.playerId]?.lastName || ""
              }
              InputProps={{ readOnly: true }}
              fullWidth
            />
          ) : (
            <FormControl fullWidth required>
              <InputLabel id="player-label">Player</InputLabel>
              <Select
                labelId="player-label"
                name="playerId"
                value={formData.playerId}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {Object.entries(players).map(([id, player]) => (
                  <MenuItem key={id} value={id}>
                    {player.firstName} {player.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth required>
            <InputLabel id="training-label">Training Type</InputLabel>
            <Select
              labelId="training-label"
              name="trainingTypeId"
              value={formData.trainingTypeId}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Object.entries(trainingTypes).map(([id, type]) => (
                <MenuItem key={id} value={id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              sx={{
                backgroundColor: "white",
                color: "black",
                borderColor: "grey.300",
              }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create Session
            </Button>
          </Box>
        </Box>
        {ToastComponent} {/* 👈 plug in the toast renderer */}
      </Container>
    </Layout>
  );
}

export default StartSession;
