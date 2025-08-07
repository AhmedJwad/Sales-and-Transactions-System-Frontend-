import React, { FC, FormEvent, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";

// Custom theme with orange primary color
const theme = createTheme({
  palette: {
    primary: {
      main: "#E86924",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#E65700",
          },
        },
      },
    },
  },
});

const LoginForm: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate required fields
    if (!username || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await login(username, password);

    if (!result) {
      setError("Incorrect credentials.");
    }

    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            padding: 3,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography component="h1" variant="h5" color="primary" sx={{ mb: 2 }}>
            Order Plus
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: "10px" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginForm;
