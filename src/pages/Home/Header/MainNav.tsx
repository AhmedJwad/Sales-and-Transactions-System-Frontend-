import { FC, useEffect, useState } from 'react';
import { Box, Typography, Menu, MenuItem } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import genericRepository from '../../../repositories/genericRepository';
import { CategoryDto } from '../../../types/CategoryDto';
import { useNavigate } from 'react-router-dom'; 
import { useCategory } from "../CategoryContext";


const MainNav=() => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory]=useState<CategoryDto[]>([]);
  const { setCategoryId } = useCategory();
  const navigate = useNavigate();

  var categoryRepository=genericRepository<CategoryDto[],CategoryDto>("Categories/combo");
  
  const fetchcategories = async () => {
  
    setLoading(true);
    try {
      const result = await categoryRepository.getAll();
      if (!result.error && result.response) {
        setCategory(result.response);
      } else {
        console.error("Error fetching Subcategories:", result.message);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = category;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setCategoryId(0);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
    const handleCategorySelect = (id: number) => {
     setCategoryId(id); 
      navigate("/");         
  };
  useEffect(()=>{
    fetchcategories();
 } ,[])
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: 3,
        padding: '12px 0',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        position: 'sticky',  
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      
      <Box
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', minWidth: 'max-content' }}
        onClick={handleClick}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: '#333',
            fontSize: '20px',
            '&:hover': { color: '#1976d2' }
          }}
        >
          كل الأقسام
        </Typography>
        <ChevronDown size={16} style={{ marginLeft: '4px', marginRight: '4px' }} />
      </Box>

      {menuItems.map((item, index) => (
        <Typography
          key={index}
          variant="body2"
          onClick={() => handleCategorySelect(item.id)}
          sx={{
            fontWeight: 400,
            color: '#666',
            fontSize: '20px',
            cursor: 'pointer',
            minWidth: 'max-content',
            '&:hover': { color: '#1976d2', fontWeight: 500 },
            transition: 'all 0.2s ease'
          }}
        >
          {item.name}
        </Typography>
        
      ))}
      <Typography
            variant="body2"
            onClick={() => navigate("/products")}
            sx={{
              fontWeight: 400,
              color: '#666',
              fontSize: '20px',
              cursor: 'pointer',
              minWidth: 'max-content',
              '&:hover': { color: '#1976d2', fontWeight: 500 },
              transition: 'all 0.2s ease'
            }}
          >
    جميع المنتجات
  </Typography>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: '200px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '8px'
          }
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleCategorySelect(item.id)}
            sx={{
              fontSize: '14px',
              padding: '12px 16px',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MainNav;
