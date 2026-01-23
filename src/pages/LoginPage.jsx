import React, { useState } from "react";
import { Button, TextField, Stack, Snackbar, Alert } from "@mui/material";
import AuthCard from "../components/AuthCard";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation, api } from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      dispatch(api.util.resetApiState());
      setToast({ open: true, msg: "Login successful", type: "success" });
      nav("/dashboard");
    } catch (err) {
      setToast({ open: true, msg: err?.data?.message || "Login failed", type: "error" });
    }
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to continue your journey">
      <form onSubmit={onSubmit}>
        <Stack spacing={3}>
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
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="text"
            fullWidth
            sx={{ fontWeight: 700, color: "primary.main", textTransform: "none" }}
          >
            Don't have an account? Sign Up
          </Button>
        </Stack>
      </form>
      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.type} sx={{ width: "100%" }}>{toast.msg}</Alert>
      </Snackbar>
    </AuthCard>
  );
}
