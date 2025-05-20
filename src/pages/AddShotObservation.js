import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { ref, push, get, child } from "firebase/database";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import Layout from "../components/LayoutInstructor";
import useToast from "../hooks/useToast"; // 👈 import the toast hook
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

function AddShotObservation() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, ToastComponent } = useToast(); // 👈 grab toast API
  const [formData, setFormData] = useState({
    shotType: "",
    shotVariation: "",
    performanceRating: "",
    comments: "",
  });
  const [shots, setShots] = useState({});
  const [variations, setVariations] = useState({});

  useEffect(() => {
    const fetchRefs = async () => {
      const dbRef = ref(db);
      const [shotsSnap, varsSnap] = await Promise.all([
        get(child(dbRef, "shots")),
        get(child(dbRef, "shotVariations")),
      ]);
      if (shotsSnap.exists()) setShots(shotsSnap.val());
      if (varsSnap.exists()) setVariations(varsSnap.val());
    };
    fetchRefs();
  }, []);

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
      await push(ref(db, "shotBasedObservations"), newObservation);
      showSuccess("Shot observation saved!");
      setTimeout(() => navigate(`/session/${sessionId}`), 1000);
    } catch (err) {
      console.error("Error saving shot observation:", err);
      showError("Failed to save shot observation");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Add Shot-Based Observation
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <FormControl fullWidth required>
            <InputLabel>Shot</InputLabel>
            <Select
              name="shotType"
              value={formData.shotType}
              onChange={handleChange}
            >
              {Object.entries(shots)
                .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                .map(([id, s]) => (
                  <MenuItem key={id} value={id}>
                    {s.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Shot Variation</InputLabel>
            <Select
              name="shotVariation"
              value={formData.shotVariation}
              onChange={handleChange}
            >
              {Object.entries(variations).map(([id, v]) => (
                <MenuItem key={id} value={id}>
                  {v.name}
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

export default AddShotObservation;
