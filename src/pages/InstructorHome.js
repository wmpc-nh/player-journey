import { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Layout from "../components/LayoutInstructor";

function InstructorHome() {
  const instructorId = "a4ce8917-68a7-4e3e-bfe3-7a5f9bd4fa0d";
  const [players, setPlayers] = useState({});
  const navigate = useNavigate();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    playerId: null,
  });

  useEffect(() => {
    const playersRef = ref(db, "players");
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      const filtered = {};
      for (const [id, player] of Object.entries(data || {})) {
        if (
          (player.instructorIds || []).includes(instructorId) &&
          player.isActive !== false // only show active
        ) {
          filtered[id] = player;
        }
      }
      setPlayers(filtered);
    });

    return () => unsubscribe();
  }, []);

  const handleArchive = async (playerId) => {
    const playerRef = ref(db, `players/${playerId}`);
    await update(playerRef, { isActive: false });
    setConfirmDialog({ open: false, playerId: null });
  };

  return (
    <Layout>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4">My Players</Typography>
        <Box>
          <Button
            variant="contained"
            component={Link}
            to="/add-player"
            sx={{ mr: 2 }}
          >
            Add New Player
          </Button>
          <Button variant="outlined" component={Link} to="/start-session">
            Start New Session
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {Object.entries(players).map(([id, player]) => (
          <Grid item xs={12} sm={6} md={4} key={id}>
            <Card
              sx={{
                cursor: "pointer",
                "&:hover": { boxShadow: 6 },
                position: "relative",
              }}
              onClick={() => navigate(`/player/${id}`)}
            >
              <CardContent>
                {/* Archive Icon (stops propagation) */}
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDialog({ open: true, playerId: id });
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                <Typography variant="h5">{player.lastName}</Typography>
                <Typography variant="h7">{player.firstName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ranking: {player.currentRanking || "N/A"}
                </Typography>

                {/* Optional explicit view button (still stops propagation) */}
                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/player/${id}`);
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirm Archive Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, playerId: null })}
      >
        <DialogTitle>Are you sure you want to archive this player?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, playerId: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleArchive(confirmDialog.playerId)}
            variant="contained"
            color="error"
          >
            Archive
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default InstructorHome;
