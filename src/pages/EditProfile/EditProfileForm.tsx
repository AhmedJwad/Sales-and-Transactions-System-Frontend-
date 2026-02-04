import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { CountryDto } from "../../types/CountryDto";
import { StateDto } from "../../types/StateDto";
import { CityDto } from "../../types/CityDto";
import genericRepository from "../../repositories/genericRepository";
import {  useNavigate } from "react-router-dom";
import { Alert, alpha, Box, Button, CircularProgress, Container, Fade, Grid, InputAdornment, Paper, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import { Home, LocationOn, Person, Phone, Lock, CheckCircle, LockReset, CenterFocusStrong, ChangeCircle } from "@mui/icons-material";
import PhoneInput from 'react-phone-number-input';
import Dropdown from 'react-dropdown';
import ImageUploader from "../../components/ImageUploader";
import { useAuth } from "../../hooks/useAuth";
import { UserDTOrequest } from "../../types/UserDTOrequest";
import { LoginResponseDto } from "../../types/LoginResponseDto";
import ChangePasswordModal from "../../components/ChangePasswordModal";


const validationSchema=Yup.object({
    firstName: Yup.string()
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name must be less than 50 characters")
            .required("First name is required"),
        lastName: Yup.string()
            .min(2, "Last name must be at least 2 characters")
            .max(50, "Last name must be less than 50 characters")
            .required("Last name is required"),
        address: Yup.string()
            .min(10, "Address must be at least 10 characters")
            .required("Address is required"),
        countryCode: Yup.string().required("Country code is required"),
        phoneNumber: Yup.string()
            //.matches(/^[0-9]+$/, "Phone number must contain only numbers")
            .min(8, "Phone number must be at least 8 digits")
            .max(15, "Phone number must be less than 15 digits")
            .required("Phone number is required"),       
        cityId: Yup.number()
            .typeError("Please select a city")
            .moreThan(0, "Please select a city"),       
        photo: Yup.mixed().nullable(),
});

const EditProfileForm =()=>{
    const { processAuthResponse } = useAuth();
    const [initialValues, setInitialValues]=useState({               
                firstName: "",
                lastName: "",
                address: "",
                photo: "",
                countryCode: "+964",
                userType:1,
                cityId:0,               
                latitude: 0.25544888,
                longitude: 0.225214,
                phoneNumber:"",               
                countryId: 1,
                stateId: 0,                
        })
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();   
    const [countries, setCountries] = useState<CountryDto[]>([]);
    const [states, setStates] = useState<StateDto[]>([]);
    const [cities, setCities] = useState<CityDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined); 
    const { isAuthenticated, userRole  } = useAuth();  
    const [originalPhoto, setOriginalPhoto] = useState("");      
    const CountryRepo = genericRepository<CountryDto[], CountryDto>("Countries/combo");
    const Accountrepository = genericRepository<UserDTOrequest[], UserDTOrequest>("accounts");
   
 
   
    useEffect(() => {
  // Helper function to get token
  const fetchUser = async () => {
    if (!isAuthenticated) {
      setErrorMessage("Please login first");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {  
        /* const tokenData = getTokenData();
         const token = tokenData?.token;           
        const response = await fetch("https://localhost:7027/api/accounts", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.statusText}`);
      }

      const data = await response.json(); */
      const Accountrepoinfo = genericRepository<any, any>("accounts");
      var data =await Accountrepoinfo.getAll();
      if (data.response ) {
            const user = data.response; 
             console.log("User:", user);
             let stateId = 0;
                let countryId = 0;   
                if (user.cityId > 0) {     
                const CityRepo = genericRepository<CityDto[], CityDto>("cities");
                const cityResult = await CityRepo.getOne(user.cityId);
                if (cityResult.response) {
                    stateId = cityResult.response.stateId;        
                    if (stateId > 0) {
                    const stateResult =await genericRepository<StateDto, StateDto>("State").getOne(stateId);       
                    if (stateResult.response) {
                        countryId = stateResult.response.countryId;
                    }
                    }
                }
                }
            setInitialValues({
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                address: user.address ?? "",
                photo: user.photo ?? "",
                countryCode: user.countryCode ?? "",
                userType: 1,
                cityId: user.cityId ?? 0,
                latitude: user.latitude ?? 0,
                longitude: user.longitude ?? 0,
                phoneNumber: user.phoneNumber ?? "",
                countryId: countryId ?? 0,
                stateId: stateId ?? 0,
            });
            setOriginalPhoto(user.photo ?? "");             
            }else{                           
                console.log("Error loading user", data.response);
                setErrorMessage(data.message);
            }
                
      /* setInitialValues((data)=>({
        ...data ,
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        address: data.address ?? "",
        photo: data.photo ?? "",
        countryCode: data.countryCode ?? "+964",
        userType: 1,
        cityId: data.cityId ?? 0,
        latitude: data.latitude ?? 0.25544888,
        longitude: data.longitude ?? 0.225214,
        phoneNumber: data.phoneNumber ?? "",
        countryId: 1,
        stateId: 0              
      }));   */// Fixed: removed unnecessary callback
    

      /* setInitialValues({       
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        address: data.address ?? "",
        photo: data.photo ?? "",
        countryCode: data.countryCode ?? "+964",
        userType: 1,
        cityId: data.cityId ?? 0,
        latitude: data.latitude ?? 0.25544888,
        longitude: data.longitude ?? 0.225214,
        phoneNumber: data.phoneNumber ?? "",
        countryId: countryId,
        stateId: stateId,
        }); 
      console.log(data) */
    } catch (err: any) {
      setErrorMessage(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [isAuthenticated]); 
 
    
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
       
    
    const formik=useFormik({
        initialValues,
        validationSchema,
        onSubmit:async(values)=>{
            try {
                setLoading(true);
                setErrorMessage("");
                 // Prepare data for submission
                const dataToSubmit = {                
                    firstName: values.firstName,
                    lastName: values.lastName,
                    address: values.address,
                    Photo: values.photo !== originalPhoto ? values.photo : null,
                    phoneNumber: values.phoneNumber,
                    countryCode: values.countryCode,
                    userType: values.userType,
                    cityId: values.cityId,
                    latitude: values.latitude,
                    longitude: values.longitude,                   
                };  
                 const result = await Accountrepository.put(dataToSubmit);                          
                console.log("API Response:", result);
                if (!result.error && result.statusCode === 200)
                { 
                     const tokenData = (result.response as unknown as { token: LoginResponseDto }).token;
                    processAuthResponse(tokenData);                         
                    setTimeout(() => {  
                        setSuccessMessage("Your profile has been updated successfully.");                      
                    }, 3000);
                   // navigate("/admin");                  

                    if (userRole === "Admin") {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                } else {
                    console.log("Error updating your profile:", result.error);
                    setErrorMessage(result.message || "Registration failed. Please try again.");
                } 

            } catch (error) {
                console.log("Failed to update your profile:", error);
                setErrorMessage("An unexpected error occurred. Please try again later.");
            } finally {
                setLoading(false);
            }            
        },
        validateOnBlur: true,
        validateOnMount: false,
        enableReinitialize: true,
    });   

 
         
        
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
        const handleOpenPasswordModal = () => setOpenPasswordModal(true);
        const handleClosePasswordModal = () => setOpenPasswordModal(false);
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
                                                id="firstName"
                                                name="firstName"
                                                label="First Name"
                                                value={formik.values.firstName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                                helperText={formik.touched.firstName && formik.errors.firstName}
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
                                                id="lastName"
                                                name="lastName"
                                                label="Last Name"
                                                value={formik.values.lastName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                                helperText={formik.touched.lastName && formik.errors.lastName}
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
                                                id="address"
                                                name="address"
                                                label="Address"
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.address && Boolean(formik.errors.address)}
                                                helperText={formik.touched.address && formik.errors.address}
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
                                                        value={`${formik.values.countryCode || "+964"}${formik.values.phoneNumber || ""}`}
                                                        onChange={(value) => {
                                                            if (value) {                                                       
                                                                const cleanValue = value.replace(/\s/g, '');                                                      
                                                                if (cleanValue.startsWith('+964')) {
                                                                const afterCountryCode = cleanValue.substring(4);                                                          
                                                                const phoneNumber = afterCountryCode.startsWith('0') 
                                                                ? afterCountryCode.substring(1) 
                                                                : afterCountryCode;                                                        
                                                                formik.setFieldValue("CountryCode", "+964");
                                                                formik.setFieldValue("phoneNumber", phoneNumber);
                                                                }
                                                                
                                                                else {
                                                                    const match = cleanValue.match(/^(\+\d{1,4})(0?)(.*)$/);
                                                                    if (match) {
                                                                        const countryCode = match[1];
                                                                        const phoneNumber = match[3]; 
                                                                        
                                                                        formik.setFieldValue("CountryCode", countryCode);
                                                                        formik.setFieldValue("phoneNumber", phoneNumber);
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
                                                        onBlur={() => formik.setFieldTouched("phoneNumber", true)}
                                                        style={{ width: "100%", border: "none", outline: "none" }}
                                                    />
                                                </Paper>
                                                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                                    <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                                                        {formik.errors.phoneNumber}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid size={{xs:12, sm:6}}>
                                              {formik.values.photo && (
                                                <Box mb={2} textAlign="center">
                                                    <img
                                                    src={`${"https://localhost:7027/"}${formik.values.photo}`}
                                                    alt="User"
                                                    style={{
                                                        width: 300,
                                                        height: 300,
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                        border: "2px solid #ccc"
                                                    }}
                                                    />
                                                </Box>
                                            )}
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
                                                        })).find((c => c.value === formik.values.cityId.toString())) as any
                                                    }
                                                    onChange={(option: any) => formik.setFieldValue("cityId", parseInt(option.value) || 0)}
                                                    placeholder="Select a city"
                                                    disabled={cities.length === 0}
                                                />
                                            </Paper>
                                            {formik.touched.cityId && formik.errors.cityId&& (
                                                <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                                                    {formik.errors.cityId}
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
                                                        formik.setFieldValue("photo", base64);
                                                    }}
                                                    initialImage={formik.values.photo}
                                                />                                              
                                            </Box>                                            
                                        </Grid>
        
                                        {/* Submit Button */}                                   
                                           
                                        </Grid>
                                        <Box display="flex" gap={2} justifyContent="center">                                       
                                        <Button
                                            variant="contained"
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
                                            sx={{ flex: 1 }}
                                        >
                                            {loading ? "Edit..." : "Edit my profile"}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<ChangeCircle />}
                                            onClick={handleOpenPasswordModal}
                                            sx={{ flex: 1 }}
                                        >
                                            Change Password
                                        </Button>

                                        <ChangePasswordModal
                                            open={openPasswordModal}
                                            onClose={handleClosePasswordModal}
                                        />
                                        </Box>          
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
}

export default EditProfileForm

