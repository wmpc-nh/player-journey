// src/components/SignOutButton.js
import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function SignOutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in");
    } catch (err) {
      console.error("Sign-out failed", err);
    }
  };

  return (
    <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
      Sign Out
    </Button>
  );
}
