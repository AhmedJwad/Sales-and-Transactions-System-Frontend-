
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExchangeRateResponseDTO } from "../../types/ExchangeRateREsponseDTO";
import genericRepository from "../../repositories/genericRepository";
import { Box } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import { date } from "yup";
import ExchangeRateCreate from "./ExchangeRateCreate";

const ExchangeRateList=()=>{
const { i18n } = useTranslation()
const [loading , setLoaing]=useState(false);
const [rows, setRows]=useState<ExchangeRateResponseDTO[]>([]);
const [dialogOpen, setDialogOpen] = useState(false);
//pagination 
const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(10);
const [rowCount, setRowCount] = useState(0);
const [totalPages, setTotalPages] = useState(0);

//repositories
const repository = genericRepository<ExchangeRateResponseDTO[], ExchangeRateResponseDTO>("ExchangeRate");
const numberRepository = genericRepository<number, number>("ExchangeRate");

const columns=[
  { field: "baseCurrencyName", headerName: "Base Currency", flex: 12 },
  { field: "targetCurrencyName", headerName: "Target Currency", flex: 12 },
  { field: "rate", headerName: "Rate", flex: 6 },
  { field: "isActive", headerName: "Active", flex: 4 },
  { field: "startDate", headerName: "Start Date", flex: 8 },
  { field: "endDate", headerName: "End Date", flex: 8 },
]
const getExchangeRate=async()=>{
    setLoaing(true);
    try {
        const recordsResponse = await numberRepository.getAllByQuery<number>(
              `/recordsNumber`
            );
            const totalRecords = !recordsResponse.error && recordsResponse.response
              ? Number(recordsResponse.response)
              : 10;     
            setRowCount(totalRecords);   
            const totalPagesResponse = await numberRepository.getAllByQuery<number>(
              `/totalPages`
            );
            const pages = !totalPagesResponse.error && totalPagesResponse.response
              ? Number(totalPagesResponse.response)
              : 1;
            setTotalPages(pages);     
            const currentPage = page >= pages ? pages - 1 : page;      
           
            const queryParams = new URLSearchParams({
              Page: (currentPage + 1).toString(),      
              RecordsNumber: pageSize.toString(),
              Language: i18n.language || "en",
            });
        
            const data = await repository.getAllByQuery<ExchangeRateResponseDTO[]>(`?${queryParams}`);
            if (!data.error && data.response) {
              const exchangeRate = data.response.map((item: ExchangeRateResponseDTO) => ({
                ...item,
                id: item.id, 
                baseCurrencyName: item.baseCurrency?.name || "—",
                targetCurrencyName: item.targetCurrency?.name || "—", 
                startDate:item.startDate? new Date(item.startDate).toLocaleDateString("en-GB")
                :"_",
                endDate:item.endDate? new Date(item.endDate).toLocaleDateString("en-GB"):"_",
              }));
              console.log("Exchange Rate:", exchangeRate)
              setRows(exchangeRate );
            }
        
       } catch (error) {
        console.error(error);        
    }finally{
        setLoaing(false)
  }
}
 const handleDialogClose = () => {
    setDialogOpen(false);   
    getExchangeRate();
  };
  useEffect(()=>{
   getExchangeRate();
  },[page, pageSize, i18n.language])
  return (
      <Box>
        {loading ? (
          <LoadingComponent />
        ) : (
          <>
            <DataGridCustom
              columns={columns}
              rows={rows}
              title="ExchangeRate"
              filtercolumn={["baseCurrencyName", "targetCurrencyName"]}             
              onCreateClick={() => {               
                setDialogOpen(true);
              }}
              onEditClick={(id) => {               
                setDialogOpen(true);
              }}
              page={page}
              pageSize={pageSize}
              rowCount={rowCount}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newSize) => setPageSize(newSize)}
            />  
             <GenericDialog
                        open={dialogOpen}
                        onClose={handleDialogClose}
                        title={ "Create exchangeRate"}
                      >
                        <ExchangeRateCreate  onClose={handleDialogClose} />
                      </GenericDialog>           
          </>
        )}
      </Box>
    );
}

export default ExchangeRateList;