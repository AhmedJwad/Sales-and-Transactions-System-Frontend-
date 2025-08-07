import { Box, Grid, styled, keyframes } from "@mui/material";
import logoEdu from "./assets/image.jpg";
import logoAlcaldia from "./assets/image.jpg";
import LoginForm from "./components/LoginForm";

// حركات الحركة الناعمة
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(232, 105, 36, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(232, 105, 36, 0); }
  100% { box-shadow: 0 0 0 0 rgba(232, 105, 36, 0); }
`;

// حاوية رئيسية للصفحة مع خلفية متدرجة
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 20% 80%, rgba(232, 105, 36, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 140, 66, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
  `,
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  overflow: "hidden",
}));

// صندوق مركزي للـ Login مع ظل ناعم وخلفية زجاجية (Glassmorphism)
const FormWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "420px",
  background: "rgba(255, 255, 255, 0.85)",
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  backdropFilter: "blur(20px)",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

// شعار متحرك عائم
const FloatingLogo = styled("img")({
  width: "160px",
  marginBottom: "30px",
  borderRadius: "15px",
  boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
  animation: `${floatAnimation} 6s ease-in-out infinite`,
  transition: "transform 0.3s ease",
  cursor: "default",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  },
});

// تذييل بشعار صغير مع حركة نبضية
const Footer = styled(Box)({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  background: "linear-gradient(135deg, #E86924 0%, #D4591C 50%, #E86924 100%)",
  padding: "15px 0",
  display: "flex",
  justifyContent: "center",
  animation: `${pulseAnimation} 4s infinite`,
  borderRadius: "25px 25px 0 0",
});

const FooterLogo = styled("img")({
  width: "120px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  border: "2px solid rgba(255,255,255,0.4)",
  backdropFilter: "blur(8px)",
  transition: "transform 0.3s ease",
  cursor: "default",
  "&:hover": {
    transform: "scale(1.05) rotate(2deg)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },
});

const Login = () => {
  return (
    <MainContainer>
      <FormWrapper>
        <FloatingLogo src={logoEdu} alt="Education Logo" />
        <LoginForm />
      </FormWrapper>
    
    </MainContainer>
  );
};

export default Login;
