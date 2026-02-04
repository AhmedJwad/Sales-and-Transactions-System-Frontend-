
import { Alert, Box, Button, Card, CardContent, CardMedia, Grid, IconButton, Snackbar, TextField, Typography } from "@mui/material";
import { useCart } from "../../../context/CartContext"
import { DeleteIcon } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import LoginModal from "../../../components/LoginModal";
import { useNavigate } from "react-router-dom";
import genericRepository from "../../../repositories/genericRepository";
import { OrderDTO } from "../../../types/OrderDTO";
import { useCurrency } from "../../../context/CurrencyContext";


const Cart=()=>{
     const { isAuthenticated} = useAuth();
      const { currency } = useCurrency();
     const [open, setOpen] = useState(false);
    const { order, removeFromCart, updateQuantity, clearCart, setRemark}=useCart();
    const totalPrice=order.orderDetails.reduce((sum, item)=> sum + item.price * item.quantity, 0);
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
     const ordersRes =  genericRepository<OrderDTO[], OrderDTO>("orders")
    const navigate = useNavigate();
    const handleClearCart = () => {
    clearCart();       
    navigate("/");      
    };
    const handleCheckout = async () => {
    if (!isAuthenticated) {
        setOpen(true);
        return;
    }

    try {
        setLoading(true);        
          const orderDto = {
            ...order,                 
            currency: currency  
        };
        const result = await ordersRes.post(orderDto);
       if (result.error) {
            setAlertMessage(result.message?? "Something went wrong");
            setAlertOpen(true);
            console.log("oder:", result)
        } else {
            clearCart();
            navigate("/ContinueShopping");
        }
    } catch (error) {
        console.error("Network error:", error);
    } finally {
        setLoading(false);
    }
};
    const formatCurrency = (value: number, currency: "USD" | "IQ") => {
    const formattedNumber = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: currency === "IQ" ? 0 : 2,
        maximumFractionDigits: currency === "IQ" ? 0 : 2,
    }).format(value);

    if (currency === "IQ") {
        return `IQD ${formattedNumber}`;
    }

    return `$${formattedNumber}`;
};
 useEffect(() => {      
        // Scroll to top when filters change or page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });    
        console.log("order:", order)    
    }, []);



    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" sx={{mb:3, fontWeight:"bold"} }>
                 Shopping Cart
            </Typography>   
            {order.orderDetails.length===0? (
                <Typography variant="h6" color="text.secondary">
                     Your cart is empty 🛒
                </Typography>
            ):(
                <>
                <Grid container spacing={3}>
                    {order.orderDetails.map((item)=>(
                       <Grid  size={{xs:12}} key={item.productId}>
                        <Card sx={{display:"flex", alignItems:"center", p:2}}>
                            <CardMedia
                            component="img"
                            sx={{width:100, height:100, borderRadius:2}}
                            image={item.image}
                           alt={item.name}
                            />
                           <CardContent sx={{flex:1}}>
                            <Typography variant="h6">
                                {item.name}
                            </Typography>
                            <Typography color="textSecondary">
                                {item.description}
                            </Typography>
                            <Typography color="textPrimary">
                               {formatCurrency(item.price, currency)} 
                            </Typography>
                           </CardContent>
                            {/* Quantity Control */}
                            <Box sx={{display:"flex", alignItems:"center", gap:1}}>
                                <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e)=>
                                    updateQuantity(item.productId, Number(e.target.value))
                                }
                                sx={{width:70}}
                                slotProps={{
                                        htmlInput: {
                                        min: 1,                                       
                                        step: 1,
                                        },
                                    }}
                                />
                            </Box>
                             {/* Remove Button */}
                             <IconButton
                             color="error"
                             onClick={()=> removeFromCart(item.productId)}>
                                <DeleteIcon/>
                             </IconButton>
                        </Card>
                       </Grid>                        
                    ))}
                </Grid>
                 {/* Remark Field */}
                    <Box sx={{ mt: 4 }}>
                        <TextField
                            fullWidth
                            label="Order Remark"
                            placeholder="Add a note for your order..."
                            value={order.remarks || ""}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                    </Box>
                 {/* Total & Actions */}
                <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h5">Total: {formatCurrency(totalPrice, currency)}</Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined" color="error" onClick={handleClearCart}>
                        Clear Cart
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleCheckout}>
                        Checkout
                    </Button>
                    </Box>
                     {open && <LoginModal open={open} handleClose={() => setOpen(false)} />}
                </Box>
                </>
            )} 
            <Snackbar 
                open={alertOpen} 
                autoHideDuration={4000} 
                onClose={() => setAlertOpen(false)}
            >
                <Alert onClose={() => setAlertOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>       
        </Box>
    )

}
export default Cart;