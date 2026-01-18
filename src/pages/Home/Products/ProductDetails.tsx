import { useTranslation } from "react-i18next";
import { useCurrency } from "../../../context/CurrencyContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import genericRepository from "../../../repositories/genericRepository";
import { ProductDetailsDTO } from "../../../types/ProductDetailsDTO";
import { Box, Button, Card, CardContent, CardMedia, Chip, Divider, Grid, Skeleton, Typography } from "@mui/material";

const ProductDetails=()=>{
 const { currency } = useCurrency();
 const { i18n } = useTranslation();
 const [loading, setLoading] = useState(false);
 const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);  
 const { id } = useParams<{ id: string }>();
 const numericValue = Number(id);
 const navigate = useNavigate();
 const [product, setProduct] = useState<ProductDetailsDTO>({
    id: 0,
    name: "",
    description: "",
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
 const productRepo = genericRepository<ProductDetailsDTO[], ProductDetailsDTO>(`Product/product?Id=${numericValue}&language=${i18n.language}`); 

    const getProduct = async () => {
    setLoading(true);
    try {
        const result = await productRepo.getOne(numericValue);

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
    if (numericValue) {
        getProduct();
    }
    }, [numericValue, currency, i18n.language]);

  return (
  <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
    {/* Loading */}
    {loading && (
      <Grid container spacing={3}>
        <Grid size={{xs:12, md:6}}>
          <Skeleton variant="rectangular" height={350} />
        </Grid>
        <Grid size={{xs:12, md:6}}>
          <Skeleton height={40} />
          <Skeleton height={25} />
          <Skeleton height={25} />
          <Skeleton height={60} />
        </Grid>
      </Grid>
    )}

    {!loading && product.id > 0 && (
      <>
        {/* ================= PRODUCT DETAILS ================= */}
        <Grid container spacing={4}>
          {/* Images */}
          <Grid size={{xs:12, md:6}}>
            <Card sx={{ p: 2 }}>
              <CardMedia
                component="img"
                height="380"
                image={`https://localhost:7027/${product.images[0]}`}
                sx={{ objectFit: "contain" }}
              />

              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                {product.images.map((img, i) => (
                  <CardMedia
                    key={i}
                    component="img"
                    image={`https://localhost:7027/${img}`}
                    sx={{
                      width: 70,
                      height: 70,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      cursor: "pointer",
                      objectFit: "contain"
                    }}
                  />
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Info */}
          <Grid size={{xs:12, md:6}}>
            <Typography variant="h4" fontWeight={700}>
              {product.name}
            </Typography>

            <Typography sx={{ color: "text.secondary", my: 2 }}>
              {product.description}
            </Typography>

            {product.discountPercent > 0 && (
              <Chip
                label={`-${product.discountPercent}%`}
                color="error"
                sx={{ mb: 1 }}
              />
            )}

            {product.oldPrice > 0 && (
              <Typography sx={{ textDecoration: "line-through", color: "gray" }}>
                {product.oldPrice.toLocaleString()} {currency}
              </Typography>
            )}

            <Typography variant="h5" color="primary" fontWeight={700}>
              {product.price.toLocaleString()} {currency}
            </Typography>

            {/* Colors */}
            <Box sx={{ mt: 3 }}>
              <Typography fontWeight={600}>Colors</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                {product.colors.map((c) => (
                  <Box
                    key={c.id}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: c.hexCode,
                      border: "1px solid #ccc",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* ================= RELATED PRODUCTS ================= */}
        {product.relatedProducts.length > 0 && (
          <>
            <Divider sx={{ my: 5 }} />

            <Typography variant="h5" fontWeight={700} mb={3}>
              Related Products
            </Typography>

            <Grid container spacing={3}>
              {product.relatedProducts.map((rp) => (
                <Grid size={{xs:12, md:4, sm:6}}  key={rp.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "0.3s",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={`https://localhost:7027/${rp.mainImage}`}
                      sx={{ objectFit: "contain" }}
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={600}>
                        {rp.name}
                      </Typography>

                      {rp.discountPercent > 0 && (
                        <Typography
                          sx={{
                            textDecoration: "line-through",
                            fontSize: 13,
                            color: "gray",
                          }}
                        >
                          {rp.oldPrice.toLocaleString()} {currency}
                        </Typography>
                      )}

                      <Typography fontWeight={700} color="primary">
                        {rp.price.toLocaleString()} {currency}
                      </Typography>

                      <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        variant="outlined"
                        onClick={() =>
                          navigate(`/product/${rp.id}`)
                        }
                      >
                        Details
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

 
}

export default ProductDetails;