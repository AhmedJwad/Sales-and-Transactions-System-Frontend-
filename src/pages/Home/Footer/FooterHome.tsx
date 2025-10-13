import { Box, Container, Grid, Typography, Link } from "@mui/material";
import { FC } from "react";
import { useTranslation } from 'react-i18next';
const FooterHome: FC = () => {
  const{t}=useTranslation();
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "grey.100",
        color: "black",
        py: 4,
        mt: 4,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* القسم الأول */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t(`shop`)}
            </Typography>
            <Typography variant="body2">
              {t(`allProductsOriginal`)}
            </Typography>
          </Grid>
         
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>              
              {t("quickLinks")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/" color="inherit" underline="hover">
                {t("home")}
              </Link>
              <Link href="/products" color="inherit" underline="hover">
               {t(`allproducts`)}
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
               {t(`contact`)}
              </Link>
            </Box>
          </Grid>
       
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t(`contactus`)}
            </Typography>
            <Typography variant="body2">📍 {t(`iraq`)}</Typography>
            <Typography variant="body2">📧 info@store.com</Typography>
            <Typography variant="body2">📞 +964 770 000 0000</Typography>
          </Grid>
        </Grid>       
        <Box sx={{ textAlign: "center", mt: 4, pt: 2, borderTop: "1px solid #555" }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} {t(`footerRights`)}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterHome;
