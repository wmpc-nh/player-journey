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
import useToast from "../hooks/useToast";
import Layout from "../components/LayoutInstructor";

function TrainingTypes() {
  const [trainingTypes, setTrainingTypes] = useState({});
  const [newType, setNewType] = useState("");
  const { showSuccess, showError, ToastComponent } = useToast();

  useEffect(() => {
    const trainingRef = ref(db, "trainingTypes");
    const unsub = onValue(trainingRef, (snapshot) => {
      if (snapshot.exists()) {
        setTrainingTypes(snapshot.val());
      } else {
        setTrainingTypes({});
      }
    });
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    if (!newType.trim()) return;
    try {
      await push(ref(db, "trainingTypes"), { name: newType.trim() });
      showSuccess("Training type added");
      setNewType("");
    } catch (err) {
      showError("Failed to add training type");
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `trainingTypes/${id}`));
      showSuccess("Deleted");
    } catch (err) {
      showError("Failed to delete");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Manage Training Types
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="New Training Type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Box>

        <List>
          {Object.entries(trainingTypes).map(([id, item]) => (
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

export default TrainingTypes;
