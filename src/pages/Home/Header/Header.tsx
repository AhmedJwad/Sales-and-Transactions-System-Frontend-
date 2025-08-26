import { Box, IconButton, Typography, Badge, InputBase, Paper } from "@mui/material";
import { ShoppingCart, Search } from "@mui/icons-material";
import UserAccountDropdown from "./UserAccountDropdown";
import MainNav from "./MainNav";

const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky", 
        top: 0,
        zIndex: 1300, 
        bgcolor: "white",
        borderBottom: 1,
        borderColor: "grey.300",
      }}
    >
      {/* Top Bar: Logo, Search, Account, Cart */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 3 },
          py: { xs: 1, md: 1 },
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "red" }}>
          miswag
        </Typography>

        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            mx: 3,
            bgcolor: "grey.100",
            borderRadius: 3,
            height: 40,
          }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="ابحث عن منتج او ماركة او قسم"
            inputProps={{ "aria-label": "search" }}
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <Search />
          </IconButton>
        </Paper>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ cursor: "pointer", "&:hover": { color: "red" } }}>
            العربية
          </Typography>
          <UserAccountDropdown />
          <IconButton>
            <Badge badgeContent={0} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
      </Box>

      {/* Main Navigation */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 1, md: 1.5 },
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <MainNav />
      </Box>
    </Box>
  );
};

export default Header;
