import { useEffect, useState } from "react"
import genericRepository from "../../repositories/genericRepository";
import { SizeDTO } from "../../types/SizeDTO";
import { Box } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import SizeCreate from "./SizeCreate";
import { useTranslation } from "react-i18next";
const SizeList=()=>{
    const { i18n } = useTranslation()
    const[loading , setLoading]=useState(false);
    const [rows, setRows]=useState<any[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const[editId, setdEditId]=useState<number | null>(null);
    //pagination
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const column=[
         {field:"name" , headerName:"Name", flex:3 },
    ]
    const repository=genericRepository<SizeDTO[], SizeDTO>("sizes");
    const numberRepository = genericRepository<number, number>("sizes");
    const getSizes=async()=>{
        try {
            setLoading(true);
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
            const result=await  await repository.getAllByQuery<SizeDTO[]>(`?${queryParams}`);   
            if(!result.error && result.response)  
                {
                    const sizes=result.response.map((item:SizeDTO)=>({
                        ...item,
                        id:item.id,
                        productSizes:item.productSizes || "N/A",
                    }))
                   setRows(sizes);
                }
                else
                {
                   console.log("error fetch colours", result.message)           
                }          
        } catch (error) {
            console.log("Error:", error)
        }finally
        {
            setLoading(false);
        }
    }

    const handleDelete=async(id:number)=>{
        try {
            setLoading(true)
            const result=await repository.delete(id);
            if(result.error)
            {
                getSizes();
            }
            else
            {
                 console.error("Delete failed:", result.message || "Unknown error");
            }
        } catch (error) {
             console.log("Error:", error)
        }finally{
            setLoading(false);
        }
    }
    const handleDialogClose=()=>{
        setDialogOpen(false);
        setdEditId(null);
        getSizes();
    }
    useEffect(()=>
        {
            getSizes();            
        },[])
        return(
            <Box>
                {loading?(<LoadingComponent/>):(
                    <>
                    <DataGridCustom
                    columns={column}
                    rows={rows}
                    title="Sizes"
                    filtercolumn={["name"]}
                    onDelete={handleDelete}
                    onCreateClick={()=>{
                    setdEditId(null);
                    setDialogOpen(true);
                    }                    
                    }
                    onEditClick={(id)=>{
                        setdEditId(id);
                        setDialogOpen(true)
                    }}
                    page={page}
                    pageSize={pageSize}
                    rowCount={rowCount}
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newSize) => setPageSize(newSize)}
                    />
                   <GenericDialog open={dialogOpen} onClose={handleDialogClose} title={editId ? "Edits size" : "Create size"}>
                    <SizeCreate id={editId} onClose={handleDialogClose}/>
                   </GenericDialog>
                    </>
                )}
            </Box>
        )
}
export default  SizeList;