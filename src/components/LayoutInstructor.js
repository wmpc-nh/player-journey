import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Drawer,
  Divider,
} from "@mui/material";
import SignOutButton from "./SignOutButton";

function Layout({ children }) {
  const [players, setPlayers] = useState({});
  const location = useLocation();
  const selectedId = location.pathname.startsWith("/player/")
    ? location.pathname.split("/player/")[1]
    : null;

  useEffect(() => {
    const playersRef = ref(db, "players");
    const unsubscribe = onValue(playersRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const filtered = Object.entries(data).filter(([, p]) =>
          (p.instructorIds || []).includes(
            "a4ce8917-68a7-4e3e-bfe3-7a5f9bd4fa0d"
          )
        );
        // Sort by last name
        filtered.sort(([, a], [, b]) => a.lastName.localeCompare(b.lastName));
        setPlayers(Object.fromEntries(filtered));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 250,
            boxSizing: "border-box",
            p: 2,
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          My Players
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          component={Link}
          to="/add-player"
          sx={{ mb: 2 }}
        >
          Add Player
        </Button>
        <Divider sx={{ mb: 2 }} />
        <List dense>
          {Object.entries(players).map(([id, p]) => (
            <ListItem
              key={id}
              button
              component={Link}
              to={`/player/${id}`}
              selected={id === selectedId}
            >
              <ListItemText primary={`${p.lastName}, ${p.firstName}`} />
            </ListItem>
          ))}
        </List>
        <SignOutButton />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
