import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "./Header/Header";
import FooterHome from "./Footer/FooterHome";
import { CategoryProvider } from "./CategoryContext";
import { CartProvider } from "../../context/CartContext";
import { CurrencyProvider } from "../../context/CurrencyContext";


const HomeLayout: FC = () => {
    return(
      <CartProvider>
       <CategoryProvider> 
        <CurrencyProvider>      
         <Box sx={{display:"flex", flexDirection:"column", minHeight:"100vh"}}>
        {/*header*/}
        <Header/>       
         {/* Main Content */}
      <Container maxWidth={false} sx={{ flexGrow: 1, py: 4 ,mt:"70px"}}>
        <Outlet />
      </Container>
      {/*footer*/}
      <Box component="footer" sx={{p:2 , bgcolor:"grey.100", textAlign:"center"}}>
        <FooterHome/>
      </Box>
    </Box>
    </CurrencyProvider> 
    </CategoryProvider>
    </CartProvider>
    )   
}
export default HomeLayout