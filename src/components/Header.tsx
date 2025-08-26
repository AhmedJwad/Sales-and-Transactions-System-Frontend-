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
    Divider,
  } from "@mui/material";
  import { FC, useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useThemeContext } from "../ThemeContext";
  import MenuIcon from "@mui/icons-material/Menu";
  import { IconMoon, IconSun } from "@tabler/icons-react";
import { useAuth } from "../hooks/useAuth";
import LoginModal from "./LoginModal";
 
  
 interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ toggleSidebar }) => { 
  const { isAuthenticated, logout, email , photo} = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const fullImagePath = photo && photo !== "/no-image.png"
    ? `https://localhost:7027/${photo}`
    : "/path/to/user/avatar.png";
    console.log("fullImagePath:", fullImagePath)
  // Estado para manejar el menú de usuario
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [imgVersion, setImgVersion] = useState(0);
  const { isDarkMode, toggleTheme } = useThemeContext();
  

  const handleLogout = () => {
     logout();      
  };
  const navigatetoEdituser = () => {
     navigate("/admin/Edituser"); 
     handleMenuClose();     
  };
  useEffect(() => {
  setImgVersion(v => v + 1);
}, [fullImagePath]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "var(--color-main-150)",
      }}
    >
      <Toolbar>
       
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ ml: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}></Typography>
        
        <Box sx={{ padding: 2 }}>
          <CssBaseline />
          <Button
            onClick={toggleTheme}
            sx={{
              backgroundColor: "#fff!important",
              "&:hover": {
                backgroundColor: "initial",
              },
              color: "var(--color-main-150)",
            }}
          >
            {!isDarkMode ? <IconMoon /> : <IconSun />}
          </Button>
        </Box>

        {isAuthenticated ? (
          <>
            {/* Botón con avatar de usuario */}
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar
                alt="User Avatar"
                src={fullImagePath}                
              />
              
            </IconButton>

            {/* Menú que se abre al hacer clic en el avatar */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Box sx={{ p: 2, textAlign: "center" }}>
                {/* user info */}
                <Avatar
                  alt="User Avatar"
                  src={fullImagePath}
                  sx={{ width: 56, height: 56, margin: "auto" }}
                />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {`${"hi"}, ${email}`}
                </Typography>
              </Box>
              <Divider />
              {/* Link para editar perfil */}
              <MenuItem onClick={navigatetoEdituser}>
                {"Edit Profile"}
              </MenuItem>
              {/* Link para cerrar sesión */}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" onClick={() => setOpen(true)}>
            Login
          </Button>
        )}
      </Toolbar>
      {open && <LoginModal open={open} handleClose={() => setOpen(false)} />}
    </AppBar>
  );
};

export default Header;