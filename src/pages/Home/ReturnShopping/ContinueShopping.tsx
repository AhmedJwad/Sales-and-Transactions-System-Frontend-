import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ContinueShopping = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        //background: "linear-gradient(135deg, #f3f4f6, #ffffff)",
        p: 3,
      }}
    >
      {/* image*/}
      <Box
        component="img"
        src="https://cdn-icons-png.flaticon.com/512/679/679922.png"
        alt="Order Complete"
        sx={{
          width: 180,
          height: 180,
          mb: 3,
          animation: "bounce 2s infinite",
        }}
      />

      {/* text*/}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Your order is complete 🎉
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track your order through your control panel.
      </Typography>

      {/* button */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 3, py: 1.2, borderRadius: 2 }}
          onClick={() => navigate("/control-panel")}
        >
          Go to Control Panel
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ px: 3, py: 1.2, borderRadius: 2 }}
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </Button>
      </Box>
    </Box>
  );
};

export default ContinueShopping;
