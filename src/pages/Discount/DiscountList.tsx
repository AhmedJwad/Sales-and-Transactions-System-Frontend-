import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import genericRepository from "../../repositories/genericRepository";
import { DiscountDto } from "../../types/DiscountDto";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import DataGridCustom from "../../components/DataGridCustom";

const DiscountList=()=>{
     const [loading, setLoading] = useState(false);
      const [rows, setRows] = useState<any[]>([]); 
      const [editId, setEditId] = useState<number | null>(null);  
      const { t, i18n } = useTranslation();
      //pagination
      const [page, setPage] = useState(0);
        const [pageSize, setPageSize] = useState(10);
        const [rowCount, setRowCount] = useState(0);
        const [totalPages, setTotalPages] = useState(0);

      const navigate = useNavigate();

   const columns = [
    { field: "id", headerName: "Id", flex: 1 },
    { field: "discountPercent", headerName: "Discount Percent", flex: 1 },
    { field: "startTime", headerName: "Start Time", flex:2 },
    { field: "endtime", headerName: "End time", flex: 2 },
    { field: "isActive", headerName: "Active", flex: 2 },
   {
    field: "productDiscounts",
    headerName: "Product Discounts",
    flex: 12,
    renderCell: (params:any) =>
        params.row.productDiscounts.map((p: { name: string }) => p.name).join(", "),
    
    }
    ];
  const DiscountRepo = genericRepository<DiscountDto[], DiscountDto>(`Discounts`); 
  const numberRepository = genericRepository<number, number>("Discounts");
  const getDiscounts = async () => {  
      setLoading(true);
      try {
         const recordsResponse = await numberRepository.getAllByQuery<number>(
                  `/recordsNumber`
                  );
                  const totalRecords = !recordsResponse.error && recordsResponse.response
                  ? Number(recordsResponse.response)
                  : 10;     
                  setRowCount(totalRecords);   
                  console.log("totalRecords:", totalRecords)
                  const totalPagesResponse = await numberRepository.getAllByQuery<number>(
                  `/totalPages`
                  );
                  const pages = !totalPagesResponse.error && totalPagesResponse.response
                  ? Number(totalPagesResponse.response)
                  : 1;           
                  setTotalPages(pages); 
                  console.log("totalpages:", totalPages)
                  const currentPage = page >= pages ? pages - 1 : page;            
                  const queryParams = new URLSearchParams({
                  Page: (currentPage + 1).toString(),      
                  RecordsNumber: pageSize.toString(),
                  Language: i18n.language || "en",                 
                  });   
         const data=await  await DiscountRepo.getAllByQuery<DiscountDto[]>(`?${queryParams}`);;      
        if (!data.error && data.response) {
          const discounts = data.response.map((item: DiscountDto) => ({
              id: item.id,
              discountPercent:`${item.discountPercent} %`,
              startTime: item.startTime? new Date(item.startTime).toLocaleDateString("en-GB"):"_",
              endtime:item.endtime? new Date(item.endtime).toLocaleDateString("en-GB"):"_", 
              isActive: item.isActive,          
              productDiscounts: item.productDiscounts?.map(c => ({
                    name:c.product?.productTranslations
                        ?.find(t => t.language === i18n.language)
                        ?.name ?? "",
                    })) ?? [],        
          }));
          setRows(discounts);
          console.log("discount Data:", discounts)
        } else {
          console.error("Error fetching Products:", data.message);
        }
      } catch (error: any) {
        console.error("Unexpected error:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const result = await DiscountRepo.delete(id);
      if (!result.error) {      
        await getDiscounts();
        console.log("delete data:", result)
      } else {
        console.error("Delete failed:", result.message || "Unknown error");
      }
    } catch (error: any) {
      console.error("Unexpected error during delete:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    navigate("/admin/discounts/create");
  };
  const handleEditClick = (id: number) => {
      navigate(`/admin/discounts/edit/${id}`);
    };
    useEffect(() => {
      const init = async () => {
        setLoading(true);
        try {
          
          await getDiscounts();       
        } catch (error) {
          console.error("Initialization failed:", error);
        } finally {
          setLoading(false);
        }
      };
  
      init();
    }, [page, pageSize, totalPages, i18n.language]);
    return (    
        <Box >         
          {loading ? (
            <LoadingComponent />
          ) : (
            <>
              <DataGridCustom
                columns={columns}
                rows={rows}
                title="Discounts"      
                filtercolumn={["discountPercent"]}     
                onDelete={handleDelete}
                onCreateClick={() => {
                    setEditId(null);
                    handleCreateClick();
                }}
                onEditClick={(id) => {
                    setEditId(id);
                  handleEditClick(id);
                }}
                page={page}
                pageSize={pageSize}
                rowCount={rowCount}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => setPageSize(newSize)}
              />           
              
            </>
          )}
        </Box>
      );
    };
    
export default DiscountList;