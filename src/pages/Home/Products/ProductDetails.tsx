import { useTranslation } from "react-i18next";
import { useCurrency } from "../../../context/CurrencyContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import genericRepository from "../../../repositories/genericRepository";
import { ProductDetailsDTO } from "../../../types/ProductDetailsDTO";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Divider, 
  Grid, 
  Skeleton, 
  Typography,
  Rating,
  Stack,
  Paper
} from "@mui/material";
import { useCart } from "../../../context/CartContext";

const ProductDetails = () => {
  const { currency } = useCurrency();
  const { i18n, t } = useTranslation();
   const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const { id } = useParams<{ id: string }>();
  const numericValue = Number(id);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  
  const [product, setProduct] = useState<ProductDetailsDTO>({
    id: 0,
    name: "test",
    description: "test",
    stock: 0,
    price: 0,
    oldPrice: 0,
    discountPercent: 0,
    images: [],
    brand: null,
    colors: [],
    sizes: [],
    categories: [],
    relatedProducts: [],
  });
  
  const productRepo = genericRepository<ProductDetailsDTO[], ProductDetailsDTO>(
    `Product/product`
  );
  
  const formatPrice=(amount:number, currency:string)=>{
        if(!amount) {
            return "";
        }
        if(currency==="IQ") {
            return `${Math.round(amount).toLocaleString("en-US")} IQ`
        }  
        else if(currency==="USD") {
            return `${amount.toFixed(2)} $`
        }
        else {
            return amount.toString();
        }
    }   
    
    const categoryNames = product.categories
            ?.map(c =>
              c.subcategoryTranslations?.find(
                t => t.language === i18n.language
              )?.name
            )
            .filter(Boolean);

  const getProduct = async () => {
    setLoading(true);
    try {
       const result = await productRepo.getAllByQuery<ProductDetailsDTO>(
      `?Id=${numericValue}&language=${i18n.language}&CurrencyCode=${currency}`
    );
      if (!result.error && result.response) {
        setProduct(result.response);
        console.log("Product:", result.response);
      } else {
        console.error("Error fetching Product:", result.message);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!numericValue) {
     return;
    }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      getProduct();
  }, [numericValue, currency, i18n.language]);

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, md: 4 }, bgcolor: "#f8f9fa" }}>
      {/* Loading */}
      {loading && (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton height={50} />
            <Skeleton height={30} />
            <Skeleton height={30} />
            <Skeleton height={80} />
          </Grid>
        </Grid>
      )}

      {!loading && product.id > 0 && (
        <>
          {/* ================= PRODUCT DETAILS ================= */}
          <Grid container spacing={5}>
            {/* Images */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: "sticky", top: 20 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    bgcolor: "#ffffff",
                    borderRadius: 3,
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
                  }}
                >
                  <CardMedia
                    component="img"                    
                     image={`https://localhost:7027/${
                      product.colors
                        .find(c => c.images?.[0]?.images?.[0] === product.images[selectedImage])
                        ? product.images[selectedImage]
                        : product.images[selectedImage]
                    }`}
                    sx={{
                      objectFit: "contain",
                      height: 450,
                      mb: 3,
                      borderRadius: 2,
                    }}
                  />

                  <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
                    {product.images.map((img, i) => (
                      <Paper
                        key={i}
                        elevation={0}
                        onClick={() => setSelectedImage(i)}
                        sx={{
                          width: 80,
                          height: 80,
                          border: selectedImage === i ? "3px solid #2196F3" : "2px solid #e8e8e8",
                          borderRadius: 2,
                          cursor: "pointer",
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: "#2196F3",
                            transform: "scale(1.05)",
                            boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)"
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={`https://localhost:7027/${img}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            p: 0.5
                          }}
                        />
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* Info */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ 
                bgcolor: "#ffffff", 
                p: 4, 
                borderRadius: 3,
                border: "1px solid #e8e8e8",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
              }}>
                <Typography variant="h3" fontWeight={800} sx={{ mb: 2, color: "#1a1a1a", fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
                   {product.name ?? ""}
                </Typography>               
                  
                <Typography variant="body1" fontWeight={600} color="#666" sx={{ mb: 1, fontSize: "0.95rem" }}>                
                  {t('Categories')}
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 3 }}>
                  {categoryNames.map((cat, i) => (
                    <Chip
                      key={i}
                      label={cat}
                      size="medium"
                      sx={{
                        bgcolor: "#E3F2FD",
                        color: "#1976D2",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        px: 1,
                        "&:hover": {
                          bgcolor: "#BBDEFB"
                        }
                      }}
                    />
                  ))}
                </Box>               
                 
                {product.brand && (
                  <Box sx={{ mt: 3, mb: 3 }}>
                    <Typography variant="body1" fontWeight={600} color="#666" sx={{ mb: 0.5, fontSize: "0.95rem" }}>
                      {t('Brand')}                     
                    </Typography>
                    <Typography fontWeight={700} fontSize="1.2rem" color="#1a1a1a">
                      {product.brand.brandTranslations?.find(
                        t => t.language === i18n.language
                      )?.name ?? ""}
                    </Typography>
                  </Box>
                )}              
                
                <Typography variant="body2" color="#888" sx={{ mb: 3, fontSize: "0.9rem" }}>
                {t(`Productcode`)}<span style={{ fontWeight: 600, color: "#555" }}>#{product.id}</span>
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="body1" fontWeight={600} sx={{ color: "#666" }}>{t("Rating")}</Typography>
                  <Rating value={4} readOnly size="medium" sx={{ color: "#FFB400" }} />
                  <Typography variant="body2" color="#888" fontWeight={500}>
                    (0 {t(`Rating`)})
                  </Typography>
                </Stack>

                <Divider sx={{ my: 3, borderColor: "#e8e8e8" }} />

                <Box sx={{ mb: 4 }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Typography 
                      variant="h3" 
                      fontWeight={900} 
                      sx={{ 
                        color: "#2196F3",
                        fontSize: { xs: "2rem", md: "2.8rem" }
                      }}
                    >                     
                      {formatPrice(product.price, currency)}
                    </Typography>
                    {product.oldPrice > 0 && (
                      <Typography
                        variant="h5"
                        sx={{
                          textDecoration: "line-through",
                          color: "#999",
                          fontWeight: 500,
                          fontSize: { xs: "1.2rem", md: "1.5rem" }
                        }}
                      >                       
                        {formatPrice(product.oldPrice, currency)}
                      </Typography>
                    )}
                  </Stack>
                </Box>

                <Divider sx={{ my: 3, borderColor: "#e8e8e8" }} />

                {/* Option (Sizes) */}
                {product.sizes && product.sizes.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography fontWeight={700} fontSize="1.1rem" sx={{ mb: 2, color: "#1a1a1a" }}>
                      {t(`Size`)}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                      {product.sizes.map((size) => (
                        <Button
                          key={size.id}
                          variant={selectedSize === size.id ? "contained" : "outlined"}
                          size="medium"
                          onClick={() => setSelectedSize(size.id)}
                           sx={{
                                minWidth: 90,
                                height: 48,
                                color: "#1a1a1a",
                                borderColor: "#d0d0d0",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "1rem",
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  borderColor: "#2196F3",
                                  bgcolor: "#E3F2FD",
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)"
                                },
                              }}
                        >
                          {size.name}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Type (Colors as buttons) */}
                {product.colors && product.colors.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography fontWeight={700} fontSize="1.1rem" sx={{ mb: 2, color: "#1a1a1a" }}>
                      {t(`color`)}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      {product.colors.map((c) => (
                        <Box
                          key={c.id}  
                          onClick={() => {
                            setSelectedColor(c.id);
                            const colorImage = c.images?.[0]?.images?.[0];
                            if (colorImage) {
                              const index = product.images.indexOf(colorImage);
                              if (index !== -1) {
                                setSelectedImage(index);
                              }
                            }
                          }}                      
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: c.hexCode,
                            border: selectedColor === c.id ? "3px solid #2196F3" : "3px solid #fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.15)",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.25)"
                            }
                          }}
                        >                          
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
               
                <Box sx={{ 
                  bgcolor: product.stock > 0 ? "#E8F5E9" : "#FFEBEE", 
                  p: 2, 
                  borderRadius: 2,
                  mb: 4,
                  border: `2px solid ${product.stock > 0 ? "#4CAF50" : "#F44336"}`
                }}>
                  <Typography variant="body1" fontWeight={700} sx={{ color: product.stock > 0 ? "#2E7D32" : "#C62828", fontSize: "1rem" }}>
                    {product.stock > 0 ?t(`Availableinstock`): t(`unavailable`)}
                  </Typography>
                  <Typography variant="h6" fontWeight={800} sx={{ color: product.stock > 0 ? "#1B5E20" : "#B71C1C", mt: 0.5, fontSize: "1.3rem" }}>                 
                    {t(`stock`)} {product.stock}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Typography fontWeight={700} fontSize="1.1rem">
                    {t("Quantity")}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      sx={{ minWidth: 32, minHeight: 32, fontWeight: 700 }}
                    >
                      -
                    </Button>

                    <Typography sx={{ minWidth: 32, textAlign: "center", fontWeight: 700 }}>
                      {quantity}
                    </Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setQuantity(prev => prev + 1)}
                      sx={{ minWidth: 32, minHeight: 32, fontWeight: 700 }}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={()=>{
                    addToCart({
                       productId: product.id,
                      name: product.name,
                      description: product.description,
                      image: `https://localhost:7027/${product.images[0]}`,
                      price:product.price,
                      quantity: quantity,
                      colorId:selectedColor?? undefined,
                      sizeId:selectedSize?? undefined,

                    })
                  }}
                  sx={{
                    bgcolor: "#2196F3",
                    color: "#fff",
                    py: 2,
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "#1976D2",
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 30px rgba(33, 150, 243, 0.5)"
                    },
                    
                  }}
                >                  
                  {t(`addtocart`)}
                </Button>             
                
                <Divider sx={{ my: 4, borderColor: "#e8e8e8" }} />
                
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 2, color: "#1a1a1a" }}>
                    {t('Specifications')}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="#555" 
                    sx={{ 
                      whiteSpace: "pre-line",
                      lineHeight: 1.8,
                      fontSize: "1rem"
                    }}
                  >
                    {product.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* ================= RELATED PRODUCTS ================= */}
          {product.relatedProducts.length > 0 && (
            <>
              <Divider sx={{ my: 6, borderColor: "#e8e8e8" }} />

              <Typography 
                variant="h4" 
                fontWeight={800} 
                mb={4} 
                sx={{ 
                  color: "#1a1a1a",
                  fontSize: { xs: "1.5rem", md: "2rem" }
                }}
              >
                {t(`RelatedProducts`)}
              </Typography>

              <Grid container spacing={3}>
                {product.relatedProducts.map((rp) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={rp.id}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #e8e8e8",
                        borderRadius: 3,
                        position: "relative",
                        transition: "all 0.3s ease",
                        bgcolor: "#ffffff",
                        "&:hover": {
                          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                          transform: "translateY(-8px)",
                          borderColor: "#2196F3"
                        },
                      }}
                    >
                      {rp.discountPercent > 0 && (
                        <Chip
                          label={`خصم ${rp.discountPercent}%`}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            bgcolor: "#FF5722",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            height: 28,
                            zIndex: 1,
                            boxShadow: "0 2px 8px rgba(255, 87, 34, 0.4)"
                          }}
                        />
                      )}

                      <Box sx={{ p: 3, bgcolor: "#fafafa" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={`https://localhost:7027/${rp.image}`}
                          sx={{ objectFit: "contain" }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="body1"
                          fontWeight={700}
                          sx={{
                            mb: 1.5,
                            minHeight: 48,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            color: "#1a1a1a",
                            fontSize: "1rem"
                          }}
                        >
                          {rp.name}
                        </Typography>

                        <Rating value={4} readOnly size="small" sx={{ mb: 1.5, color: "#FFB400" }} />

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" fontWeight={800} sx={{ color: "#2196F3", fontSize: "1.4rem" }}>
                            {formatPrice(rp.price, currency)}
                          </Typography>
                          {rp.discountPercent > 0 && rp.oldPrice > 0 && (
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "line-through",
                                color: "#999",
                                fontWeight: 500,
                                mt: 0.5
                              }}
                            >                             
                               {formatPrice(rp.oldPrice, currency)}
                            </Typography>
                          )}
                        </Box>

                        <Button
                          fullWidth
                          size="medium"
                          variant="outlined"
                          sx={{
                            border: "2px solid #e8e8e8",
                            color: "#1a1a1a",
                            textTransform: "none",
                            fontWeight: 700,
                            py: 1.2,
                            borderRadius: 2,
                            fontSize: "0.95rem",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "#2196F3",
                              borderColor: "#2196F3",
                              color: "#fff",
                              transform: "scale(1.02)"
                            },
                          }}
                          onClick={() => navigate(`/product/${rp.id}`)}
                        >
                          {t('Details')}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ProductDetails;