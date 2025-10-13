import React, { useEffect, useState } from "react";
import LoginModal from "../../../components/LoginModal";
import { Avatar, Box, Button, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const UserAccountDropdown: React.FC = () => {
       const { t} = useTranslation();
       const { isAuthenticated, logout, email , photo} = useAuth();
       const [open, setOpen] = useState(false);
       const navigate = useNavigate();   
            const fullImagePath = photo && photo !== "/no-image.png"
              ? `https://localhost:7027/${photo}`
              : "/path/to/user/avatar.png";
              console.log("fullImagePath:", fullImagePath)
            // State to handle the user menu
            const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
            const [imgVersion, setImgVersion] = useState(0);          
          
            const handleLogout = () => {
               logout();      
            };
            const navigatetoEdituser = () => {
               navigate("/editprfile"); 
               handleMenuClose();     
            };
            const navigattomyOrder=()=>{
              navigate("/orders")
              handleMenuClose();  
            }
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
    <Box>
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
                    <MenuItem onClick={navigattomyOrder}>
                      {"My Order"}
                    </MenuItem>
                    {/* Link para cerrar sesión */}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button color="inherit" onClick={() => setOpen(true)}>
                 {t('login')}
                </Button>
              )}
      
      {open && <LoginModal open={open} handleClose={() => setOpen(false)} />}
    </Box>
  );
};
export default UserAccountDropdown;
