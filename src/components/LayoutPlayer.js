// src/components/LayoutPlayer.js
import { Box, Typography, AppBar, Toolbar, Button } from "@mui/material";
import SignOutButton from "./SignOutButton";
import { Link } from "react-router-dom";

function LayoutPlayer({ children }) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/my-profile"
            color="inherit"
            sx={{ textDecoration: "none" }}
          >
            My Profile
          </Typography>
          <SignOutButton />
        </Toolbar>
      </AppBar>

      <Box component="main" flexGrow={1} p={3}>
        {children}
      </Box>
    </Box>
  );
}

export default LayoutPlayer;
