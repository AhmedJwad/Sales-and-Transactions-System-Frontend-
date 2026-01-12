import { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Container,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import {
  ArrowForward,
  ArrowBack,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import genericRepository from "../../repositories/genericRepository";
import { CategoryDto } from "../../types/CategoryDto";
import { ProductDTO } from "../../types/ProductDTO";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../../components/LoadingComponent";
import { useCurrency } from "../../context/CurrencyContext";

interface DiscountDTO {
  id: number;
  discountPercent: number;
  startTime: string;
  endtime: string;
  isActive: boolean;
  productDiscounts: {
    id: number;
    productID: number;
    product: ProductDTO[];
  }[];
}

const Home: FC = () => {
   const { currency } = useCurrency();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<DiscountDTO[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
  const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 0]);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);

   //pagination
        const [page, setPage] = useState(1);
        const [pageSize, setPageSize] = useState(10);
        const [rowCount, setRowCount] = useState(1);
        const [totalPages, setTotalPages] = useState(0);     

  const language = i18n.language || "en";

  const categoryRepository = genericRepository<CategoryDto[], CategoryDto>(
    `Categories/combo?lang=${language}`
  );

   const productRepo = genericRepository<ProductDTO[], ProductDTO>(`Product`);       
    const numberRepository = genericRepository<number, number>("Product");    

  const DiscountsRepo = genericRepository<DiscountDTO[], DiscountDTO>(
    `Discounts?Page=1&RecordsNumber=10&language=${language}`
  );

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const result = await categoryRepository.getAll();
      if (!result.error && result.response) setCategories(result.response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

   const fetchProducts = async () => {  
              setLoading(true);
              try {
              const recordsResponse = await numberRepository.getAllByQuery<number>(
                          `/recordsNumber`
                          );
                          const totalRecords = !recordsResponse.error && recordsResponse.response
                          ? Number(recordsResponse.response)
                          : 10;     
                          setRowCount(totalRecords);   
                          console.log("totalRecords:", totalRecords)
                          const totalPagesResponse = await numberRepository.getAllByQuery<number>(
                          `/totalPages`
                          );
                          const pages = !totalPagesResponse.error && totalPagesResponse.response
                          ? Number(totalPagesResponse.response)
                          : 1;           
                          setTotalPages(pages); 
                          console.log("totalpages:", totalPages)                            
                          const queryParams = new URLSearchParams({
                          Page: page.toString(),      
                          RecordsNumber: pageSize.toString(),
                          Language: i18n.language || "en",
                          CurrencyCode: currency,
                          });                          
  
              const data=await  await productRepo.getAllByQuery<ProductDTO[]>(`?${queryParams.toString()}`);      
              if (!data.error && data.response) {               
                  const products = data.response.map((item: ProductDTO) => ({
                      id: item.id,
                      name: item.name,
                      description: item.description,
                      price:item.price,//formatPrice(item.price, currency) ,
                      oldPrice: item.oldPrice,// && item.oldPrice > 0 
                      //? formatPrice(item.oldPrice, currency) 
                  // : null,
                      discountPercent: item.discountPercent || 0,
                      stock: item.stock,          
                      categories: item.categories?.map(c => ({
                                                                  id: c.id,
                                                                  category: c.category,
                                                              })) ?? [],  
                  
                      image: item.productImages && item.productImages.length > 0
                                      ? item.productImages[0]
                                      : "/no-image.png",     
                      colors:item.colors?.map(c=>c.hexCode) ?? [],
                      sizes:item.sizes?.map(s=>s.name) ??[],
                      brand:item.brand?.brandTranslations?.[0]?.name ?? "",            
                  
                  }));
                  setProducts(products);                 
                  console.log("product Data:", products)
              } else {
                  console.error("Error fetching Products:", data.message);
              }
              } catch (error: any) {
              console.error("Unexpected error:", error.message || error);
              } finally {
              setLoading(false);
              }
          };
            

          const fetchDiscounts = async () => {
          setLoading(true);
          try {
            const result = await DiscountsRepo.getAll();
            if (!result.error && result.response) {
              setDiscounts(result.response);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };


  const handleCategoryClick = (categoryId: number) => {
    navigate(`/homeproducts/category/${categoryId}`);
  };

  const handleDiscountBannerClick = () => {
    navigate("/discounts");
  };
  const handleDiscountClick = (DiscountId: number) => {
  navigate(`/homeproducts/discount/${DiscountId}`);
};

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchDiscounts();
  }, [i18n.language, currency]);

  return (
    <Box sx={{ bgcolor: "#FAFAFA", minHeight: "100vh", py: 4 }}>
       {loading ? <LoadingComponent /> : (
        <>
      <Container maxWidth="xl">
        {/* Categories Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              mb: 1,
              letterSpacing: '-0.02em',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '2px',
              }
            }}
          >
            Shop by Category
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontSize: '1rem',
              mt: 2,
              fontWeight: 400,
              mb: 4,
            }}
          >
            Discover our curated collection
          </Typography>
          
          <Grid container spacing={2}>
            {/* Large Category - Left Side (Takes 2 rows) */}
            {categories[0] && (
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
                <Card
                  onClick={() => handleCategoryClick(categories[0].id)}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    width: "100%",
                    height: { xs: 350, md: 530 },
                    boxShadow: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "scale(1.01)",
                      "& .category-overlay": {
                        bgcolor: "rgba(0,0,0,0.5)",
                      },
                      "& .category-button": {
                        transform: language === "ar" ? "translateX(-4px)" : "translateX(4px)",
                        bgcolor: "#1A1A1A",
                        "& svg": {
                          color: "#FFFFFF",
                        },
                      },
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100%"
                    image={
                      categories[0].photo
                        ? `https://localhost:7027/${categories[0].photo}`
                        : `${import.meta.env.BASE_URL}assets/category.png`
                    }
                    alt={categories[0].name ?? "Category"}
                    sx={{ objectFit: "cover" }}
                  />
                  <Box
                    className="category-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(0,0,0,0.4)",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 20,
                      left: language === "ar" ? "auto" : 20,
                      right: language === "ar" ? 20 : "auto",
                      display: "flex",
                      flexDirection: language === "ar" ? "row-reverse" : "row",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "1.75rem",
                        textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                      }}
                    >
                      {categories[0].name}
                    </Typography>
                    <IconButton
                      className="category-button"
                      sx={{
                        bgcolor: "#FFFFFF",
                        width: 40,
                        height: 40,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "#1A1A1A",
                        },
                      }}
                    >
                      {language === "ar" ? (
                        <ArrowBack sx={{ fontSize: 20, color: "#1A1A1A" }} />
                      ) : (
                        <ArrowForward sx={{ fontSize: 20, color: "#1A1A1A" }} />
                      )}
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            )}

            {/* Right Side - 4 Small Categories in 2x2 Grid */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                {categories.slice(1, 5).map((cat) => (
                  <Grid size={{ xs: 6, sm: 6, md: 6 }} key={cat.id}>
                    <Card
                      onClick={() => handleCategoryClick(cat.id)}
                      sx={{
                        cursor: "pointer",
                        position: "relative",
                        borderRadius: 3,
                        overflow: "hidden",
                        height: 255,
                        boxShadow: "none",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "scale(1.02)",
                          "& .category-overlay": {
                            bgcolor: "rgba(0,0,0,0.5)",
                          },
                          "& .category-button": {
                            transform: language === "ar" ? "translateX(-4px)" : "translateX(4px)",
                            bgcolor: "#1A1A1A",
                            "& svg": {
                              color: "#FFFFFF",
                            },
                          },
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="255"
                        image={
                          cat.photo
                            ? `https://localhost:7027/${cat.photo}`
                            : `${import.meta.env.BASE_URL}assets/category.png`
                        }
                        alt={cat.name ?? "Category"}
                        sx={{ objectFit: "cover" }}
                      />
                      <Box
                        className="category-overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: "rgba(0,0,0,0.4)",
                          transition: "all 0.3s ease",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          left: language === "ar" ? "auto" : 16,
                          right: language === "ar" ? 16 : "auto",
                          display: "flex",
                          flexDirection: language === "ar" ? "row-reverse" : "row",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                          }}
                        >
                          {cat.name}
                        </Typography>
                        <IconButton
                          className="category-button"
                          sx={{
                            bgcolor: "#FFFFFF",
                            width: 36,
                            height: 36,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "#1A1A1A",
                            },
                          }}
                        >
                          {language === "ar" ? (
                            <ArrowBack sx={{ fontSize: 18, color: "#1A1A1A" }} />
                          ) : (
                            <ArrowForward sx={{ fontSize: 18, color: "#1A1A1A" }} />
                          )}
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Rest of Categories - 3 columns */}
            {categories.slice(5).map((cat) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={cat.id}>
                <Card
                  onClick={() => handleCategoryClick(cat.id)}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    height: 255,
                    boxShadow: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "scale(1.02)",
                      "& .category-overlay": {
                        bgcolor: "rgba(0,0,0,0.5)",
                      },
                      "& .category-button": {
                        transform: language === "ar" ? "translateX(-4px)" : "translateX(4px)",
                        bgcolor: "#1A1A1A",
                        "& svg": {
                          color: "#FFFFFF",
                        },
                      },
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="255"
                    image={
                      cat.photo
                        ? `https://localhost:7027/${cat.photo}`
                        : `${import.meta.env.BASE_URL}assets/category.png`
                    }
                    alt={cat.name ?? "Category"}
                    sx={{ objectFit: "cover" }}
                  />
                  <Box
                    className="category-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(0,0,0,0.4)",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: language === "ar" ? "auto" : 16,
                      right: language === "ar" ? 16 : "auto",
                      display: "flex",
                      flexDirection: language === "ar" ? "row-reverse" : "row",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                      }}
                    >
                      {cat.name}
                    </Typography>
                    <IconButton
                      className="category-button"
                      sx={{
                        bgcolor: "#FFFFFF",
                        width: 36,
                        height: 36,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "#1A1A1A",
                        },
                      }}
                    >
                      {language === "ar" ? (
                        <ArrowBack sx={{ fontSize: 18, color: "#1A1A1A" }} />
                      ) : (
                        <ArrowForward sx={{ fontSize: 18, color: "#1A1A1A" }} />
                      )}
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Discount Banners */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, textAlign: "center", mb: 4 }}
          >
            Hot Discounts 🔥
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {discounts.map((discount) => (
              <Grid  key={discount.id}>
                <Card
                  onClick={() => handleDiscountClick(discount.id)}
                  sx={{
                    cursor: "pointer",
                    px: 4,
                    py: 3,
                    borderRadius: 3,
                    textAlign: "center",
                    background: "linear-gradient(135deg, #FF416C, #FF4B2B)",
                    color: "#fff",
                    minWidth: 160,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "2rem", fontWeight: 900 }}>
                    {discount.discountPercent}%
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    OFF
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Just for You Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1A1A1A 0%, #4A4A4A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                mb: 1,
                letterSpacing: '-0.02em',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #1A1A1A 0%, #4A4A4A 100%)',
                  borderRadius: '2px',
                }
              }}
            >
              Just for You
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontSize: '1rem',
                mt: 2,
                fontWeight: 400,
              }}
            >
              Personalized recommendations
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {products.slice(0, 8).map((prod) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={prod.id}>
                <Card
                  sx={{
                    borderRadius: 2.5,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    bgcolor: "#FFFFFF",
                    border: "1px solid #F0F0F0",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                      transform: "translateY(-4px)",
                      borderColor: "#E0E0E0",
                    },
                  }}
                >
                  <Box sx={{ position: "relative", bgcolor: "#F7F8FA" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`https://localhost:7027/${prod.image}`}
                      alt={prod.name ?? "Product"}
                      sx={{ objectFit: "contain", p: 2.5 }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        bgcolor: "#FFFFFF",
                        width: 32,
                        height: 32,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "#FF4757",
                          transform: "scale(1.1)",
                          "& svg": {
                            color: "#FFFFFF",
                          },
                        },
                      }}
                    >
                      <FavoriteBorder sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#6C757D",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        letterSpacing: "0.5px",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      {prod.categories?.[0]?.subcategoryTranslations?.[0]
                        ?.name ?? "CATEGORY"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: "0.9rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: 42,
                        color: "#1A1A1A",
                      }}
                    >
                      {prod.name ?? "Product Name"}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "#1A1A1A",
                      }}
                    >
                      {prod.price?.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      </>)}
    </Box>
  );
};

export default Home;