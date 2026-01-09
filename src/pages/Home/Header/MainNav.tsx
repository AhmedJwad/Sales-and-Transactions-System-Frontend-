import { FC, useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Menu, MenuItem, Button } from "@mui/material";
import { ChevronDown, AlignJustify, Phone } from "lucide-react";
import genericRepository from "../../../repositories/genericRepository";
import { CategoryDto } from "../../../types/CategoryDto";
import { useNavigate } from "react-router-dom";

import { useTranslation } from 'react-i18next';

const MainNav: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [category, setCategory] = useState<CategoryDto[]>([]);
 const [categoryId, setCategoryId] = useState<number | null>(null);
  const navigate = useNavigate();
  const {t}=useTranslation();

  const categoryRepository = genericRepository<CategoryDto[], CategoryDto>("Categories/combo");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryRepository.getAll();
        if (!result.error && result.response) {
          setCategory(result.response);
          setCategoryId(result.response[0].id); 
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  
   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setCategoryId(0);
  };

  const handleClose = () => setAnchorEl(null);
  const handleCategorySelect = (id: number) => {
    setCategoryId(id);
    navigate("/");
    handleClose();
  };
  
 

  return (
    <AppBar
      position="sticky"
      color="primary"
      sx={{
        top: 0,
        bgcolor: "#FF8C00",
        zIndex: (theme) => theme.zIndex.appBar,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>     
        <Button
          onClick={handleClick}
          startIcon={<AlignJustify />}
          endIcon={<ChevronDown />}
          sx={{ color: "#fff", fontWeight: 600, minWidth: 150,justifyContent: "space-between", }}
        >
          {t(`allcategories`)}
        </Button>        
        <Typography sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
          <Button
          onClick={() => {
            setCategoryId(categoryId);
            navigate("/");
          }}
          sx={{ color: "#fff" }}
        >
         {t(`home`)}
        </Button>

        <Button
          onClick={() => {
            setCategoryId(0);
            navigate("/shop");
          }}
          sx={{ color: "#fff" }}
        >
          {t(`shop`)}
        </Button>

        <Button
          onClick={() => {
            setCategoryId(0);
            navigate("/single-page");
          }}
          sx={{ color: "#fff" }}
        >
          Single Page
        </Button>

        <Button
          onClick={() => {
            setCategoryId(0);
            navigate("/contact");
          }}
          sx={{ color: "#fff" }}
        >
          {t(`contact`)}
        </Button>
          <Button
            key="AllProducts"
            onClick={() => navigate("/homeproducts")}
            sx={{ color: "#fff" }}
          >
            {t(`allproducts`)}
          </Button>
        </Typography>

        {/* زر الهاتف */}
        <Button
          variant="contained"
          startIcon={<Phone />}
          sx={{ bgcolor: "#FF0000", "&:hover": { bgcolor: "#CC0000" } }}
        >
          +0123 456 7890
        </Button>

        {/* قائمة الأقسام */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              setCategoryId(0);
              navigate("/");
              handleClose();
            }}
          >
            {t(`allcategories`)}
          </MenuItem>
          {category.map((c) => (
            <MenuItem key={c.id} onClick={() => handleCategorySelect(c.id)}>
              {c.name}
            </MenuItem>
          ))}          
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default MainNav;
