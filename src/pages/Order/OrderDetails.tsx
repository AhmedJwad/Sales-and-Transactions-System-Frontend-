import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import genericRepository from "../../repositories/genericRepository";
import { OrderResponseDTO} from "../../types/OrderResponseDTO";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import { OrderDetailResponseDTO } from "../../types/OrderDetailResponseDTO";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useAuth } from "../../hooks/useAuth";



const orderStatusMap:Record<number, string>={
  0: "New",
  1: "Shipped",
  2: "Sent",
  3: "Confirmed",
  4: "Cancelled"
}
enum OrderStatus {
  New = 0,
  Shipped = 1,
  Sent = 2,
  Confirmed = 3,
  Cancelled = 4
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [swalProps, setSwalProps] = useState({});
  const repository = genericRepository<OrderResponseDTO[], OrderResponseDTO>("orders");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const getOrderDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await repository.getOne(+id);
      if (!result.error && result.response) {
        setOrder(result.response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, [id]);

  if (loading || !order) return <LoadingComponent />;

  const noImage = "https://localhost:7027/images/products/no-image.png";
  const userImage =
    order.userPhoto && order.userPhoto !== "/no-image.png"
      ? `https://localhost:7027/${order.userPhoto}`
      : noImage;
  const handleChangeStatus = async (Status: OrderStatus) => {
  if (!order) return;

  const result = await Swal.fire({
    title: "Are you sure?",
    text: `Do you want to set status to ${orderStatusMap[Status]}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    
  });

  if (!result.isConfirmed) {
    return;
    }
     try {
      const response = await repository.put({ ...order, orderStatus: Status });
      if (!response.error && response.response) {
        console.log("order update:", order);
        setOrder(response.response);        
        navigate("/admin/orders")
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update order status",
        });
      }
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update order status",
      });
  }
};
 


  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>

     
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{xs:12 , md:2}}>
              <img
                src={userImage}
                alt="user"
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
              />
            </Grid>
            <Grid size={{xs:12 , md:2}}>
              <Typography variant="h6">{order.userFullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.userEmail}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(order.date).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remarks: {order.remarks || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lines: {order.lines}, Quantity: {order.quantity}, Value: {order.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
               Sataus:{orderStatusMap[order.orderStatus as number]?? order.orderStatus}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {}
      <Box sx={{mt:2, display:"flex", gap:2}}>
        {userRole==="Admin"?(
          <>
        <Button variant="contained" color="warning" onClick={()=>handleChangeStatus(OrderStatus.Cancelled)} >
          Cancel
        </Button>  
         <Button variant="contained" color="info" onClick={()=>handleChangeStatus(OrderStatus.Shipped)}>
          Dispatch
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleChangeStatus(OrderStatus.Sent)}>
          Send
        </Button>
        <Button variant="contained" color="success" onClick={() => handleChangeStatus(OrderStatus.Confirmed)}>
          Confirm
        </Button>
        </>):
        <>
        </>
        }      
             
       
      </Box>
   
      {isMobile ? (
        <Box>
          {order.orderDetailResponseDTOs?.map((item: OrderDetailResponseDTO) => {
            const itemImage = item.image
              ? `https://localhost:7027/${item.image}`
              : noImage;
            return (
              <Card key={item.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{xs:4}}>
                      <img
                        src={itemImage}
                        alt={item.name}
                        style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8 }}
                      />
                    </Grid>
                    <Grid size={{xs:8}}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2">{item.description}</Typography>
                      <Typography variant="body2">
                        Price: {item.price}, Quantity: {item.quantity}, Value: {item.value}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderDetailResponseDTOs.map((item: OrderDetailResponseDTO) => {
                const itemImage = item.image
                  ? `https://localhost:7027/${item.image}`
                  : noImage;
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img
                        src={itemImage}
                        alt={item.name}
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => window.history.back()}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default OrderDetails;
