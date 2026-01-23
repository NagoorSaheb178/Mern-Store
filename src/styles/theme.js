import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#6366f1", // Vibrant Indigo
            light: "#818cf8",
            dark: "#4f46e5",
        },
        secondary: {
            main: "#ec4899", // Vibrant Pink
        },
        background: {
            default: "#f8fafc",
            paper: "#ffffff",
        },
        text: {
            primary: "#1e293b",
            secondary: "#64748b",
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
        h4: {
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#0f172a",
        },
        h5: {
            fontWeight: 800,
            color: "#0f172a",
        },
        h6: {
            fontWeight: 700,
            color: "#0f172a",
        },
        body1: {
            lineHeight: 1.6,
            color: "#334155",
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 700,
                    padding: "10px 24px",
                    borderRadius: "12px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-2px)",
                    },
                },
                contained: {
                    boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -1px rgba(99, 102, 241, 0.1)",
                    "&:hover": {
                        boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.1)",
                    },
                },
                outlined: {
                    borderWidth: "2px",
                    "&:hover": {
                        borderWidth: "2px",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                },
                elevation1: {
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                },
                elevation10: {
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ffffff",
                        "& fieldset": {
                            borderColor: "#e2e8f0",
                            borderWidth: "1.5px",
                        },
                        "&:hover fieldset": {
                            borderColor: "#cbd5e1",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#6366f1",
                            borderWidth: "2px",
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(12px)",
                    color: "#0f172a",
                    borderBottom: "1px solid #e2e8f0",
                    boxShadow: "none",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: "8px",
                },
            },
        },
    },
});

export default theme;
