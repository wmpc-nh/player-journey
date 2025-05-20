import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { ref, push } from "firebase/database";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Box,
} from "@mui/material";
import useToast from "../hooks/useToast"; // 👈 new hook

function AddPlayer() {
  const navigate = useNavigate();
  const instructorId = "instructor_001";
  const { showSuccess, showError, ToastComponent } = useToast(); // 👈 grab toast API

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    currentRanking: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPlayerRef = ref(db, "players");
    const newPlayer = {
      ...formData,
      currentRanking: parseFloat(formData.currentRanking || 0),
      dob: formData.dob || null,
      sessionIds: [],
      focusHistoryIds: [],
      instructorIds: [instructorId],
      isActive: true,
    };

    try {
      await push(newPlayerRef, newPlayer);
      showSuccess("Player added successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Error adding player:", error);
      showError("Failed to add player.");
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Add New Player
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Date of Birth"
            type="date"
            name="dob"
            InputLabelProps={{ shrink: true }}
            value={formData.dob}
            onChange={handleChange}
          />
          <TextField
            label="Current Ranking"
            name="currentRanking"
            type="number"
            step="0.1"
            value={formData.currentRanking}
            onChange={handleChange}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                backgroundColor: "white",
                color: "black",
                borderColor: "grey.300",
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Add Player
            </Button>
          </Box>
        </Box>
      </Container>
      {ToastComponent} {/* 👈 shows success or error message */}
    </>
  );
}

export default AddPlayer;
