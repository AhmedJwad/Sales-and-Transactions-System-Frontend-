import { useFormik } from "formik";
import { FC, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import genericRepository from "../../repositories/genericRepository";
import { Alert, Box, IconButton, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff, Lock, CheckCircle, FamilyRestroomRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const validationSchema=Yup.object({
    Email:Yup.string().email("Invalid Email").required("required"),
    Password:Yup.string().required("required").min(8,"min 8 character"),
    ConfirmPassword:Yup.string().required("required").oneOf([Yup.ref("Password")], "not machting"),
})

const RecoveryPassword:FC=()=>{
  const [isLoading, setIsLoading] = useState(false); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();   
  const navigate = useNavigate();    

  const token = searchParams.get("token");   
     const [initialValues] = useState({
             Email: "",
             Password: "",
             ConfirmPassword: "", 
                      
         });        
         const formik=useFormik({
            initialValues,
            validationSchema,
            onSubmit:async(values)=>{
                 setIsLoading(true)
                 try {
                    const dataSubmit={
                            Email:values.Email,
                            token,
                            Password:values.Password,
                            ConfirmPassword:values.ConfirmPassword,                            
                        }
                        var Repository= await genericRepository<any[], any>("Accounts/ResetPassword");
                        var result=await Repository.post(dataSubmit);
                        console.log(dataSubmit);
                        if (result.error && result.statusCode === 204) {
                            setSuccessMessage("Your password was successfully changed. You can now log in using your new password.");
                            setTimeout(() => {
                                navigate("/");
                            }, 3000);
                        } else {
                            console.log("An error occurred while changing your password. Please try again.", result.error);
                            setErrorMessage(result.message || "We couldn’t change your password due to an error. Please try again later.");
                        }                             
                 } catch (error) {
                    console.error("Error: Unable to change password.", error);                       
                 }finally{setIsLoading(false)}
            },
            validateOnBlur: true,
            validateOnMount: false,
            enableReinitialize: true,
         })
         return(
            <Box
            component={"form"}
            onSubmit={formik.handleSubmit}
            sx={{
                width:400,
                bgcolor:"background.paper"    ,
                p:4,
                display:"flex",
                flexDirection:"column" ,   
                gap:2,
                margin:"auto",
                mt:2
            }}
            >
                <Typography variant="h6" align="center">
                    Recovery Password
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
                <TextField
                label="New Password"
                name="Password"
                value={formik.values.Password}
                type={showPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Password && Boolean(formik.errors.Password)}
                helperText={formik.touched.Password && formik.errors.Password}
                slotProps={{
                    input: {
                    startAdornment: (
                        <InputAdornment position="start">
                        <Lock color="primary" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                    ),
                    },
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                fullWidth                
                />
                {/* Confim password*/}
                <TextField
                label="Confirm Password"
                name="ConfirmPassword"
                value={formik.values.ConfirmPassword}
                type={showConfirmPassword ? "text": "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ConfirmPassword && Boolean(formik.errors.ConfirmPassword)}
                helperText={formik.touched.ConfirmPassword && formik.errors.ConfirmPassword}
                slotProps={{
                    input: {
                    startAdornment: (
                        <InputAdornment position="start">
                        <Lock color="primary" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                        >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                    ),
                    },
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                fullWidth
                />
                <LoadingButton
                loading={isLoading}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                >
                    Change Password
                </LoadingButton>
                <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClick={()=>{
                    setSuccessMessage("")
                }}
                anchorOrigin={{vertical:`top` , horizontal:`center`}}
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
export default RecoveryPassword