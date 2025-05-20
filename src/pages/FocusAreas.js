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

function FocusAreas() {
  const [focusAreas, setFocusAreas] = useState({});
  const [newFocus, setNewFocus] = useState("");
  const { showSuccess, showError, ToastComponent } = useToast();

  useEffect(() => {
    const focusRef = ref(db, "focusAreas");
    return onValue(focusRef, (snapshot) => {
      setFocusAreas(snapshot.val() || {});
    });
  }, []);

  const handleAdd = async () => {
    if (!newFocus.trim()) return;
    try {
      await push(ref(db, "focusAreas"), { name: newFocus.trim() });
      showSuccess("Focus area added");
      setNewFocus("");
    } catch {
      showError("Failed to add focus area");
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `focusAreas/${id}`));
      showSuccess("Deleted");
    } catch {
      showError("Failed to delete");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Manage Focus Areas
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="New Focus Area"
            value={newFocus}
            onChange={(e) => setNewFocus(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Box>

        <List>
          {Object.entries(focusAreas).map(([id, item]) => (
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

export default FocusAreas;
