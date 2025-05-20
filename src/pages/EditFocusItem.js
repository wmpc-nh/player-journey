import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { ref, get, child, update } from "firebase/database";
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

function EditFocusItem() {
  const { focusItemId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, ToastComponent } = useToast();
  const [hasLoaded, setHasLoaded] = useState(false);

  const [focusAreas, setFocusAreas] = useState({});
  const [formData, setFormData] = useState({
    focusArea: "",
    startDate: "",
    endDate: "",
    progressNotes: "",
  });
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (hasLoaded) return; // 🚫 don't re-run if already loaded

      try {
        const focusSnap = await get(child(ref(db), "focusAreas"));
        if (focusSnap.exists()) setFocusAreas(focusSnap.val());

        const itemSnap = await get(
          child(ref(db), `playerFocusHistory/${focusItemId}`)
        );
        if (itemSnap.exists()) {
          const data = itemSnap.val();

          const normalizeDate = (d) => {
            if (!d) return "";
            const date = new Date(d);
            return isNaN(date) ? "" : date.toISOString().split("T")[0];
          };

          setFormData({
            focusArea: data.focusArea || "",
            startDate: normalizeDate(data.startDate),
            endDate: normalizeDate(data.endDate),
            progressNotes: data.progressNotes || "",
          });

          setPlayerId(data.playerId);
          setHasLoaded(true); // ✅ Prevent further overwrites
        } else {
          showError("Focus item not found");
        }
      } catch (err) {
        console.error("Error loading focus item:", err);
        showError("Failed to load data");
      }
    };

    fetchData();
  }, [focusItemId, hasLoaded, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await update(ref(db, `playerFocusHistory/${focusItemId}`), formData);
      showSuccess("Focus item updated!");
      setTimeout(() => navigate(`/player/${playerId}`), 1000);
    } catch (err) {
      console.error("Error saving focus item:", err);
      showError("Failed to update focus item");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Edit Focus Item
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
              label="Focus Area"
            >
              {Object.entries(focusAreas).map(([id, area]) => (
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
            value={formData.endDate || ""}
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
              onClick={() => navigate(-1)}
              sx={{ backgroundColor: "white", color: "black" }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </Box>
        </Box>

        {ToastComponent}
      </Container>
    </Layout>
  );
}

export default EditFocusItem;
