import { useEffect, useState } from "react"
import genericRepository from "../../repositories/genericRepository";
import { Box } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import { CityDto } from "../../types/CityDto";
import CityCreate from "./CityCreate";
import { useTranslation } from "react-i18next";


const CitiesList=()=>{
    const { i18n } = useTranslation();
    const [loading, setLoading]=useState(false);
    const [rows, setRows]=useState<any[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const [editId, setEditId]=useState<number|null>(null);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const columns=[
        // {field: "id", headerName: "ID", flex: 1},
        {field: "name", headerName: "Name", flex: 3 },
       /*  {
           field: "cities",
          headerName: "Cities",
          flex: 6,
          renderCell: (params: any) =>
            params.row.cities && Array.isArray(params.row.cities)
              ? params.row.cities.map((c: any) => c.name).join(", ")
              : "No Cities"
        }, */
         {field: "state", headerName: "State", flex: 3 },          
    ]
    const repository=genericRepository<CityDto[], CityDto>("cities"); 
     const numberRepository = genericRepository<number, number>("cities");
    const getCities=async()=>{
        setLoading(true);
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
                  console.log("pages of cities:", pages)
                  const currentPage = page >= pages ? pages - 1 : page;   
                  const queryParams = new URLSearchParams({
                  Page: (currentPage + 1).toString(),      
                  RecordsNumber: pageSize.toString(),
                  Language: i18n.language || "en",
                  });
                  const data=await repository.getAllByQuery<CityDto[]>(`?${queryParams}`);          
                  if(!data.error && data.response) 
                  {
                  const cities= data.response.map((item:CityDto)=>({
                      ...item,
                      id:item.id,            
                      state:item.state?.name || "N/A",                                           
                  }));
                  setRows(cities);
                  }else{
                      console.error("Error Fetch States:", data.error)
                  }         
              } catch (error) {
                  console.log(error);            
              }finally{
                  setLoading(false);
              }
          } 
    const handleDelete=async(id:number)=>{
        try {
            setLoading(true);
             const result= await repository.delete(id);
                if(!result.error)
                {
                await getCities();
                }else
                {
                console.error("Delete failed:", result.message || "Unknown error");
                }                 
        } catch (error:any) {
             console.error("Unexpected error during delete:", error.message || error);
        }finally{
            setLoading(false);
        }
    }  
     const handleDialogClose = () => {
    setDialogOpen(false);
    setEditId(null);
    getCities();
  };
  useEffect(()=>
    {
      getCities();
    },[page, pageSize, i18n.language]);
    return (
    <Box>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <DataGridCustom
            columns={columns}
            rows={rows}
            title="Cities"
            filtercolumn={["name"]}
            onDelete={handleDelete}
            onCreateClick={() => {
              setEditId(null);
              setDialogOpen(true);
            }}
            onEditClick={(id) => {
              setEditId(id);
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
                                title={editId ? "Edit City" : "Create City"}
                              >
                                <CityCreate id={editId} onClose={handleDialogClose} />
                              </GenericDialog>                 
        </>
      )}
    </Box>
  );
}
export default CitiesList;