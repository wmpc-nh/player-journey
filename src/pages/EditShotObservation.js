// pages/EditShotObservation.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { ref, get, child, update } from "firebase/database";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import Layout from "../components/LayoutInstructor";

function EditShotObservation() {
  const { observationId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shotType: "",
    shotVariation: "",
    performanceRating: "",
    comments: "",
  });
  const [shots, setShots] = useState({});
  const [variations, setVariations] = useState({});

  useEffect(() => {
    const dbRef = ref(db);
    const fetchData = async () => {
      const snap = await get(
        child(dbRef, `shotBasedObservations/${observationId}`)
      );
      if (snap.exists()) {
        setFormData(snap.val());
      }

      const shotsSnap = await get(child(dbRef, "shots"));
      if (shotsSnap.exists()) setShots(shotsSnap.val());

      const varsSnap = await get(child(dbRef, "shotVariations"));
      if (varsSnap.exists()) setVariations(varsSnap.val());
    };

    fetchData();
  }, [observationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await update(ref(db, `shotBasedObservations/${observationId}`), formData);
      navigate(-1); // go back
    } catch (err) {
      console.error("Error updating shot observation:", err);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Edit Shot Observation
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <FormControl fullWidth>
            <InputLabel>Shot Type</InputLabel>
            <Select
              name="shotType"
              value={formData.shotType}
              onChange={handleChange}
            >
              {Object.entries(shots).map(([id, shot]) => (
                <MenuItem key={id} value={id}>
                  {shot.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Variation</InputLabel>
            <Select
              name="shotVariation"
              value={formData.shotVariation}
              onChange={handleChange}
            >
              {Object.entries(variations).map(([id, variation]) => (
                <MenuItem key={id} value={id}>
                  {variation.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Performance Rating"
            name="performanceRating"
            type="number"
            value={formData.performanceRating}
            onChange={handleChange}
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
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}

export default EditShotObservation;
