import { FC, FormEvent, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  CssBaseline,  
  Paper,
  Link,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../hooks/useAuth";
import {  useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6", 
    },
    background: {
      default: "#f9fafb",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontSize: "16px",
          padding: "12px",
          "&:hover": {
            backgroundColor: "#2563eb",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
        },
      },
    },
  },
});

const LoginForm: FC = () => {
  const {t}=useTranslation();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
   const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
  const resentpassword = () => {
          navigate("/recoverypassword");         
          };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" , width:"200vh"}}>
        {/* Left Side (Form) */}
        <Box
          component={Paper}
          elevation={6}
          square
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 2, sm: 4, md: 6, lg: 8 },
            minHeight: "100vh",
            width: { xs: "100%", md: "50%" },
          }}
        >
          <Container 
            maxWidth="xs" 
            sx={{ 
              width: "100%",
              maxWidth: { xs: "100%", sm: "400px" }
            }}
          >
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography
                component="h1"
                variant="h4"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  color: "text.primary",
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
                }}
              >
                {t(`signIn`)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: { xs: 2, sm: 3 },
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: "0.875rem", sm: "0.95rem" },
                }}
              >
                {t(`signInMessage`)}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
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
                sx={{ mb: { xs: 1.5, sm: 2 } }}
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
                sx={{ mb: { xs: 1, sm: 1.5 } }}
              />

              {error && (
                <Typography 
                  color="error" 
                  sx={{ 
                    mt: 1, 
                    mb: 1,
                    fontSize: { xs: "0.875rem", sm: "0.95rem" },
                    textAlign: "center"
                  }}
                >
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: { xs: 2, sm: 3 }, 
                  mb: 2,
                  height: { xs: "48px", sm: "52px" }
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t(`signIn`)}
              </Button>

                {/* Links to Register and Confirmation */}
                    <Box textAlign="center" mt={2}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => {
                                navigate("/register");
                               
                            }}
                            sx={{ mb: 1, display: 'block' }}
                            
                        >
                           {t(`registerPrompt`)}
                        </Link>
                       
                    </Box>
              {/* Forgot Password Button */}
                <Box textAlign="center">
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => resentpassword()}
                        sx={{ mb: 1, display: 'block' }}
                    >
                       {t(`forgotPassword`)}
                    </Link>
                </Box>
            </Box>
          </Container>
        </Box>

        {/* Right Side (Logo / Branding) */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#1e1b4b",
            color: "white",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            p: { md: 4, lg: 6 },
            backgroundImage: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
            width: "50%",
          }}
        >
          <Box sx={{ maxWidth: "500px", px: 3 }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              sx={{ 
                mb: 2,
                fontSize: { md: "2rem", lg: "2.5rem" }
              }}
            >
              {t(`orderPlusManagement`)}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: "rgba(255,255,255,0.8)",
                fontSize: { md: "1rem", lg: "1.125rem" },
                lineHeight: 1.6
              }}
            >
             
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;