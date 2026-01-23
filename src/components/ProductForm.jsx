import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProductForm({ open, onClose, onSubmit, initial }) {
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
    const b64 = await toBase64(file);
    setForm((p) => ({ ...p, imageBase64: b64, imageUrl: "" }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>
        {initial?._id ? "Edit Product" : "Create Product"}
      </DialogTitle>
      <DialogContent sx={{ pb: 4 }}>
        <Box sx={{ pt: 1 }}>
          <Stack spacing={2.5}>
            <TextField label="Title" variant="outlined" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required fullWidth />
            <TextField label="Price" type="number" variant="outlined" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required fullWidth />
            <TextField label="Category" variant="outlined" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth />
            <TextField label="Description" variant="outlined" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline minRows={3} fullWidth />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, px: 0.5, mb: -1 }}>Product Image</Typography>
            <TextField
              label="Image URL (optional)"
              variant="outlined"
              size="small"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value, imageBase64: "" })}
              helperText="If you paste an image URL, upload will be cleared."
              fullWidth
            />
            <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderColor: "rgba(255,255,255,0.2)" }}>
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
            >
              {initial?._id ? "Update Product" : "Create Product"}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
