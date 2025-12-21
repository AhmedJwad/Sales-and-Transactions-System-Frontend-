import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useThemeContext } from "../ThemeContext";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth";
import {
  IconBrandProducthunt,
  IconCategory,
  IconCategory2,
  IconCategoryPlus,
  IconColorPicker,
  IconDiscount,
  IconHome,
  IconLayoutNavbarCollapse,
  IconMap,
  IconMap2,
  IconMenuOrder,
  IconResize,
  IconUserDollar,
} from "@tabler/icons-react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import i18n from '../i18n';

const SIDEBAR_WIDTH = 260;

const Sidebar = () => { 
  const { isDarkMode } = useThemeContext();
  const location = useLocation();
  const [openCategories, setOpenCategories] = useState(false);
  const { isExpanded, isMobileOpen, toggleMobileSidebar, isRtl } = useSidebar();
  
  const { isAuthenticated, userRole } = useAuth();
 

  const handleCategoriesClick = () => {
    setOpenCategories(!openCategories);
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      title: "Home",
      icon: <IconHome size={22} />,
      path: "/admin",
      roles: ["Admin", "User"],
    },
    {
      title: "Countries",
      icon: <IconMap size={22} />,
      path: "/admin/Countries",
      roles: ["Admin", "User"],
    },
    {
      title: "States",
      icon: <IconMap2 size={22} />,
      path: "/admin/States",
      roles: ["Admin", "User"],
    },
    {
      title: "Cities",
      icon: <IconMap2 size={22} />,
      path: "/admin/Cities",
      roles: ["Admin", "User"],
    },
  ];

  const pagesSubMenu = [
    {
      title: "Categories",
      icon: <IconCategory size={20} />,
      path: "/admin/Categories",
    },
    {
      title: "Subcategories",
      icon: <IconCategoryPlus size={20} />,
      path: "/admin/Subcategories",
    },
    {
      title: "Brands",
      icon: <IconCategory2 size={20} />,
      path: "/admin/Brands",
    },
    {
      title: "Colors",
      icon: <IconColorPicker size={20} />,
      path: "/admin/colors",
    },
    {
      title: "Sizes",
      icon: <IconResize size={20} />,
      path: "/admin/sizes",
    },
  ];
  
  return (
    <Drawer
      key={isRtl ? "right" : "left"}
      variant="persistent"
      anchor={isRtl ? "right" : "left"}
      open={isExpanded || isMobileOpen}
      sx={{       
        width: isExpanded || isMobileOpen ? SIDEBAR_WIDTH : 0,
        flexShrink: 0,
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          top: "70px",
          height: "calc(100vh - 70px)",
          overflowX: "hidden",
          overflowY: "auto",
          backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
          borderRight: !isRtl
            ? isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.12)"
              : "1px solid rgba(0, 0, 0, 0.12)"
            : "none",
          borderLeft: isRtl
            ? isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.12)"
              : "1px solid rgba(0, 0, 0, 0.12)"
            : "none",
          boxShadow: isDarkMode
            ? "4px 0 20px rgba(0, 0, 0, 0.5)"
            : "4px 0 20px rgba(0, 0, 0, 0.08)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",      
    },
  }}
>
      {/* Sidebar Header */}
      <Box 
        sx={{
          p: 3,
          pb: 2,          
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)"
            : "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            background: isDarkMode
              ? "linear-gradient(45deg, #4caf50 30%, #2196f3 90%)"
              : "linear-gradient(45deg, #1976d2 30%, #1565c0 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Admin Panel
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
            fontWeight: 500,
            letterSpacing: "0.5px",
          }}
        >
          Management Dashboard
        </Typography>
      </Box>

      <Divider sx={{ mb: 1 }} />

      <List sx={{ px: 2, py: 1, flex: 1 }}>
        {/* Main Menu Items */}
        {menuItems.map(
          (item) =>
            (userRole === "Admin" || userRole === "User") && (
              <Tooltip
                key={item.path}
                title={item.title}
                placement="right"
                arrow
                disableHoverListener={isExpanded || isMobileOpen}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    mb: 0.5,
                    borderRadius: 2,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    bgcolor: isActive(item.path)
                      ? isDarkMode
                        ? "rgba(33, 150, 243, 0.15)"
                        : "rgba(25, 118, 210, 0.15)"
                      : "transparent",
                    "&:hover": {
                      bgcolor: isDarkMode
                        ? "rgba(33, 150, 243, 0.1)"
                        : "rgba(25, 118, 210, 0.08)",
                      transform: "translateX(8px)",
                      boxShadow: isDarkMode
                        ? "0 4px 12px rgba(33, 150, 243, 0.2)"
                        : "0 4px 12px rgba(25, 118, 210, 0.15)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: "4px",
                      bgcolor: isActive(item.path)
                        ? isDarkMode
                          ? "#2196f3"
                          : "#1976d2"
                        : "transparent",
                      borderRadius: "0 4px 4px 0",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path)
                        ? isDarkMode
                          ? "#2196f3"
                          : "#1976d2"
                        : isDarkMode
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(0,0,0,0.6)",
                      minWidth: 45,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 500,
                      fontSize: "0.95rem",
                      color: isActive(item.path)
                        ? isDarkMode
                          ? "#2196f3"
                          : "#1976d2"
                        : isDarkMode
                        ? "#fff"
                        : "#1a1a1a",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            )
        )}

        {/* Pages Dropdown */}
        {(userRole === "Admin" || userRole === "User") && (
          <>
            <ListItemButton
              onClick={handleCategoriesClick}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                transition: "all 0.3s ease",
                bgcolor: openCategories
                  ? isDarkMode
                    ? "rgba(156, 39, 176, 0.15)"
                    : "rgba(156, 39, 176, 0.1)"
                  : "transparent",
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(156, 39, 176, 0.1)"
                    : "rgba(156, 39, 176, 0.05)",
                  transform: "translateX(8px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: openCategories
                    ? "#9c27b0"
                    : isDarkMode
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.6)",
                  minWidth: 45,
                }}
              >
                <IconLayoutNavbarCollapse size={22} />
              </ListItemIcon>
              <ListItemText
                primary="Pages"
                primaryTypographyProps={{
                  fontWeight: openCategories ? 600 : 500,
                  fontSize: "0.95rem",
                  color: openCategories
                    ? "#9c27b0"
                    : isDarkMode
                    ? "#fff"
                    : "#1a1a1a",
                }}
              />
              {openCategories ? (
                <ExpandLess
                  sx={{
                    color: openCategories
                      ? "#9c27b0"
                      : isDarkMode
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.5)",
                  }}
                />
              ) : (
                <ExpandMore
                  sx={{
                    color: isDarkMode
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.5)",
                  }}
                />
              )}
            </ListItemButton>

            <Collapse in={openCategories} timeout="auto" unmountOnExit>
              <List sx={{ pl: 2, py: 0 }}>
                {pagesSubMenu.map((item) => (
                  <Tooltip
                    key={item.path}
                    title={item.title}
                    placement="right"
                    arrow
                    disableHoverListener={isExpanded || isMobileOpen}
                  >
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      sx={{
                        mb: 0.5,
                        borderRadius: 2,
                        py: 1,
                        transition: "all 0.3s ease",
                        bgcolor: isActive(item.path)
                          ? isDarkMode
                            ? "rgba(156, 39, 176, 0.15)"
                            : "rgba(156, 39, 176, 0.1)"
                          : "transparent",
                        "&:hover": {
                          bgcolor: isDarkMode
                            ? "rgba(156, 39, 176, 0.1)"
                            : "rgba(156, 39, 176, 0.05)",
                          transform: "translateX(8px)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive(item.path)
                            ? "#9c27b0"
                            : isDarkMode
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.5)",
                          minWidth: 40,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontWeight: isActive(item.path) ? 600 : 500,
                          fontSize: "0.9rem",
                          color: isActive(item.path)
                            ? "#9c27b0"
                            : isDarkMode
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(0,0,0,0.8)",
                        }}
                      />
                    </ListItemButton>
                  </Tooltip>
                ))}
              </List>
            </Collapse>
          </>
        )}

        <Divider sx={{ my: 1.5 }} />

        {/* Products */}
        {(userRole === "Admin" || userRole === "User") && (
          <Tooltip
            title="Products"
            placement="right"
            arrow
            disableHoverListener={isExpanded || isMobileOpen}
          >
            <ListItemButton
              component={Link}
              to="/admin/Products"
              sx={{
                mb: 0.5,
                borderRadius: 2,
                transition: "all 0.3s ease",
                bgcolor: isActive("/admin/Products")
                  ? isDarkMode
                    ? "rgba(76, 175, 80, 0.15)"
                    : "rgba(76, 175, 80, 0.1)"
                  : "transparent",
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(76, 175, 80, 0.05)",
                  transform: "translateX(8px)",
                  boxShadow: isDarkMode
                    ? "0 4px 12px rgba(76, 175, 80, 0.2)"
                    : "0 4px 12px rgba(76, 175, 80, 0.15)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "4px",
                  bgcolor: isActive("/admin/Products")
                    ? "#4caf50"
                    : "transparent",
                  borderRadius: "0 4px 4px 0",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive("/admin/Products")
                    ? "#4caf50"
                    : isDarkMode
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.6)",
                  minWidth: 45,
                }}
              >
                <IconBrandProducthunt size={22} />
              </ListItemIcon>
              <ListItemText
                primary="Products"
                primaryTypographyProps={{
                  fontWeight: isActive("/admin/Products") ? 600 : 500,
                  fontSize: "0.95rem",
                  color: isActive("/admin/Products")
                    ? "#4caf50"
                    : isDarkMode
                    ? "#fff"
                    : "#1a1a1a",
                }}
              />
            </ListItemButton>
          </Tooltip>
        )}
        {/*exchange rate  */}
        {(userRole === "Admin") && (
          <Tooltip
            title="Exchange Rate"
            placement="right"
            arrow
            disableHoverListener={isExpanded || isMobileOpen}
          >
            <ListItemButton
              component={Link}
              to="/admin/exchangeRate"
              sx={{
                mb: 0.5,
                borderRadius: 2,
                transition: "all 0.3s ease",
                bgcolor: isActive("/admin/exchangeRate")
                  ? isDarkMode
                    ? "rgba(76, 175, 80, 0.15)"
                    : "rgba(76, 175, 80, 0.1)"
                  : "transparent",
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(76, 175, 80, 0.05)",
                  transform: "translateX(8px)",
                  boxShadow: isDarkMode
                    ? "0 4px 12px rgba(76, 175, 80, 0.2)"
                    : "0 4px 12px rgba(76, 175, 80, 0.15)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "4px",
                  bgcolor: isActive("/admin/exchangeRate")
                    ? "#4caf50"
                    : "transparent",
                  borderRadius: "0 4px 4px 0",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive("/admin/exchangeRate")
                    ? "#4caf50"
                    : isDarkMode
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.6)",
                  minWidth: 45,
                }}
              >
                <IconUserDollar size={22} />
              </ListItemIcon>
              <ListItemText
                primary="exchangeRate"
                primaryTypographyProps={{
                  fontWeight: isActive("/admin/exchangeRate") ? 600 : 500,
                  fontSize: "0.95rem",
                  color: isActive("/admin/exchangeRate")
                    ? "#4caf50"
                    : isDarkMode
                    ? "#fff"
                    : "#1a1a1a",
                }}
              />
            </ListItemButton>
          </Tooltip>
        )}
          {/*Discounts  */}
        {(userRole === "Admin") && (
          <Tooltip
            title="Discounts"
            placement="right"
            arrow
            disableHoverListener={isExpanded || isMobileOpen}
          >
            <ListItemButton
              component={Link}
              to="/admin/discounts"
              sx={{
                mb: 0.5,
                borderRadius: 2,
                transition: "all 0.3s ease",
                bgcolor: isActive("/admin/discounts")
                  ? isDarkMode
                    ? "rgba(76, 175, 80, 0.15)"
                    : "rgba(76, 175, 80, 0.1)"
                  : "transparent",
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(76, 175, 80, 0.05)",
                  transform: "translateX(8px)",
                  boxShadow: isDarkMode
                    ? "0 4px 12px rgba(76, 175, 80, 0.2)"
                    : "0 4px 12px rgba(76, 175, 80, 0.15)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "4px",
                  bgcolor: isActive("/admin/discounts")
                    ? "#4caf50"
                    : "transparent",
                  borderRadius: "0 4px 4px 0",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive("/admin/discounts")
                    ? "#4caf50"
                    : isDarkMode
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.6)",
                  minWidth: 45,
                }}
              >
                <IconDiscount size={22} />
              </ListItemIcon>
              <ListItemText
                primary="Discounts"
                primaryTypographyProps={{
                  fontWeight: isActive("/admin/discounts") ? 600 : 500,
                  fontSize: "0.95rem",
                  color: isActive("/admin/discounts")
                    ? "#4caf50"
                    : isDarkMode
                    ? "#fff"
                    : "#1a1a1a",
                }}
              />
            </ListItemButton>
          </Tooltip>
        )}


        {/* Orders - Admin Only */}
        {userRole === "Admin" && (
          <Tooltip
            title="Orders"
            placement="right"
            arrow
            disableHoverListener={isExpanded || isMobileOpen}
          >
            <ListItemButton
              component={Link}
              to="/admin/orders"
              sx={{
                mb: 0.5,
                borderRadius: 2,
                transition: "all 0.3s ease",
                bgcolor: isActive("/admin/orders")
                  ? isDarkMode
                    ? "rgba(255, 152, 0, 0.15)"
                    : "rgba(255, 152, 0, 0.1)"
                  : "transparent",
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(255, 152, 0, 0.1)"
                    : "rgba(255, 152, 0, 0.05)",
                  transform: "translateX(8px)",
                  boxShadow: isDarkMode
                    ? "0 4px 12px rgba(255, 152, 0, 0.2)"
                    : "0 4px 12px rgba(255, 152, 0, 0.15)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "4px",
                  bgcolor: isActive("/admin/orders")
                    ? "#ff9800"
                    : "transparent",
                  borderRadius: "0 4px 4px 0",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive("/admin/orders")
                    ? "#ff9800"
                    : isDarkMode
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.6)",
                  minWidth: 45,
                }}
              >
                <Badge color="error" max={99}>
                  <IconMenuOrder size={22} />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary="Orders"
                primaryTypographyProps={{
                  fontWeight: isActive("/admin/orders") ? 600 : 500,
                  fontSize: "0.95rem",
                  color: isActive("/admin/orders")
                    ? "#ff9800"
                    : isDarkMode
                    ? "#fff"
                    : "#1a1a1a",
                }}
              />
            </ListItemButton>
          </Tooltip>
        )}
      </List>

      {/* Sidebar Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.12)",
          background: isDarkMode
            ? "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)"
            : "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 100%)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            display: "block",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          v1.0.0 © 2025
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;