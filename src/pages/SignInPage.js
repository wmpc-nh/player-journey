// pages/SignInPage.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
} from "@mui/material";
import { auth, db, googleProvider } from "../firebase/firebaseConfig";
import { Link as RouterLink } from "react-router-dom";
import { ref, get } from "firebase/database";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await handleRoleRedirect(user.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleRoleRedirect = async (uid) => {
    try {
      const roleSnap = await get(ref(db, `users/${uid}/role`));
      const role = roleSnap.exists() ? roleSnap.val() : "player";
      if (role === "instructor") {
        navigate("/");
      } else {
        navigate(`/my-profile`);
      }
    } catch (err) {
      console.error("Failed to determine role:", err);
      navigate("/"); // fallback
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await handleRoleRedirect(result.user.uid);
    } catch (err) {
      console.error("Login failed:", err.code, err.message);
      alert(`Login failed: ${err.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleRoleRedirect(result.user.uid);
    } catch (err) {
      alert("Google login failed.");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={handleEmailLogin}>
            Sign in with Email
          </Button>

          <Typography textAlign="center" my={2}>
            — or —
          </Typography>

          <Button variant="outlined" onClick={handleGoogleLogin}>
            Sign in with Google
          </Button>
          <Typography align="center" mt={2}>
            Don’t have an account?
            <MuiLink component={RouterLink} to="/sign-up">
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignInPage;
