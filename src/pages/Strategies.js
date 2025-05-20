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

function Strategies() {
  const [strategies, setStrategies] = useState({});
  const [newStrategy, setNewStrategy] = useState("");
  const { showSuccess, showError, ToastComponent } = useToast();

  useEffect(() => {
    const strategiesRef = ref(db, "strategies");
    return onValue(strategiesRef, (snapshot) => {
      setStrategies(snapshot.val() || {});
    });
  }, []);

  const handleAdd = async () => {
    if (!newStrategy.trim()) return;
    try {
      await push(ref(db, "strategies"), { name: newStrategy.trim() });
      showSuccess("Strategy added");
      setNewStrategy("");
    } catch {
      showError("Failed to add strategy");
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `strategies/${id}`));
      showSuccess("Strategy deleted");
    } catch {
      showError("Failed to delete strategy");
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Manage Strategies
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="New Strategy"
            value={newStrategy}
            onChange={(e) => setNewStrategy(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Box>

        <List>
          {Object.entries(strategies).map(([id, item]) => (
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

export default Strategies;
