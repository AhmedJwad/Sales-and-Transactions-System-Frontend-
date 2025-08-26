import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "./Header/Header";
import FooterHome from "./Footer/FooterHome";
import { CategoryProvider } from "./CategoryContext";

const HomeLayout: FC = () => {
    return(
       <CategoryProvider>
         <div style={{display:"flex", flexDirection:"column", minHeight:"100vh"}}>
        {/*header*/}
        <Header/>
         {/* Main Content */}
       <Container maxWidth={false} sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
      {/*footer*/}
      <Box component="footer" sx={{p:2 , bgcolor:"grey.100", textAlign:"center"}}>
        <FooterHome/>
      </Box>
    </div>
    </CategoryProvider>
    )   
}
export default HomeLayout