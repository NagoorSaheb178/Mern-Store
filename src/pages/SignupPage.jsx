import React, { useState } from "react";
import { Button, TextField, Stack, Snackbar, Alert } from "@mui/material";
import AuthCard from "../components/AuthCard";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation, api } from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

  const [signup, { isLoading }] = useSignupMutation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup({ name, email, password }).unwrap();
      dispatch(setCredentials(res));
      dispatch(api.util.resetApiState());
      setToast({ open: true, msg: "Account created", type: "success" });
      nav("/dashboard");
    } catch (err) {
      setToast({ open: true, msg: err?.data?.message || "Signup failed", type: "error" });
    }
  };

  return (
    <AuthCard title="Create Account" subtitle="Join us and start managing your products">
      <form onSubmit={onSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
          />
          <TextField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            type="email"
            required
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            type="password"
            required
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading}
            sx={{ py: 1.8, borderRadius: "14px", fontWeight: 800, fontSize: "1rem" }}
          >
            {isLoading ? "Creating..." : "Sign Up"}
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="text"
            fullWidth
            sx={{ fontWeight: 700, color: "primary.main", textTransform: "none" }}
          >
            Already have an account? Log In
          </Button>
        </Stack>
      </form>
      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.type} sx={{ width: "100%" }}>{toast.msg}</Alert>
      </Snackbar>
    </AuthCard>
  );
}
