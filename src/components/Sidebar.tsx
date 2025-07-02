import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { useThemeContext } from "../ThemeContext";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { ListItemButton, ListItemIcon } from "@mui/material";
import {
    IconBook,   
    IconCategory,
    IconSchool,    
  } from "@tabler/icons-react";


interface SidebarProps{
    open:boolean;
    toggleSidebar:()=>void;
}
const Sidebar:React.FC<SidebarProps>=({open, toggleSidebar})=>{
    const { isDarkMode } = useThemeContext();
    return(
        <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        onClose={toggleSidebar}
        sx={
            {
                width:240,
                flexShrink:0,
                "& .MuiDrawer-paper":{
                    width:240,
                    boxSizing:"border-box",
                    top:"70px",
                    backgroundColor:"var(--color-background-000)"
                }
            }
        }>
            <List sx={{px:1}}>
            <ListItemButton
            sx={{
              bgcolor: "var(--color-background-100)",
              mb: 1,
              borderRadius: 1,
            }}            
            component={Link}
            to="/"
          >
            <ListItemIcon>
              <IconSchool />
            </ListItemIcon>
            <ListItemText
              sx={{ color: isDarkMode ? "#fff" : "#5715c2" }}
              primary="Home"
            />
          </ListItemButton>
          <ListItemButton
            sx={{
              bgcolor: "var(--color-background-100)",
              mb: 1,
              borderRadius: 1,
            }}
            component={Link}
            to="/Categories"
          >
            <ListItemIcon>
              <IconBook />
            </ListItemIcon>
            <ListItemText
              sx={{ color: isDarkMode ? "#fff" : "#5715c2" }}
              primary="Categories"
            />
          </ListItemButton>
          <ListItemButton
            sx={{
              bgcolor: "var(--color-background-100)",
              mb: 1,
              borderRadius: 1,
            }}
            component={Link}
            to="/Subcategories"
          >
            <ListItemIcon>
              <IconCategory/>
            </ListItemIcon>
            <ListItemText
              sx={{ color: isDarkMode ? "#fff" : "#5715c2" }}
              primary="Subcategories"
            />
          </ListItemButton>
            </List>
            
        </Drawer>
    );

}

export default Sidebar