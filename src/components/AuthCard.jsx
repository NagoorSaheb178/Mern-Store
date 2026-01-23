import React from "react";
import { Paper, Box, Typography } from "@mui/material";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: { xs: 2, sm: 0 },
      py: 4,
      background: "linear-gradient(135deg, #eef2ff 0%, #f1f5f9 100%)"
    }}>
      <Paper elevation={10} sx={{
        width: "100%",
        maxWidth: 480,
        borderRadius: { xs: 6, sm: 8 },
        p: { xs: 3, sm: 6 },
        textAlign: "center",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 800,
          color: "#6366f1",
          mb: 1.5,
          fontSize: { xs: "1.8rem", sm: "2.125rem" }
        }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{
          color: "text.secondary",
          mb: { xs: 3, sm: 5 },
          fontWeight: 500,
          fontSize: { xs: "0.9rem", sm: "1rem" }
        }}>
          {subtitle}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
}
