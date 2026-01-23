import React, { useMemo, useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Container, Grid,
  Card, CardContent, CardMedia, Stack, Snackbar, Alert, Chip, TextField, Box
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  api,
  useProfileQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from "../services/api";
import ProductForm from "../components/ProductForm";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const authUser = useSelector((s) => s.auth.user);

  const { data: profile } = useProfileQuery(undefined, { skip: !authUser });
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = useMemo(() => {
    if (!products) return ["All"];
    const unique = Array.from(new Set(products.map(p => p.category || "General")));
    return ["All", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    if (categoryFilter === "All") return products;
    return products.filter(p => (p.category || "General") === categoryFilter);
  }, [products, categoryFilter]);

  const handleSave = async (form) => {
    try {
      if (editing?._id) {
        await updateProduct({ id: editing._id, ...form }).unwrap();
        setToast({ open: true, msg: "Product updated successfully!", type: "success" });
      } else {
        await createProduct(form).unwrap();
        setToast({ open: true, msg: "New product added!", type: "success" });
      }
      setOpenForm(false);
      setEditing(null);
    } catch (e) {
      setToast({ open: true, msg: e?.data?.message || "Action failed", type: "error" });
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id).unwrap();
      setToast({ open: true, msg: "Product removed", type: "success" });
    } catch (e) {
      setToast({ open: true, msg: e?.data?.message || "Delete failed", type: "error" });
    }
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" sx={{
            fontWeight: 900,
            color: "primary.main",
            letterSpacing: "-1px",
            fontSize: { xs: "1.25rem", sm: "1.5rem" }
          }}>
            MERN Store
          </Typography>

          <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
            <Typography variant="body2" sx={{
              display: { xs: "none", md: "block" },
              fontWeight: 600,
              fontSize: "0.85rem"
            }}>
              Hello, <span style={{ color: "#6366f1" }}>{profile?.name || authUser?.name || "User"}</span>
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                dispatch(logout());
                dispatch(api.util.resetApiState());
              }}
              sx={{
                borderRadius: "10px",
                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                px: { xs: 1.5, sm: 2 }
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 6 }, px: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Typography variant="h4" sx={{
            fontWeight: 900,
            fontSize: { xs: "1.75rem", sm: "2.125rem" }
          }}>
            Products <span style={{ color: "#6366f1" }}>.</span>
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => { setEditing(null); setOpenForm(true); }}
            sx={{
              px: { xs: 3, sm: 4 },
              py: 1.5,
              borderRadius: "14px",
              fontWeight: 800,
              width: { xs: "100%", sm: "auto" }
            }}
          >
            + Add Product
          </Button>
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            mb: 5,
            overflowX: "auto",
            pb: 1,
            mx: { xs: -2, sm: 0 },
            px: { xs: 2, sm: 0 },
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none"
          }}
        >
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setCategoryFilter(cat)}
              color={categoryFilter === cat ? "primary" : "default"}
              variant={categoryFilter === cat ? "filled" : "outlined"}
              sx={{
                px: 1,
                py: 2,
                fontWeight: 700,
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { transform: "scale(1.05)" }
              }}
            />
          ))}
        </Stack>

        {isLoading && (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h6" color="text.secondary">Loading amazing products...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>Failed to load products. Please check your connection.</Alert>
        )}

        {!isLoading && filtered.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10, bgcolor: "rgba(255,255,255,0.5)", borderRadius: 6, border: "2px dashed #e2e8f0" }}>
            <Typography variant="h6" color="text.secondary">No products found in this category.</Typography>
          </Box>
        )}

        <Grid container spacing={4}>
          {filtered.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card
                elevation={1}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid #f1f5f9",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    borderColor: "primary.light"
                  }
                }}
              >
                <Box sx={{ position: "relative", pt: "66%", overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    image={p.imageUrl || p.imageBase64 || "https://via.placeholder.com/600x400?text=No+Available+Image"}
                    alt={p.title}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <Chip
                    label={p.category || "General"}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(4px)",
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "0.7rem"
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, lineHeight: 1.2, height: "2.4em", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {p.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, height: "3em", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", fontSize: "0.85rem" }}>
                    {p.description || "No description provided."}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 2, fontWeight: 900, color: "primary.main" }}>
                    ₹ {p.price}
                  </Typography>

                  <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled={isUpdating || isDeleting}
                      onClick={() => { setEditing(p); setOpenForm(true); }}
                      sx={{ borderRadius: "12px", py: 1, borderColor: "#e2e8f0", fontWeight: 700 }}
                    >
                      Edit
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      disabled={isDeleting}
                      onClick={() => onDelete(p._id)}
                      sx={{ borderRadius: "12px", py: 1, borderColor: "#fee2e2", fontWeight: 700 }}
                    >
                      {isDeleting ? "..." : "Delete"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <ProductForm
          open={openForm}
          initial={editing}
          loading={isCreating || isUpdating}
          onClose={() => { if (!isCreating && !isUpdating) { setOpenForm(false); setEditing(null); } }}
          onSubmit={handleSave}
        />

        <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
          <Alert severity={toast.type} variant="filled" sx={{ width: "100%", borderRadius: 2 }}>
            {toast.msg}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
