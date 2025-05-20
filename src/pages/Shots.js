import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { ref, onValue, push, remove } from "firebase/database";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../components/LayoutInstructor";
import useToast from "../hooks/useToast";

function Shots() {
  const [shots, setShots] = useState({});
  const [newShot, setNewShot] = useState("");
  const { showSuccess, showError, ToastComponent } = useToast();

  useEffect(() => {
    const shotsRef = ref(db, "shots");
    return onValue(shotsRef, (snapshot) => {
      setShots(snapshot.val() || {});
    });
  }, []);

  const handleAdd = async () => {
    if (!newShot.trim()) return;
    try {
      await push(ref(db, "shots"), { name: newShot.trim() });
      showSuccess("Shot added");
      setNewShot("");
    } catch {
      showError("Failed to add shot");
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `shots/${id}`));
      showSuccess("Shot deleted");
    } catch {
      showError("Failed to delete shot");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Manage Shots
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="New Shot"
            value={newShot}
            onChange={(e) => setNewShot(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Box>

        <List>
          {Object.entries(shots).map(([id, item]) => (
            <ListItem
              key={id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>

        {ToastComponent}
      </Container>
    </Layout>
  );
}

export default Shots;
