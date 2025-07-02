import {
    AppBar,
    Button,
    CssBaseline,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Avatar,
    Box,
    Tooltip,
  } from "@mui/material";
  import { FC, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useThemeContext } from "../ThemeContext";
  import MenuIcon from "@mui/icons-material/Menu";
  import { IconMoon, IconSun } from "@tabler/icons-react";
 
  
  interface HeaderProps {
    toggleSidebar: () => void;
  }
  
  const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useThemeContext();
  
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
  
    return (
      <>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: "rgba(0, 123, 255, 0.95)", // Azure tone
            borderRadius: "0 0 12px 12px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
            {/* Left Side */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>              
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                  borderRadius: 2,
                  color: "#fff",
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
  
            {/* Center */}
            <Typography variant="h6" noWrap component="div" sx={{ color: "white", fontWeight: 600 }}>
              OrderPlus Dashboard
            </Typography>
  
            {/* Right Side */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Toggle theme">
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.85)",
                    color: "rgba(0, 123, 255, 1)",
                    borderRadius: "50%",
                    "&:hover": {
                      bgcolor: "#fff",
                      boxShadow: "0 4px 8px rgba(0,123,255,0.4)",
                    },
                  }}
                >
                  {isDarkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
                </IconButton>
              </Tooltip>
  
              <Tooltip title="Acocunt">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                    borderRadius: 2,
                  }}
                >
                  <Avatar
                    alt="User"
                    src="/broken-image.jpg"
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "white",
                      color: "rgba(0,123,255,1)",
                      fontSize: 14,
                    }}
                  />
                </IconButton>
              </Tooltip>
  
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    minWidth: 140,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/login");
                  }}
                  sx={{ fontWeight: "bold", fontSize: 14 }}
                >
                  Login
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </>
    );
  };
  
  export default Header;
  