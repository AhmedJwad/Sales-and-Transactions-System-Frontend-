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

interface DiscountDTO {
  id: number;
  discountPercent: number;
  startTime: string;
  endtime: string;
  isActive: boolean;
  productDiscounts: {
    id: number;
    productID: number;
    product: ProductDTO & { mainImage?: string };
  }[];
}

const Home: FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [discounts, setDiscounts] = useState<DiscountDTO[]>([]);

  const language = i18n.language || "en";

  const categoryRepository = genericRepository<CategoryDto[], CategoryDto>(
    `Categories/combo?lang=${language}`
  );

  const ProductRepo = genericRepository<ProductDTO[], ProductDTO>(
    `Product/Getfullproduct`
  );

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
      const result = await ProductRepo.getAll();
      if (!result.error && result.response) setProducts(result.response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const result = await DiscountsRepo.getAll();
      if (!result.error && result.response) setDiscounts(result.response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/category/${categoryId}`);
  };

  const handleDiscountBannerClick = () => {
    navigate("/discounts");
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchDiscounts();
  }, [i18n.language]);

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

        {/* Flash Deals from Discounts */}
        {discounts.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #FF4757 0%, #FF6B81 100%)',
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
                      background: 'linear-gradient(90deg, #FF4757 0%, #FF6B81 100%)',
                      borderRadius: '2px',
                    }
                  }}
                >
                  Flash Deals
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
                  Limited time offers just for you
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={2.5}>
              {discounts
                .flatMap((discount) =>
                  discount.productDiscounts.map((pd) => ({
                    ...pd.product,
                    discountPercent: discount.discountPercent,
                  }))
                )
                .slice(0, 4)
                .map((prod, index) => (
                  <Grid size={{ xs: 6, sm: 6, md: 3 }} key={prod.id || index}>
                    <Card
                      sx={{
                        borderRadius: 2.5,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        bgcolor: "#FFFFFF",
                        border: "1px solid #F0F0F0",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                          transform: "translateY(-6px)",
                          borderColor: "#E0E0E0",
                        },
                      }}
                    >
                      <Chip
                        label={`${prod.discountPercent}% off`}
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          bgcolor: "#FF4757",
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          zIndex: 2,
                          boxShadow: "0 2px 8px rgba(255,71,87,0.3)",
                          border: "none",
                        }}
                      />
                      <Box sx={{ position: "relative", bgcolor: "#F7F8FA" }}>
                        <CardMedia
                          component="img"
                          height="220"
                          image={`https://localhost:7027/${prod.productImages?.[0]}`}
                          alt={
                            prod.productionTranslations?.[0]?.name ?? "Product"
                          }
                          sx={{ objectFit: "contain", p: 2.5 }}
                        />
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
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.9rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            minHeight: 44,
                            color: "#1A1A1A",
                          }}
                        >
                          {prod.productionTranslations?.[0]?.name ??
                            "Product Name"}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.2rem",
                            color: "#FF4757",
                          }}
                        >
                          IQD {prod.price?.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}

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
                      image={`https://localhost:7027/${prod.productImages?.[0]}`}
                      alt={prod.productionTranslations?.[0]?.name ?? "Product"}
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
                      {prod.productionTranslations?.[0]?.name ?? "Product Name"}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "#1A1A1A",
                      }}
                    >
                      IQD {prod.price?.toLocaleString()}
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