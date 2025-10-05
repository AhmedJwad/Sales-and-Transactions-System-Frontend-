import { useEffect, useState } from "react";
import { OrderResponseDTO } from "../../types/OrderResponseDTO";
import genericRepository from "../../repositories/genericRepository";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Pagination,
  Card,
  CardContent,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
const orderStatusMap: Record<number, string> = {
  0: "New",
  1: "Shipped",
  2: "Sent",
  3: "Confirmed",
  4: "Cancelled"
};

const OrderIndex = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<OrderResponseDTO[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const repository = genericRepository<OrderResponseDTO[], OrderResponseDTO>("orders");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userRole } = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      var result = await repository.getAll();
      if (!result.error && result.response) {
        const orders = result.response.map((item: OrderResponseDTO) => ({
          ...item,
          id: item.id,
        }));
        setRows(orders);
      } else {
        console.log("order:", result.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
   
  }, []);
  useEffect(() => {
  console.log("userRole updated:", userRole);
}, [userRole]);

  const filteredRows = rows.filter((row) =>
    row.userFullName?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedRows = filteredRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const handleOrderdetailsClick = (id: number) => {
    if(userRole==="Admin")
    {
      navigate(`/admin/orders/orderdetails/${id}`);
      
    }else 
    {
      navigate(`/orderdetails/${id}`);
    }
   
  };
  // Mobile Card View
  const MobileOrderCard = ({ row }: { row: OrderResponseDTO }) => {
    const noImage = "https://localhost:7027/images/products/no-image.png";
    const imagePath =
      row.userPhoto && row.userPhoto !== "/no-image.png"
        ? `https://localhost:7027/${row.userPhoto}`
        : noImage;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{xs:12}} display="flex" alignItems="center" gap={2}>
              <img
                src={imagePath}
                alt="user"
                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
              />
              <Box flex={1}>
                <Typography variant="h6" gutterBottom>
                  {row.userFullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.date}
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{xs:6}} >
              <Typography variant="caption" color="text.secondary">
                lines
              </Typography>
              <Typography variant="body1">{row.lines}</Typography>
            </Grid>
            
            <Grid size={{xs:6}}>
              <Typography variant="caption" color="text.secondary">
                Quantity
              </Typography>
              <Typography variant="body1">{row.quantity}</Typography>
            </Grid>
            
            <Grid size={{xs:6}}>
              <Typography variant="caption" color="text.secondary">
                Value
              </Typography>
              <Typography variant="body1">{row.value}</Typography>
            </Grid>
            
            <Grid size={{xs:6}}>
              <Typography variant="caption" color="text.secondary">
                Order status
              </Typography>
              <Typography variant="body1">
                {orderStatusMap[row.orderStatus as number]?? row.orderStatus}
                </Typography>
            </Grid>
            
            <Grid size={{xs:6}}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleOrderdetailsClick(row.id)}
              >
               Details
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <TextField
            label="Search by Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {isMobile ? (
            // Mobile View - Cards
            <Box sx={{ mt: 2 }}>
              {paginatedRows.map((row) => (
                <MobileOrderCard key={row.id} row={row} />
              ))}
            </Box>
          ) : (
            // Desktop View - Table
            <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Lines</TableCell>
                    <TableCell>َQuantity</TableCell>
                    <TableCell>Values</TableCell>
                    <TableCell>Order Status</TableCell>
                    <TableCell>User Photo</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row) => {
                    const noImage = "https://localhost:7027/images/products/no-image.png";
                    const imagePath =
                      row.userPhoto && row.userPhoto !== "/no-image.png"
                        ? `https://localhost:7027/${row.userPhoto}`
                        : noImage;

                    return (
                      <TableRow key={row.id}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.userFullName}</TableCell>
                        <TableCell>{row.lines}</TableCell>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>{row.value}</TableCell>
                        <TableCell>
                          {orderStatusMap[row.orderStatus as number]?? row.orderStatus}
                          </TableCell>
                        <TableCell>
                          <img
                            src={imagePath}
                            alt="user"
                            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                             onClick={() => handleOrderdetailsClick(row.id)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(filteredRows.length / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default OrderIndex;