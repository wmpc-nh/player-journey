import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { ref, push, get, child } from "firebase/database";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Layout from "../components/LayoutInstructor";
import useToast from "../hooks/useToast"; // 👈 import

function AddStrategyObservation() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, ToastComponent } = useToast(); // 👈 use hook
  const [strategies, setStrategies] = useState({});

  useEffect(() => {
    const fetchStrategies = async () => {
      const snap = await get(child(ref(db), "strategies"));
      if (snap.exists()) setStrategies(snap.val());
    };
    fetchStrategies();
  }, []);

  const [formData, setFormData] = useState({
    strategyType: "",
    performanceRating: "",
    comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newObservation = {
      sessionId,
      ...formData,
      performanceRating: parseInt(formData.performanceRating),
    };

    try {
      await push(ref(db, "strategyBasedObservations"), newObservation);
      showSuccess("Strategy observation saved!");
      setTimeout(() => navigate(`/session/${sessionId}`), 1000);
    } catch (err) {
      console.error("Error saving strategy observation:", err);
      showError("Failed to save strategy observation");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Add Strategy-Based Observation
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <FormControl fullWidth required>
            <InputLabel>Strategy</InputLabel>
            <Select
              name="strategyId"
              value={formData.strategyId}
              onChange={handleChange}
            >
              {Object.entries(strategies)
                .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                .map(([id, s]) => (
                  <MenuItem key={id} value={id}>
                    {s.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="Performance Rating (1–5)"
            name="performanceRating"
            type="number"
            inputProps={{ min: 1, max: 5 }}
            value={formData.performanceRating}
            onChange={handleChange}
            required
          />
          <TextField
            label="Comments"
            name="comments"
            multiline
            rows={4}
            value={formData.comments}
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
            <Button variant="contained" type="submit">
              Save Observation
            </Button>
          </Box>
        </Box>

        {ToastComponent}
      </Container>
    </Layout>
  );
}

export default AddStrategyObservation;
