import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography,
    useTheme,
    alpha,
    InputAdornment,
    IconButton,
    Fade,
    Chip
} from "@mui/material";
import {
    Person,
    Email,
    Lock,
    Home,
    Phone,
    Visibility,
    VisibilityOff,
    LocationOn,
    AccountCircle,
    CheckCircle
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import PhoneInput from 'react-phone-number-input';
import Dropdown from 'react-dropdown';
import { useThemeContext } from "../../ThemeContext";
import genericRepository from "../../repositories/genericRepository";
import { CountryDto } from "../../types/CountryDto";
import { StateDto } from "../../types/StateDto";
import { CityDto } from "../../types/CityDto";
import { UserDTO } from "../../types/UserDTO";
import ImageUploader from "../../components/ImageUploader";

// Enhanced validation schema with better error messages
const validationSchema = Yup.object({
    FirstName: Yup.string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters")
        .required("First name is required"),
    LastName: Yup.string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .required("Last name is required"),
    Address: Yup.string()
        .min(10, "Address must be at least 10 characters")
        .required("Address is required"),
    CountryCode: Yup.string().required("Country code is required"),
    PhoneNumber: Yup.string()
        .matches(/^[0-9]+$/, "Phone number must contain only numbers")
        .min(8, "Phone number must be at least 8 digits")
        .max(15, "Phone number must be less than 15 digits")
        .required("Phone number is required"),
    Email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    CityId: Yup.number()
        .typeError("Please select a city")
        .moreThan(0, "Please select a city"),
    Password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
        .matches(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
        .matches(/(?=.*\d)/, "Password must contain at least one number")
        .required("Password is required"),
    passwordconfirm: Yup.string()
        .oneOf([Yup.ref("Password")], "Passwords must match")
        .required("Password confirmation is required"),
    image: Yup.mixed().nullable(),
});

const RegisterForm = () => {
    const { isDarkMode } = useThemeContext();
    const theme = useTheme();
    const navigate = useNavigate();
    
    // State management
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [countries, setCountries] = useState<CountryDto[]>([]);
    const [states, setStates] = useState<StateDto[]>([]);
    const [cities, setCities] = useState<CityDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formStep, setFormStep] = useState(0);

    // Initial form values
    const [initialValues] = useState({
        Email: "",
        FirstName: "",
        LastName: "",
        Address: "",
        Photo: "",
        CountryCode: "+964",
        PhoneNumber: "",
        CityId: 0,
        Latitude: 0.25544888,
        Longitude: 0.225214,
        Password: "",
        passwordconfirm: "",
        countryId: 1,
        stateId: 0,
        UserType: 1,
    });

    // Repository instances
    const CountryRepo = genericRepository<CountryDto[], CountryDto>("Countries/combo");
    const Accountrepository = genericRepository<UserDTO[], UserDTO>("accounts/CreateUser");

    // Enhanced API functions with better error handling
    const fetchCountries = async () => {
        try {
            setLoading(true);
            const result = await CountryRepo.getAll();
            if (!result.error && result.response) {
                setCountries(result.response);
            } else {
                console.error("Error fetching countries:", result.error);
                setErrorMessage("Failed to load countries. Please try again.");
            }
        } catch (error) {
            console.error("Network error:", error);
            setErrorMessage("Network error while loading countries. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const fetchStatesByCountry = async (countryId: number) => {
        try {
            setLoading(true);
            const result = await genericRepository<StateDto[], StateDto>(`State/combo/${countryId}`).getAll();
            if (!result.error && result.response) {
                setStates(result.response);
            } else {
                console.error("Error fetching states:", result.error);
                setErrorMessage("Failed to load states for the selected country.");
            }
        } catch (err) {
            console.error("Error fetching states:", err);
            setErrorMessage("Network error while loading states.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCitiesByState = async (stateId: number) => {
        try {
            setLoading(true);
            const result = await genericRepository<CityDto[], CityDto>(`Cities/combo/${stateId}`).getAll();
            if (!result.error && result.response) {
                setCities(result.response);
            } else {
                console.error("Error fetching cities:", result.error);
                setErrorMessage("Failed to load cities for the selected state.");
            }
        } catch (err) {
            console.error("Error fetching cities:", err);
            setErrorMessage("Network error while loading cities.");
        } finally {
            setLoading(false);
        }
    };

    // Enhanced Formik configuration
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            console.log("Form submission started", values);
            try {
                setLoading(true);
                setErrorMessage("");

                // Prepare data for submission
                const dataToSubmit = {
                    Email: values.Email,
                    Username: values.Email,
                    FirstName: values.FirstName,
                    LastName: values.LastName,
                    Address: values.Address,
                    Photo: values.Photo,
                    PhoneNumber: values.PhoneNumber,
                    CountryCode: values.CountryCode,
                    UserType: values.UserType,
                    CityId: values.CityId,
                    Latitude: values.Latitude,
                    Longitude: values.Longitude,
                    Password: values.Password,
                    PasswordConfirm: values.passwordconfirm,
                };

                console.log("Data to submit:", dataToSubmit);

                const result = await Accountrepository.post(dataToSubmit);
                console.log("API Response:", result);

                if (result.error && result.statusCode === 204) {
                    setSuccessMessage("Registration successful! Please check your email to confirm your account.");
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                } else {
                    console.log("Error registering user:", result.error);
                    setErrorMessage(result.message || "Registration failed. Please try again.");
                }

            } catch (error) {
                console.log("Error registering user:", error);
                setErrorMessage("An unexpected error occurred. Please try again later.");
            } finally {
                setLoading(false);
            }
        },
        validateOnBlur: true,
        validateOnMount: false,
        enableReinitialize: true,
    });

    // Image upload handler
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            formik.setFieldValue("Photo", file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
        }
    };

    // Effects for data loading
    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        if (formik.values.countryId && formik.values.countryId > 0) {
            fetchStatesByCountry(formik.values.countryId);
            setCities([]);
            formik.setFieldValue("stateId", 0);
            formik.setFieldValue("CityId", 0);
        } else {
            setStates([]);
            setCities([]);
            formik.setFieldValue("stateId", 0);
            formik.setFieldValue("CityId", 0);
        }
    }, [formik.values.countryId]);

    useEffect(() => {
        if (formik.values.stateId && formik.values.stateId > 0) {
            fetchCitiesByState(formik.values.stateId);
            formik.setFieldValue("CityId", 0);
        } else {
            setCities([]);
            formik.setFieldValue("CityId", 0);
        }
    }, [formik.values.stateId]);

    // Utility function
    const convertToBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

   
    return (
        <Container maxWidth="md">
            <Fade in timeout={800}>            

                        {/* Form Section */}
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Personal Information Section */}
                                <Grid size={{xs:12}}>
                                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Person />
                                        Personal Information
                                    </Typography>
                                </Grid>
                                <Grid size={{xs:12,sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="FirstName"
                                        name="FirstName"
                                        label="First Name"
                                        value={formik.values.FirstName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.FirstName && Boolean(formik.errors.FirstName)}
                                        helperText={formik.touched.FirstName && formik.errors.FirstName}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid size={{xs:12,sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="LastName"
                                        name="LastName"
                                        label="Last Name"
                                        value={formik.values.LastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.LastName && Boolean(formik.errors.LastName)}
                                        helperText={formik.touched.LastName && formik.errors.LastName}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid size={{xs:12,sm:6}}>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        id="Email"
                                        name="Email"
                                        label="Email Address"
                                        value={formik.values.Email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.Email && Boolean(formik.errors.Email)}
                                        helperText={formik.touched.Email && formik.errors.Email}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid size={{xs:12,sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="Address"
                                        name="Address"
                                        label="Address"
                                        value={formik.values.Address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.Address && Boolean(formik.errors.Address)}
                                        helperText={formik.touched.Address && formik.errors.Address}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Home color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                </Grid>

                                {/* Contact Information Section */}
                                <Grid size={{xs:12}}>
                                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                                        <Phone />
                                        Contact Information
                                    </Typography>
                                </Grid>

                                <Grid size={{xs:12,sm:6}}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Phone Number
                                        </Typography>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 1,
                                                borderRadius: 2,
                                                "&:focus-within": {
                                                    borderColor: "primary.main",
                                                    borderWidth: 2,
                                                },
                                            }}
                                        >
                                           <PhoneInput
                                                country="IQ"
                                                defaultCountry="IQ"
                                                placeholder="Enter phone number"
                                                value={`${formik.values.CountryCode || "+964"}${formik.values.PhoneNumber || ""}`}
                                                onChange={(value) => {
                                                    if (value) {                                                       
                                                        const cleanValue = value.replace(/\s/g, '');                                                      
                                                        if (cleanValue.startsWith('+964')) {
                                                        const afterCountryCode = cleanValue.substring(4);                                                          
                                                        const phoneNumber = afterCountryCode.startsWith('0') 
                                                        ? afterCountryCode.substring(1) 
                                                        : afterCountryCode;                                                        
                                                        formik.setFieldValue("CountryCode", "+964");
                                                        formik.setFieldValue("PhoneNumber", phoneNumber);
                                                        }
                                                        
                                                        else {
                                                            const match = cleanValue.match(/^(\+\d{1,4})(0?)(.*)$/);
                                                            if (match) {
                                                                const countryCode = match[1];
                                                                const phoneNumber = match[3]; 
                                                                
                                                                formik.setFieldValue("CountryCode", countryCode);
                                                                formik.setFieldValue("PhoneNumber", phoneNumber);
                                                            } else {                                                                
                                                                formik.setFieldValue("CountryCode", "+964");
                                                                formik.setFieldValue("PhoneNumber", cleanValue.replace(/^\+?0?/, ""));
                                                            }
                                                        }
                                                    } else {                                                       
                                                        formik.setFieldValue("CountryCode", "+964");
                                                        formik.setFieldValue("PhoneNumber", "");
                                                    }
                                                }}
                                                onBlur={() => formik.setFieldTouched("PhoneNumber", true)}
                                                style={{ width: "100%", border: "none", outline: "none" }}
                                            />
                                        </Paper>
                                        {formik.touched.PhoneNumber && formik.errors.PhoneNumber && (
                                            <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                                                {formik.errors.PhoneNumber}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                {/* Location Section */}
                                <Grid size={{xs:12}}>
                                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                                        <LocationOn />
                                        Location Details
                                    </Typography>
                                </Grid>

                                <Grid size={{xs:12,sm:4}}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Country
                                    </Typography>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2,
                                            "&:focus-within": {
                                                borderColor: "primary.main",
                                                borderWidth: 2,
                                            },
                                        }}
                                    >
                                        <Dropdown
                                            options={countries.map((c) => ({
                                                value: c.id.toString(),
                                                label: c.name
                                            }))}
                                            value={
                                                countries.map((c) => ({
                                                    value: c.id.toString(),
                                                    label: c.name
                                                })).find(option => option.value === formik.values.countryId?.toString()) as any
                                            }
                                            onChange={(option: any) => {
                                                const selectedValue = typeof option === 'string' ? option : option?.value;
                                                formik.setFieldValue("countryId", parseInt(selectedValue) || 0);
                                            }}
                                            placeholder="Select a country"
                                        />
                                    </Paper>
                                    {formik.touched.countryId && formik.errors.countryId && (
                                        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                                            {formik.errors.countryId}
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid size={{xs:12,sm:4}}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        State
                                    </Typography>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2,
                                            "&:focus-within": {
                                                borderColor: "primary.main",
                                                borderWidth: 2,
                                            },
                                        }}
                                    >
                                        <Dropdown
                                            options={states.map((s) => ({ value: s.id.toString(), label: s.name }))}
                                            value={states.map((s) => ({
                                                value: s.id.toString(),
                                                label: s.name
                                            })).find((option => option.value === formik.values.stateId?.toString())) as any}
                                            onChange={(option: any) => formik.setFieldValue("stateId", parseInt(option.value) || 0)}
                                            placeholder="Select a state"
                                            disabled={states.length === 0}
                                        />
                                    </Paper>
                                    {formik.touched.stateId && formik.errors.stateId && (
                                        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                                            {formik.errors.stateId}
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid size={{xs:12,sm:4}}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        City
                                    </Typography>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2,
                                            "&:focus-within": {
                                                borderColor: "primary.main",
                                                borderWidth: 2,
                                            },
                                        }}
                                    >
                                        <Dropdown
                                            options={cities.map((c) => ({ value: c.id.toString(), label: c.name }))}
                                            value={
                                                cities.map((c) => ({
                                                    value: c.id.toString(),
                                                    label: c.name
                                                })).find((c => c.value === formik.values.CityId.toString())) as any
                                            }
                                            onChange={(option: any) => formik.setFieldValue("CityId", parseInt(option.value) || 0)}
                                            placeholder="Select a city"
                                            disabled={cities.length === 0}
                                        />
                                    </Paper>
                                    {formik.touched.CityId && formik.errors.CityId && (
                                        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                                            {formik.errors.CityId}
                                        </Typography>
                                    )}
                                </Grid>

                                {/* Security Section */}
                                <Grid size={{xs:12}}>
                                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                                        <Lock />
                                        Security Information
                                    </Typography>
                                </Grid>

                                <Grid size={{xs:12,sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="Password"
                                        name="Password"
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        value={formik.values.Password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.Password && Boolean(formik.errors.Password)}
                                        helperText={formik.touched.Password && formik.errors.Password}
                                        InputProps={{
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
                                        }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid size={{xs:12,sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="passwordconfirm"
                                        name="passwordconfirm"
                                        label="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formik.values.passwordconfirm}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.passwordconfirm && Boolean(formik.errors.passwordconfirm)}
                                        helperText={formik.touched.passwordconfirm && formik.errors.passwordconfirm}
                                        InputProps={{
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
                                        }}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                </Grid>

                                {/* Profile Photo Section */}
                                <Grid size={{xs:12}}>
                                    <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2, mb: 2 }}>
                                        Profile Photo (Optional)
                                    </Typography>
                                    <Box
                                        sx={{
                                            p: 3,
                                            border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                                            borderRadius: 2,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                        }}
                                    >
                                        <ImageUploader
                                            onImageSelected={(base64) => {
                                                formik.setFieldValue("Photo", base64);
                                            }}
                                            initialImage={formik.values.Photo}
                                        />
                                    </Box>
                                </Grid>

                                {/* Submit Button */}
                                <Grid size={{xs:12}}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        type="submit"
                                        disabled={loading}                                       
                                        size="large"
                                        startIcon={
                                            loading ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                <CheckCircle />
                                            )
                                        }
                                    >
                                        {loading ? "Creating Account..." : "Create Account"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>                       
            </Fade>

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
        </Container>
    );
};

export default RegisterForm;