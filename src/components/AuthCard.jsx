import React from "react";
import { Paper, Box, Typography } from "@mui/material";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2, py: 4, background: "linear-gradient(135deg, #eef2ff 0%, #f1f5f9 100%)" }}>
      <Paper elevation={10} sx={{
        width: "100%", maxWidth: 450, borderRadius: 8, p: { xs: 4, sm: 6 },
        textAlign: "center",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#6366f1", mb: 1.5 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 5, fontWeight: 500 }}>
          {subtitle}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
}
