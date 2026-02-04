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
import { useCurrency } from "../../context/CurrencyContext";
import { useTranslation } from "react-i18next";

const orderStatusMap: Record<number, string> = {
  0: "New",
  1: "Shipped",
  2: "Sent",
  3: "Confirmed",
  4: "Cancelled",
};

const OrderIndex = () => {
  const { currency } = useCurrency();
  const { i18n } = useTranslation();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");

  const OrderRepo = genericRepository<OrderResponseDTO[], OrderResponseDTO>("orders");
  const numberRepo = genericRepository<number, number>("orders");

  const getOrders = async () => {
    try {
      setLoading(true);

      const pagesResponse = await numberRepo.getAllByQuery<number>("/totalPages");
      if (!pagesResponse.error && pagesResponse.response) {
        setTotalPages(Number(pagesResponse.response));
      }

      const queryParams = new URLSearchParams({
        Page: page.toString(),
        RecordsNumber: pageSize.toString(),
        Language: i18n.language || "en",
        currency: currency,
      });

      if (searchText.trim()) {
        queryParams.append("Filter", searchText);
      }

      const data = await OrderRepo.getAllByQuery<OrderResponseDTO[]>(
        `?${queryParams.toString()}`
      );

      if (!data.error && data.response) {
        setOrders(data.response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [currency, i18n.language, page, searchText]);

  const handleOrderDetailsClick = (id: number) => {
    navigate(
      userRole === "Admin"
        ? `/admin/orders/orderdetails/${id}`
        : `/orderdetails/${id}`
    );
  };
  const formattedDate = new Date("2026-01-31T07:33:36.9393774")
  .toLocaleDateString("en-GB")

  const MobileOrderCard = ({ row }: { row: OrderResponseDTO }) => {
    const imagePath = row.userPhoto
      ? `https://localhost:7027/${row.userPhoto}`
      : "https://localhost:7027/images/products/no-image.png";

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{xs:12}}  display="flex" gap={2}>
              <img src={imagePath} width={60} height={60} />
              <Box>
                <Typography variant="h6">{row.userFullName}</Typography>
                <Typography variant="body2">{new Date(row.date).toLocaleString()}</Typography>
              </Box>
            </Grid>

            <Grid size={{xs:6}}>
              <Typography variant="caption">Lines</Typography>
              <Typography>{row.lines}</Typography>
            </Grid>

            <Grid size={{xs:6}}>
              <Typography variant="caption">Quantity</Typography>
              <Typography>{row.quantity}</Typography>
            </Grid>

            <Grid size={{xs:6}}>
              <Typography variant="caption">Value</Typography>
              <Typography>{row.value}</Typography>
            </Grid>

            <Grid size={{xs:6}}>
              <Typography variant="caption">Status</Typography>
              <Typography>
                {orderStatusMap[row.orderStatus] ?? row.orderStatus}
              </Typography>
            </Grid>

            <Grid size={{xs:6}}>
              <Button fullWidth variant="contained"
                onClick={() => handleOrderDetailsClick(row.id)}>
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
      {loading ? <LoadingComponent /> : (
        <>
          <TextField
            label="Search by Full Name"
            fullWidth
            margin="normal"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          />

          {isMobile ? (
            orders.map(row => <MobileOrderCard key={row.id} row={row} />)
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Mobile Number</TableCell>
                    <TableCell>Adress</TableCell>
                    <TableCell>Lines</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Photo</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map(row => (
                    <TableRow key={row.id}>
                      <TableCell  dir="ltr">{new Date(row.date).toLocaleString()}</TableCell>
                      <TableCell>{row.userFullName}</TableCell>
                      <TableCell  dir="ltr">{row.phoneNumber}</TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell>{row.lines}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.value}</TableCell>
                      <TableCell>
                        {orderStatusMap[row.orderStatus] ?? row.orderStatus}
                      </TableCell>
                      <TableCell>
                        <img src={`https://localhost:7027/${row.userPhoto}`} width={50} />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="contained"
                          onClick={() => handleOrderDetailsClick(row.id)}>
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default OrderIndex;
