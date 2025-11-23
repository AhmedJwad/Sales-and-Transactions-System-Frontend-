import { useEffect, useState } from "react"
import genericRepository from "../../repositories/genericRepository";
import { ColourDTO } from "../../types/ColoutDTO";
import { Box } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import ColourCreate from "./ColourCreate";
import { useTranslation } from "react-i18next";

const ColourList=()=>{
    const { i18n } = useTranslation()
    const [loading , setloaing]=useState(false);
    const [colour, setColour]=useState<any[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const [editId, setdEditId]=useState<number | null>(null);
    //pagination
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const column=[
        {field:"name" , headerName:"Name", flex:3 },
        {field:"hexCode" , headerName:"Color", flex:3,
            renderCell: (params: any) => (
                <Box
                    sx={{
                    width: 40,
                    height: 20,
                    borderRadius: "4px",
                    backgroundColor: params.value, 
                    border: "1px solid #ccc",
                    }}
                    title={params.value} 
                />
                ),
        }
    ]
    const repository=genericRepository<ColourDTO[], ColourDTO>("colours");  
    const numberRepository = genericRepository<number, number>("colours");
    const getColours=async()=>{
        try {
            setloaing(true);
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
           const result=await  await repository.getAllByQuery<ColourDTO[]>(`?${queryParams}`); 
            if(!result.error && result.response)  
            {
                const colors=result.response.map((item:ColourDTO)=>({
                    ...item,
                    id:item.id,
                    productImage:item.productImage || "N/A",
                    productColor:item.productColor ||"N/A",
                }))
                setColour(colors);                
            } else
            {
                console.log("error fetch colours", result.message)
            }         
        } catch (error) {
            console.log("Error:", error)
        }finally
        {
            setloaing(false)
        }
    }
    const handleDelete=async(id:number)=>{
        try {
            setloaing(true);
            const result=await repository.delete(id);
            if(result.error)
            {
               await getColours();
            } else
            {
                 console.error("Delete failed:", result.message || "Unknown error");
            }          
        } catch (error) {
            console.log("Error:", error)
        } finally{
            setloaing(false);
        }      
    }
    const handleDialogClose=()=>{
        setDialogOpen(false);
        setdEditId(null);
        getColours();
    }
    useEffect(()=>{
        getColours();
    },[])
    return(
        <Box>
            {loading?(<LoadingComponent/>):(
                <>
                <DataGridCustom
                title="Colors"
                columns={column}
                rows={colour}
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
                  <GenericDialog open={dialogOpen} onClose={handleDialogClose} title={editId? "Edit Color" : "Create Color"}>         
                    <ColourCreate id={editId} onClose={handleDialogClose}/>
                </GenericDialog>
                </>
            )}
        </Box>
    )

}
export default ColourList;