import { Dispatch, FC, SetStateAction, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CssBaseline, Link, Modal, TextField, Typography, Alert } from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";

interface LoginProps{
    open: boolean;
    handleClose: Dispatch<SetStateAction<boolean>>
}

const LoginModal: FC<LoginProps> = ({ open, handleClose }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [resendEmailOpen, setResendEmailOpen] = useState(false);
    const [forgotPassOpen, setForgotPassOpen] = useState(false);
    const [loginError, setLoginError] = useState<string>("");

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid Email").required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async ({ email, password }) => {
            setIsLoading(true);
            setLoginError(""); 
            
            try {
                const loginResp = await login(email, password);
                console.log(loginResp);
                
                if (loginResp) {                   
                    handleClose(true);
                    setLoginError("");
                } else {                    
                    setLoginError("Invalid email or password. Please check your credentials and try again.");
                }
            } catch (error) {
                console.log("Login failed:", error);
                setLoginError("Invalid email or password. Please check your credentials and try again.");
            } finally {
                setIsLoading(false);
            }
        },
        validateOnBlur: false,
        validateOnMount: true,
        enableReinitialize: true,
    });

   
    const handleModalClose = () => {
        setLoginError("");
        formik.resetForm();
        handleClose(false);
    };

    return (
        <>
            <Modal open={open} onClose={handleModalClose}>
                <Box 
                    component={"form"}
                    onSubmit={formik.handleSubmit}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <CssBaseline/>
                    <Typography variant="h6" align="center">
                        Login
                    </Typography>                    
                    {loginError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {loginError}
                        </Alert>
                    )}

                    {/* Email input */}
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        fullWidth
                        disabled={isLoading}
                    />

                    {/* Password Input */}
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        fullWidth
                        disabled={isLoading}
                    />

                    {/* Forgot Password Button */}
                    <Box textAlign="right">
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => setForgotPassOpen(true)}
                            disabled={isLoading}
                        >
                            Forgot Password?
                        </Link>
                    </Box>

                    {/* Submit Button */}
                    <LoadingButton
                        loading={isLoading}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!formik.isValid || isLoading}
                    >
                        Login
                    </LoadingButton>

                    {/* Links to Register and Confirmation */}
                    <Box textAlign="center" mt={2}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => {
                                navigate("/register");
                                handleModalClose();
                            }}
                            sx={{ mb: 1, display: 'block' }}
                            disabled={isLoading}
                        >
                            Don't have an account? Register Here
                        </Link>

                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => setResendEmailOpen(true)}
                            disabled={isLoading}
                        >
                            Resend Confirmation Email
                        </Link>
                    </Box>
                </Box>
            </Modal> 
        </>    
    );
};

export default LoginModal;