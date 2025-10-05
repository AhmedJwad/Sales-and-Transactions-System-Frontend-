import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip,
  Fade,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../ThemeContext";
import MenuIcon from "@mui/icons-material/Menu";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useAuth } from "../hooks/useAuth";
import LoginModal from "./LoginModal";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSidebar } from "../context/SidebarContext";

const Header: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { isAuthenticated, logout, email, photo } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const fullImagePath =
    photo && photo !== "/no-image.png"
      ? `https://localhost:7027/${photo}`
      : "/path/to/user/avatar.png";

  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const navigatetoEdituser = () => {
    navigate("/admin/Edituser");
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(20px)",
          borderBottom: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.12)",
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(35, 35, 35, 0.98) 100%)"
            : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          boxShadow: isDarkMode
            ? "0 4px 20px rgba(0, 0, 0, 0.5)"
            : "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Toolbar sx={{ minHeight: "70px !important", px: { xs: 2, sm: 3 } }}>
          {/* Menu Toggle Button */}
          <Tooltip title="Toggle Menu" arrow>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleToggle}
              sx={{
                mr: 2,
                transition: "all 0.3s ease",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  transform: "rotate(90deg)",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          {/* Logo/Title */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.5px",
                background: "linear-gradient(45deg, #fff 30%, #e0e0e0 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" },
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>

          {/* Theme Toggle */}
          <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"} arrow>
            <IconButton
              onClick={toggleTheme}
              sx={{
                mx: 1,
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: "#fff",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.25)",
                  transform: "rotate(180deg)",
                },
                width: 45,
                height: 45,
              }}
            >
              {isDarkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
            </IconButton>
          </Tooltip>

          {/* User Section */}
          {isAuthenticated ? (
            <>
              <Tooltip title="Account Settings" arrow>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    ml: 2,
                    p: 0,
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Avatar
                    alt="User Avatar"
                    src={fullImagePath}
                    sx={{
                      width: 45,
                      height: 45,
                      border: "3px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  {/* Online Status */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 12,
                      height: 12,
                      bgcolor: "#4caf50",
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: isDarkMode ? "#1a1a1a" : "#1976d2",
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%": {
                          boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)",
                        },
                        "70%": {
                          boxShadow: "0 0 0 6px rgba(76, 175, 80, 0)",
                        },
                        "100%": {
                          boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)",
                        },
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>

              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    mt: 2,
                    minWidth: 280,
                    borderRadius: 3,
                    overflow: "visible",
                    background: isDarkMode
                      ? "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 20,
                      width: 12,
                      height: 12,
                      bgcolor: isDarkMode ? "#1e1e1e" : "#ffffff",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
              >
                {/* User Info Section */}
                <Box
                  sx={{
                    p: 3,
                    pb: 2,
                    textAlign: "center",
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(33, 150, 243, 0.15) 100%)"
                      : "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)",
                    borderRadius: "12px 12px 0 0",
                  }}
                >
                  <Avatar
                    alt="User Avatar"
                    src={fullImagePath}
                    sx={{
                      width: 80,
                      height: 80,
                      margin: "auto",
                      mb: 2,
                      border: "4px solid",
                      borderColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.05)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: isDarkMode ? "#fff" : "#1a1a1a",
                    }}
                  >
                    Hello 👋
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(0, 0, 0, 0.6)",
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    {email}
                  </Typography>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: "rgba(76, 175, 80, 0.2)",
                      color: "#4caf50",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Menu Items */}
                <MenuItem
                  onClick={navigatetoEdituser}
                  sx={{
                    py: 1.5,
                    px: 3,
                    mx: 1,
                    my: 0.5,
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isDarkMode
                        ? "rgba(33, 150, 243, 0.15)"
                        : "rgba(33, 150, 243, 0.08)",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon
                      fontSize="small"
                      sx={{ color: isDarkMode ? "#64b5f6" : "#2196f3" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Edit Profile"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </MenuItem>

                <MenuItem
                  onClick={handleMenuClose}
                  sx={{
                    py: 1.5,
                    px: 3,
                    mx: 1,
                    my: 0.5,
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isDarkMode
                        ? "rgba(156, 39, 176, 0.15)"
                        : "rgba(156, 39, 176, 0.08)",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <SettingsIcon
                      fontSize="small"
                      sx={{ color: isDarkMode ? "#ba68c8" : "#9c27b0" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Settings"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    px: 3,
                    mx: 1,
                    my: 0.5,
                    mb: 1,
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isDarkMode
                        ? "rgba(244, 67, 54, 0.15)"
                        : "rgba(244, 67, 54, 0.08)",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon
                      fontSize="small"
                      sx={{ color: isDarkMode ? "#ef5350" : "#f44336" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      color: isDarkMode ? "#ef5350" : "#f44336",
                    }}
                  />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => setOpen(true)}
              variant="outlined"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.8)",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
        {open && <LoginModal open={open} handleClose={() => setOpen(false)} />}
      </AppBar>
    </>
  );
};

export default Header;