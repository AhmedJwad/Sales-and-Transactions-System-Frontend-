import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { useThemeContext } from "../ThemeContext";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import {   
    IconBrandProducthunt,   
    IconCategory,
    IconCategory2,
    IconCategoryPlus,
    IconHome,   
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
              <IconHome/>
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
             <IconCategory/>
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
              <IconCategoryPlus/>
            </ListItemIcon>
            <ListItemText
              sx={{ color: isDarkMode ? "#fff" : "#5715c2" }}
              primary="Subcategories"
            />
          </ListItemButton>
          <ListItemButton
            sx={{
              bgcolor: "var(--color-background-100)",
              mb: 1,
              borderRadius: 1,
            }}
            component={Link}
            to="/Brands"
          >
            <ListItemIcon>
             <IconCategory2/>
            </ListItemIcon>
            <ListItemText
              sx={{ color: isDarkMode ? "#fff" : "#5715c2" }}
              primary="Brands"
            />
          </ListItemButton>
          <ListItemButton
            sx={{
              bgcolor: "var(--color-background-100)",
              mb: 1,
              borderRadius: 1,
            }}
            component={Link}
            to="/Products"
          >
            <ListItemIcon>
             <IconBrandProducthunt/>
            </ListItemIcon>
            <ListItemText
              sx={{ color: isDarkMode ? "#fff" : "#5715c2" }}
              primary="Products"
            />
          </ListItemButton>
        </List>
            
        </Drawer>
    );

}

export default Sidebar