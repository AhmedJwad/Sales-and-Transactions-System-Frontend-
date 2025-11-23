import { Box } from "@mui/material";
import { useEffect, useState } from "react"
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import LoadingComponent from "../../components/LoadingComponent";
import genericRepository from "../../repositories/genericRepository";
import { BrandDto } from "../../types/BrandDto";
import BrandCreate from "./Brandcreate";
import { useTranslation } from "react-i18next";

const BrandsList=()=>{
    const { i18n } = useTranslation()
    const [loading, setLoading]=useState(false);
    const [rows, setRows]=useState<any[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const [editId, setEditId]=useState<number| null>(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const columns=[
       { field:"id" , headerName:"ID" ,flex:1},   
       { field: "name", headerName: "Name", flex: 3 },
       { field:"subcategory" , headerName:"SubCategory" ,flex:3}
    ];
    const repository=genericRepository<BrandDto[], BrandDto>("Brand");
    const numberRepository = genericRepository<number, number>("Brand");
    const getBrands=async()=>{
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
            const data=await  await repository.getAllByQuery<BrandDto[]>(`?${queryParams}`);      
            if(!data.error && data.response)
            {
                const brands=data.response.map((item:BrandDto)=>({
                    ...item,
                    id:item.id,
                    subcategory: item.subcategory?.subcategoryTranslations?.[0].name || "N/A",
                    name: item.brandTranslations?.[0]?.name || "N/A",
                }));
                setRows(brands);               
            } else{
                console.error("Error fetching brands:", data.message);
            }   
        } catch (error:any) {
            console.error("Unexpected error:", error.message || error);            
        }finally{
            setLoading(false);
        }
    }
    const handleDelete = async(id: number)=>{
        try {
            setLoading(true);
           const result= await repository.delete(id);
           if(result.error)
           {
            await getBrands();
           } 
           else
           {
             console.error("Delete failed:", result.message || "Unknown error")
           }        
        } catch (error:any) {
            console.error("Unexpected error during delete:", error.message || error);            
        }finally{
            setLoading(false)
        }
    };
    const handleDialogClose=()=>{
        setDialogOpen(false);
        setEditId(null);
        getBrands();
    }
    useEffect(()=>{ 
        getBrands();
    },[page, pageSize, totalPages, i18n.language]);
    return(
        <Box>
           {loading ? (<LoadingComponent/>): (<><DataGridCustom 
            columns={columns}
            rows={rows}
            title="Brands"
            filtercolumn={["name"]}
            onDelete={handleDelete}
            onCreateClick={() => {
                setEditId(null);
                setDialogOpen(true);
              }}
            onEditClick={(id)=>{
                setEditId(id),
                setDialogOpen(true);
            }}
            page={page}
            pageSize={pageSize}
            rowCount={rowCount}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
            />
            <GenericDialog open={dialogOpen} onClose={handleDialogClose} title={editId? "Edit Brand" : "Create Brand"}>         
            <BrandCreate id={editId} onClose={handleDialogClose}/>
            </GenericDialog>
            </>)}
        </Box>
    )
}
export default BrandsList;