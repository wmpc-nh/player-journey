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

function ShotVariations() {
  const [variations, setVariations] = useState({});
  const [newVariation, setNewVariation] = useState("");
  const { showSuccess, showError, ToastComponent } = useToast();

  useEffect(() => {
    const refVar = ref(db, "shotVariations");
    return onValue(refVar, (snapshot) => {
      setVariations(snapshot.val() || {});
    });
  }, []);

  const handleAdd = async () => {
    if (!newVariation.trim()) return;
    try {
      await push(ref(db, "shotVariations"), { name: newVariation.trim() });
      showSuccess("Variation added");
      setNewVariation("");
    } catch {
      showError("Failed to add variation");
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `shotVariations/${id}`));
      showSuccess("Variation deleted");
    } catch {
      showError("Failed to delete variation");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Manage Shot Variations
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="New Variation"
            value={newVariation}
            onChange={(e) => setNewVariation(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Box>

        <List>
          {Object.entries(variations).map(([id, item]) => (
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

export default ShotVariations;
