import { Box, Container, Grid, Typography, Link } from "@mui/material";
import { FC } from "react";

const FooterHome: FC = () => {
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
              متجرنا
            </Typography>
            <Typography variant="body2">
              جميع المنتجات أصلية 100% (أبل – مكياج – عناية – أجهزة منزلية).
            </Typography>
          </Grid>
         
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              روابط سريعة
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/" color="inherit" underline="hover">
                الرئيسية
              </Link>
              <Link href="/products" color="inherit" underline="hover">
                المنتجات
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                تواصل معنا
              </Link>
            </Box>
          </Grid>
       
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              تواصل معنا
            </Typography>
            <Typography variant="body2">📍 العراق - بابل</Typography>
            <Typography variant="body2">📧 info@store.com</Typography>
            <Typography variant="body2">📞 +964 770 000 0000</Typography>
          </Grid>
        </Grid>       
        <Box sx={{ textAlign: "center", mt: 4, pt: 2, borderTop: "1px solid #555" }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} متجرنا. جميع الحقوق محفوظة.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterHome;
