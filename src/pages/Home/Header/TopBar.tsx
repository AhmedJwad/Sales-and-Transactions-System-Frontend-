import { AppBar ,Button,Toolbar } from "@mui/material"
import { Link } from "react-router-dom";


const TopBar=()=>{
    return(
        <AppBar position="fixed" color="default" sx={{bgcolor:"grey.100", height:40}}>
            <Toolbar sx={{ minHeight: "40px !important", display: "flex", justifyContent: "flex-end" }}>
                <Button size="small" component={Link} to="/login">تسجيل الدخول</Button>
                <Button size="small" component={Link} to="/register">انشاء حساب</Button>
                <Button size="small">العربية</Button>
                <Button size="small" component={Link} to="/cart">🛒</Button>
            </Toolbar>
        </AppBar>
    )
}
export default TopBar