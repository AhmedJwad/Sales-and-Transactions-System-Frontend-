import { useEffect, useState } from "react"
import { CountryDto } from "../../types/CountryDto";
import genericRepository from "../../repositories/genericRepository";
import { Box } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import CountryCreate from "./CountryCreate";
import { useTranslation } from "react-i18next";

const CountriesLis=()=>{
    const { i18n } = useTranslation();
    const [loading, setLoading]=useState(false);
    const [rows, setRows]=useState<CountryDto[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const [editId, setEditId]=useState<number|null>(null);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    

    const columns=[
        {field: "name", headerName: "Name", flex: 6},
        {field: "statesNumber", headerName: "states Number", flex: 6}
    ]
    const repository=genericRepository<CountryDto[], CountryDto>("Countries");
    const numberRepository = genericRepository<number, number>("Countries");
    const getCountries=async()=>{
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
        const currentPage = page >= pages ? pages - 1 : page;   
        const queryParams = new URLSearchParams({
        Page: (currentPage + 1).toString(),      
        RecordsNumber: pageSize.toString(),
        Language: i18n.language || "en",
        });
        const data=await repository.getAllByQuery<CountryDto[]>(`?${queryParams}`);
        if(!data.error && data.response)
        {
         const countries=data.response.map((item:CountryDto)=>({
             ...item,
             id:item.id,
         }));
         setRows(countries);
        }else{
          console.log(data.error);
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
           await repository.delete(id);
            await getCountries();                   
            } catch (error) {
                 console.log(error); 
            }finally{
                setLoading(false)
            }        
         }
         const  handleDialogClose=()=>{
            setDialogOpen(false);
            setEditId(null);
            getCountries();
         }
         useEffect(()=>{
            getCountries();
         },[page, pageSize, i18n.language])
         return (
            <Box>
                {loading?(<LoadingComponent/>):
                (
                    <>
                    <DataGridCustom
                    columns={columns}
                    rows={rows}
                    title="Countries"
                    filtercolumn={["name"]}
                    onDelete={handleDelete}
                    onCreateClick={()=>{
                        setEditId(null)
                        setDialogOpen(true)
                    }}
                    onEditClick={(id)=>{
                        setEditId(id)
                        setDialogOpen(true)
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
                            title={editId ? "Edit Country" : "Create Country"}
                        >
                            <CountryCreate id={editId} onClose={handleDialogClose} />
                        </GenericDialog>
                    </>
                )}
            </Box>
         )
}
export default CountriesLis;