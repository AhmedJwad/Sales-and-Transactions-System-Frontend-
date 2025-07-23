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
    IconLayoutNavbarCollapse,
    IconMap,
    IconMap2,   
  } from "@tabler/icons-react";
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from "react";

interface SidebarProps{
    open:boolean;
    toggleSidebar:()=>void;
}
const Sidebar:React.FC<SidebarProps>=({open, toggleSidebar})=>{
    const { isDarkMode } = useThemeContext();
    const [openCategories, setOpenCategories] = useState(false);
    const handleCategoriesClick = () => {
      setOpenCategories(!openCategories);
      };
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
            to="/Countries"
              >
            <ListItemIcon>
             <IconMap/>
            </ListItemIcon>
            <ListItemText
              sx={{ color: isDarkMode ? "#fff" : "#5715c2" }}
              primary="Countries"
            />
          </ListItemButton>
            <ListItemButton
            sx={{
              bgcolor: "var(--color-background-100)",
              mb: 1,
              borderRadius: 1,
            }}
            component={Link}
            to="/States"
              >
            <ListItemIcon>
             <IconMap/>
            </ListItemIcon>
            <ListItemText
              sx={{ color: isDarkMode ? "#fff" : "#5715c2" }}
              primary="States"
            />           
          </ListItemButton>
           <ListItemButton
            sx={{
              bgcolor: "var(--color-background-100)",
              mb: 1,
              borderRadius: 1,
            }}
            component={Link}
            to="/Cities"
              >
            <ListItemIcon>
             <IconMap2/>
            </ListItemIcon>
            <ListItemText
              sx={{ color: isDarkMode ? "#fff" : "#5715c2" }}
              primary="Cities"
            />           
          </ListItemButton>
          
          <ListItemButton
           onClick={handleCategoriesClick}
            sx={{
              bgcolor: "var(--color-background-100)",
              mb: 1,
              borderRadius: 1,
            }}
            component={Link}
            to="/"
          >
            <ListItemIcon>
             <IconLayoutNavbarCollapse/>
            </ListItemIcon>
            <ListItemText
              sx={{ color: isDarkMode ? "#fff" : "#5715c2" }}
              primary="Pages"
            />
             {openCategories ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCategories} timeout="auto" unmountOnExit>
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
          </Collapse> 
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