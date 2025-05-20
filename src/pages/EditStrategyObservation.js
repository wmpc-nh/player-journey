// pages/EditStrategyObservation.js
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

function EditStrategyObservation() {
  const { observationId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    strategyType: "",
    performanceRating: "",
    comments: "",
  });
  const [strategies, setStrategies] = useState({});

  useEffect(() => {
    const dbRef = ref(db);
    const fetchData = async () => {
      const obsSnap = await get(
        child(dbRef, `strategyBasedObservations/${observationId}`)
      );
      if (obsSnap.exists()) {
        setFormData(obsSnap.val());
      }

      const stratSnap = await get(child(dbRef, "strategies"));
      if (stratSnap.exists()) setStrategies(stratSnap.val());
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
      await update(
        ref(db, `strategyBasedObservations/${observationId}`),
        formData
      );
      navigate(-1);
    } catch (err) {
      console.error("Error updating strategy observation:", err);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Edit Strategy Observation
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <FormControl fullWidth>
            <InputLabel>Strategy Type</InputLabel>
            <Select
              name="strategyType"
              value={formData.strategyType}
              onChange={handleChange}
            >
              {Object.entries(strategies).map(([id, strategy]) => (
                <MenuItem key={id} value={id}>
                  {strategy.name}
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

export default EditStrategyObservation;
