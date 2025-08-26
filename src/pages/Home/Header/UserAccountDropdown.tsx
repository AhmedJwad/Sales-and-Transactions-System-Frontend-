import React, { useState } from "react";
import { User } from "lucide-react";
import LoginModal from "../../../components/LoginModal";
import { Box, Button, Typography } from "@mui/material";



const UserAccountDropdown: React.FC = () => {
   const [open, setOpen] = useState(false);
  
  return (
    <Box>
      <Button
        color="inherit"
        onClick={() => setOpen(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          textTransform: 'none',
          padding: '8px 16px',
          borderRadius: '12px',
          minWidth: 'auto',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }
        }}
      >
        <User size={20} />        
        <Typography variant="body2" sx={{ 
          fontWeight: 500,
          fontSize: '18px'
        }}>
          تسجيل الدخول
        </Typography>
      </Button>
      
      {open && <LoginModal open={open} handleClose={() => setOpen(false)} />}
    </Box>
  );
};
export default UserAccountDropdown;
