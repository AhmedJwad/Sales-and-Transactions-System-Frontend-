import { useFormik } from "formik";
import * as Yup from "yup";
import genericRepository from "../repositories/genericRepository";
import { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Snackbar, TextField } from "@mui/material";
import { Visibility, VisibilityOff, Lock, CheckCircle, FamilyRestroomRounded } from "@mui/icons-material";
import { ChangePasswordrequestDTO } from "../types/ChangePasswordrequestDTO";

interface ChangePasswordModalProps{
    open:boolean;
     onClose:()=>void;
}
const validationSchema=Yup.object({
    CurrentPassword:Yup.string().required("required"),
    NewPassword:Yup.string().min(6, "At least 6 characters").required("required"),
    Confirm:Yup.string().oneOf([Yup.ref("NewPassword")],"Passwords must match").required("required")  
})
const ChangePasswordModal=({open ,onClose}:ChangePasswordModalProps)=>{
     const [successMessage, setSuccessMessage] = useState("");
     const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined); 
     const changepasswordRepositry= genericRepository<ChangePasswordrequestDTO[], ChangePasswordrequestDTO>("accounts/changePassword");
     const [showPassword, setShowPassword] = useState(false);
      const [showNewPassword, setShowNewPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const formik=useFormik({
        initialValues:{
            CurrentPassword:"",
            NewPassword:"",
            Confirm:"",
        },
        validationSchema,
        onSubmit:async(values)=>{           
           try {
            const result=await changepasswordRepositry.post(values);
            console.log("results to sent:",result.response);
           
                  setSuccessMessage("Your password has been updated successfully.");
                    setTimeout(() => {
                        onClose();
                    }, 3000);           
           } catch (error) {
              console.log("Failed to update your Password:", error);
                setErrorMessage("An unexpected error occurred. Please try again later.");          
            
           }

        },
        validateOnBlur: false,
        validateOnMount: true,
        enableReinitialize: true,
    })
    return(
       <Dialog open={open} onClose={onClose}>
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
            <DialogContent>
                <TextField
                margin="dense"
                id="CurrentPassword"
                name="CurrentPassword"
                label="Current Password"
                type={showPassword ? "text": "password"}
                fullWidth
                value={formik.values.CurrentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.CurrentPassword && Boolean(formik.errors.CurrentPassword)}
                helperText={
                    formik.touched.CurrentPassword && formik.errors.CurrentPassword
                }
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
                />
                <TextField
                margin="dense"
                id="NewPassword"
                name="NewPassword"
                label="New Password"
                type={showNewPassword ? "text": "password"}
                fullWidth
                value={formik.values.NewPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.NewPassword && Boolean(formik.errors.NewPassword)}
                helperText={
                    formik.touched.NewPassword && formik.errors.NewPassword
                }
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
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                        </InputAdornment>
                                    ),
                                    },
                                }}
                />
                <TextField
                 margin="dense"
                id="Confirm"
                name="Confirm"
                label="Confirm"
                type={showConfirmPassword ? "text": "password"}
                fullWidth
                value={formik.values.Confirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Confirm && Boolean(formik.errors.Confirm)}
                helperText={
                    formik.touched.Confirm && formik.errors.Confirm
                }
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
                />
            </DialogContent>
             <DialogActions>
                <Button onClick={onClose} color="primary">
                  cancel
                </Button>
                <Button type="submit" color="primary">
                   Save
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
        </DialogActions>
        </form>
       </Dialog>
    )
}

export default ChangePasswordModal;