import { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import { useCategory } from "./CategoryContext";
import genericRepository from "../../repositories/genericRepository";
import { CategoryDto } from "../../types/CategoryDto";
import { useNavigate } from "react-router-dom";
import { SubcategoryDto } from "../../types/SubcategoryDto";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "Mobiles",
    price: "$999",
    image: "https://via.placeholder.com/250",
  },
  {
    id: 2,
    name: "Gaming Laptop",
    category: "Laptops",
    price: "$1200",
    image: "https://via.placeholder.com/250",
  },
  {
    id: 3,
    name: "DSLR Camera",
    category: "Cameras",
    price: "$750",
    image: "https://via.placeholder.com/250",
  },
];
const Home: FC = () => {
 const { setCategoryId , categoryId } = useCategory();
 const navigate = useNavigate();
 const [loading, setLoading] = useState(false);
 const [category, setCategory]=useState<CategoryDto[]>([]);
 const [subcategory, setSubcategoies]=useState<SubcategoryDto[]>([]);     
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
   var subcategoryrepo=genericRepository<SubcategoryDto[], SubcategoryDto>(`Subcategory/combocategory/${categoryId}`);
     const fetchsubcategories = async () => {  
             setLoading(true);
             try {
             const result = await subcategoryrepo.getAll();
             if (!result.error && result.response) {
                 setSubcategoies(result.response);   
                 console.log("subcategories:", subcategory)    
             } else {
                 console.error("Error fetching Subcategories:", result.message);
             }
             } catch (error: any) {
             console.error("Unexpected error:", error.message || error);
             } finally {
             setLoading(false);
             }
   };
  const handleCategorySelect = (id: number) => {
    setCategoryId(id);    
  };
   useEffect(()=>{
    if(categoryId)
    {
      fetchsubcategories();
    }
      fetchcategories();
   } ,[categoryId])

  return (
  <Box sx={{ p: { xs: 2, md: 4 } }}>
    <Typography
      variant="h4"
      sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
    >
      Welcome to Order Plus
    </Typography>

    {categoryId ? (
      <>
        {/* Subcategories Section */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Subcategories
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {subcategory.map((subcat) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={subcat.id}>
              <Card
              onClick={() => navigate(`/products/${subcat.id}`)}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.3s, boxShadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={`https://localhost:7027/${subcat.photo}`}
                  alt={subcat.name}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
                  >
                    {subcat.name}
                  </Typography>

                  {/* Products under subcategory */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    {subcat.products?.map((prod) => (
                      <Chip
                        key={prod.id}
                        label={prod.name}
                        color="secondary"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    ) : (
      <>
        {/* Categories Section */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Categories
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {category.map((cat) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.3s, boxShadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  onClick={() => handleCategorySelect(cat.id)}
                  component="img"
                  height="160"
                  image={`https://localhost:7027/${cat.photo}`}
                  alt={cat.name}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
                  >
                    {cat.name}
                  </Typography>
                  {/* Subcategories preview */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    {cat.subcategories?.slice(0, 3).map((sub, idx) => (
                      <Chip
                        key={idx}
                        label={sub}
                        color="secondary"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Latest Products */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Latest Products
        </Typography>
        <Grid container spacing={3}>
          {products.map((prod) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prod.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={prod.image}
                  alt={prod.name}
                />
                <CardContent>
                  <Typography variant="h6">{prod.name}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Category: {prod.category}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: "bold" }}
                  >
                    {prod.price}
                  </Typography>
                  <Button variant="contained" color="primary" fullWidth>
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    )}
  </Box>
);
}
export default Home;
