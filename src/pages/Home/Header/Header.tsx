import {
  Box,
  IconButton,
  Typography,
  Badge,
  InputBase,
  Paper,
  MenuItem,
  Select,
  Menu,
  Button,
  AppBar,
} from "@mui/material";
import { ShoppingCart, Search, FavoriteBorder, Tune } from "@mui/icons-material";
import UserAccountDropdown from "./UserAccountDropdown";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import MainNav from "./MainNav";
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n} = useTranslation();
  const { order } = useCart();
  const totalQuantity = order.OrderDetails.reduce(
    (sum, item) => sum + item.Quantity,
    0
  );
  const navigate = useNavigate();
  const changeLanguage=(lng:any)=>{
    i18n.changeLanguage(lng)
  }
  

  return (
    
    <AppBar component="header" position="fixed" sx={{ bgcolor: "white",  borderColor: "grey.300" }}>   

      {/* 🔹 Top Info Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          py: 0.5,
          bgcolor: "grey.100",
          fontSize: 14,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 ,color: "grey.700"}}>
          <Typography sx={{ cursor: "pointer", "&:hover": { color: "orange" } }}> {t('help')}</Typography>
          <Typography sx={{ cursor: "pointer", "&:hover": { color: "orange" } }}>{t('support')}</Typography>
          <Typography sx={{ cursor: "pointer", "&:hover": { color: "orange" } }}>{t('contact')}</Typography>
        </Box>

        <Typography sx={{ color: "grey.700" }}>
          Call Us: (+012) 1234 567890
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 ,color: "grey.700"}}>
          <Typography>USD ▾</Typography>
          <Typography>
             <button onClick={() => changeLanguage('en')}>EN</button>
            <button onClick={() => changeLanguage('ar')}>العربية</button>
          </Typography>
          
            {/* Icons */}
           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <Tune />
          </IconButton>
          <IconButton>
            <FavoriteBorder />
          </IconButton>
          <IconButton onClick={() => navigate("/cart")}>
            <Badge badgeContent={totalQuantity} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <Typography sx={{ fontWeight: "bold" }}>$0.00</Typography>
        </Box>
          <UserAccountDropdown />
        </Box>
      </Box>   
       <Box>  
        <MainNav />
      </Box>       
    </AppBar>    
  );  
};

export default Header;
