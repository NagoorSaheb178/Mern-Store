import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography, useMediaQuery, useTheme, IconButton } from "@mui/material";

function compressImage(file, maxWidth = 800, maxHeight = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        // Using jpeg with 0.7 quality for significant size reduction
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
    };
  });
}

export default function ProductForm({ open, onClose, onSubmit, initial, loading }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState({
    title: "", price: "", category: "general", description: "", imageUrl: "", imageBase64: ""
  });

  useEffect(() => {
    // Standard empty state
    const emptyState = { title: "", price: "", category: "General", description: "", imageUrl: "", imageBase64: "" };

    if (initial) {
      setForm({ ...emptyState, ...initial, price: initial.price ?? "" });
    } else {
      setForm(emptyState);
    }
    // eslint-disable-next-line
  }, [initial, open]); // Also reset when the dialog opens

  const handleFile = async (file) => {
    if (!file) return;
    const b64 = await compressImage(file);
    setForm((p) => ({ ...p, imageBase64: b64, imageUrl: "" }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      <DialogTitle sx={{
        fontWeight: 800,
        pt: { xs: 2.5, sm: 3 },
        px: { xs: 2, sm: 3 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {initial?._id ? "Edit Product" : "Create Product"}
        {fullScreen && (
          <Button onClick={onClose} sx={{ fontWeight: 700 }}>Close</Button>
        )}
      </DialogTitle>
      <DialogContent sx={{ pb: 4, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ pt: { xs: 1, sm: 1 } }}>
          <Stack spacing={2.5}>
            <TextField label="Title" variant="outlined" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required fullWidth disabled={loading} />
            <TextField label="Price" type="number" variant="outlined" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required fullWidth disabled={loading} />
            <TextField label="Category" variant="outlined" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth disabled={loading} />
            <TextField label="Description" variant="outlined" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline minRows={3} fullWidth disabled={loading} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, px: 0.5, mb: -1 }}>Product Image</Typography>
            <TextField
              label="Image URL (optional)"
              variant="outlined"
              size="small"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value, imageBase64: "" })}
              helperText="If you paste an image URL, upload will be cleared."
              fullWidth
              disabled={loading}
            />
            <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderColor: "rgba(255,255,255,0.2)" }} disabled={loading}>
              Upload Image (Base64)
              <input hidden type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
            </Button>
            {!!form.imageBase64 && (
              <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600 }}>
                ✓ Image uploaded successfully
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => onSubmit(form)}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Processing..." : (initial?._id ? "Update Product" : "Create Product")}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
