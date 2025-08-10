import { useNavigate, useSearchParams } from "react-router-dom"
import genericRepository from "../../repositories/genericRepository";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import { CheckCircle } from "@mui/icons-material";



const ConfirmEmail=()=>{
    const [searchParams]= useSearchParams();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const userId = searchParams.get("userid")?? "";
    const token = searchParams.get("token")?? "";    
    const handleConfirm=async()=>{
       try {                
                const url = `Accounts/ConfirmEmail?userId=${userId}&token=${token}`;                
                const result = await genericRepository<any[], any>(url).getAll();                                
                console.log("Confirm result:", result);
                setSuccessMessage("Welcome! Your account is now active. Please log in to your control panel to begin managing your account.");
                navigate("/login")

            } catch (error) {
                console.error("Error confirming email:", error);
            }
        }   

return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" mb={2}>
       confirmation Email
      </Typography>      
      <Button
        variant="contained"
        color="primary"
        onClick={handleConfirm}
        sx={{ padding: "10px 20px" }}
      >
        confirmation Email
      </Button>
       {/* Success Snackbar */}
                  <Snackbar
                      open={!!successMessage}
                      autoHideDuration={6000}
                      onClose={() => setSuccessMessage("")}
                      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                      <Alert 
                          onClose={() => setSuccessMessage("")} 
                          severity="success" 
                          sx={{ 
                              width: '100%',
                              borderRadius: 2,
                              boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
                          }}
                          icon={<CheckCircle />}
                      >
                          {successMessage}
                      </Alert>
                  </Snackbar>
    </Box>
  );
};

export default ConfirmEmail;