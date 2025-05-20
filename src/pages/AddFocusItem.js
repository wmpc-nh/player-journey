import { useNavigate, useLocation } from "react-router-dom";
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
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Layout from "../components/LayoutInstructor";
import useToast from "../hooks/useToast";

function AddFocusItem() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const playerId = params.get("playerId");

  const navigate = useNavigate();
  const { showSuccess, showError, ToastComponent } = useToast();

  const [focusAreas, setFocusAreas] = useState({});
  const [formData, setFormData] = useState({
    focusArea: "",
    startDate: "",
    endDate: "",
    progressNotes: "",
  });

  const instructorId = "a4ce8917-68a7-4e3e-bfe3-7a5f9bd4fa0d";

  useEffect(() => {
    const fetchRefs = async () => {
      try {
        const focusSnap = await get(child(ref(db), "focusAreas"));
        if (focusSnap.exists()) setFocusAreas(focusSnap.val());
      } catch (err) {
        console.error("Error loading focus areas:", err);
        showError("Failed to load focus areas");
      }
    };
    fetchRefs();
  }, [showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFocus = {
      playerId,
      instructorId,
      ...formData,
    };

    try {
      await push(ref(db, "playerFocusHistory"), newFocus);
      showSuccess("Focus item saved!");
      setTimeout(() => navigate(`/player/${playerId}`), 1000);
    } catch (err) {
      console.error("Error saving focus item:", err);
      showError("Failed to save focus item");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Add Player Focus Item
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <FormControl fullWidth required>
            <InputLabel>Focus Area</InputLabel>
            <Select
              name="focusArea"
              value={formData.focusArea}
              onChange={handleChange}
              renderValue={(id) => focusAreas[id]?.name || ""}
            >
              {Object.entries(focusAreas)
                .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                .map(([id, area]) => (
                  <MenuItem key={id} value={id}>
                    {area.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <TextField
            label="End Date"
            type="date"
            name="endDate"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={handleChange}
          />
          <TextField
            label="Progress Notes"
            name="progressNotes"
            multiline
            rows={4}
            value={formData.progressNotes}
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
              Save Focus
            </Button>
          </Box>
        </Box>

        {ToastComponent}
      </Container>
    </Layout>
  );
}

export default AddFocusItem;
