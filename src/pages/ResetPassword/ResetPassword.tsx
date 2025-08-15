import * as Yup from "yup";
import { useFormik } from "formik";
import { FC, useState } from "react";
import genericRepository from "../../repositories/genericRepository";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Snackbar, TextField, Typography } from "@mui/material";
import { CheckCircle, Flare } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const validationSchema = Yup.object({    
    Email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),   
});

const ResetPassword:FC=()=>{
    const [isLoading, setIsLoading] = useState(false); 
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
     const [initialValues] = useState({
             Email: "",
                        
         });
     const formik=useFormik({
       initialValues,
       validationSchema,
       onSubmit:async(values)=>{
        setIsLoading(true);
        try {
             const dataToSubmit = {
                                Email: values.Email,                               
                                 };
            var Repository=await genericRepository<any[], any>("accounts/RecoverPassword");
            var result=await Repository.post(dataToSubmit);
             if (result.error && result.statusCode === 204) {
                    setSuccessMessage("Please check your email for a link to change your password.");
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                } else {
                    console.log("Error send email:", result.error);
                    setErrorMessage(result.message || "recovery password failed. Please try again.");
                }         
        } catch (error) {
             console.error("Error recovery password:", error);            
        }finally{setIsLoading(false)}
       },
        validateOnBlur: true,
        validateOnMount: false,
        enableReinitialize: true,
     })
     return(
        <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
            width:600,
            bgcolor:"background.paper",           
            p:4,
            display:"flex",
            flexDirection:"column",
            gap:2,
            margin:"auto",
            mt:2
        }}
        >
            <Typography variant="h6" align="center">
                Resend Password
            </Typography>
            <TextField
             label="Email"
             name="Email"
             value={formik.values.Email}
             type="email"
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={formik.touched.Email && Boolean(formik.errors.Email)}
            helperText={formik.touched.Email && formik.errors.Email}
            fullWidth
            />
            <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth>
                Recovery Password
            </LoadingButton>
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
                                {/* Error Snackbar */}
                                          <Snackbar
                                              open={!!errorMessage}
                                              autoHideDuration={8000}
                                              onClose={() => setErrorMessage("")}
                                              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                          >
                                              <Alert 
                                                  onClose={() => setErrorMessage("")} 
                                                  severity="error" 
                                                  sx={{ 
                                                      width: '100%',
                                                      borderRadius: 2,
                                                      boxShadow: "0 4px 20px rgba(244, 67, 54, 0.3)",
                                                  }}
                                              >
                                                  {errorMessage}
                                              </Alert>
                                          </Snackbar>
        </Box>
     )
}

export default ResetPassword;