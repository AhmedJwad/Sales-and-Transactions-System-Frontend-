
import { Box } from "@mui/material";
import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import { useThemeContext } from "../ThemeContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "../context/SidebarContext";


const Layout:FC=()=>{
    const [sidebarOpen, setSidebarOpen] =useState(false)  
    const {isDarkMode} =useThemeContext();
    const toggleSidebar=()=>{
        setSidebarOpen(!sidebarOpen)
    };
    return(
        <SidebarProvider>
        <div style={{
            display:"flex",
            flexDirection:"column",
            height:"100vh",
            background:isDarkMode?
            "var(--color-background-000):"
            :"var(--color-background-100)",
            color: "var(--color-text-100)",
            transition:"background-color 0.3s ease, color 0.3s ease",


        }}>
            <Header/>
            <div style={{
                display:"flex",
                flexGrow:1,
                transition:"margin-left 0.3s ease",

            }}>
             <Sidebar   />
                <main
                style={{
                    flexGrow: 1,
                    marginLeft: sidebarOpen ? "0px" : "0px",
                    transition: "margin-left 0.3s ease",
                    marginTop: "74px",
                    backgroundColor: "var(--color-background-000)",
                }}
                >
                <Box
                component={"div"}
                sx={{ margin: 4 }}
                border={"0px solid var(--color-border-100)"}
                borderRadius={2}
                bgcolor="var(--color-background-000)"
                style={{
                transition: "background-color 0.3s ease, color 0.3s ease",
                }}
            >
                <Box component={"div"} sx={{ padding: 1 }}>
                <Outlet />
                </Box>
                </Box>
               </main>
            </div>
        </div>
        </SidebarProvider>
    )
}
export default Layout;