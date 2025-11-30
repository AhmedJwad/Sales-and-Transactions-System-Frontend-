import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import LoadingComponent from "../../components/LoadingComponent";
import SubcategoryCreate from "./ٍSubcategorycreate";
import genericRepository from "../../repositories/genericRepository";
import { SubcategoryDto } from "../../types/SubcategoryDto"; 
import { useTranslation } from "react-i18next";


const SubcategoriesList = () => {
  const { i18n } = useTranslation()
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const renderImageCell = (params: any) => {
    const noImage = "https://localhost:7027/images/products/no-image.png";
    const imagePath =
      params.value && params.value !== "/no-image.png"
        ? `https://localhost:7027/${params.value}`
        : noImage;

    return (
      <img
        src={imagePath}
        alt="category"
        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
      />
    );
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 3 },
    { field: "category", headerName: "Category", flex: 6 },
    { field: "photo", headerName: "Image", flex: 6, renderCell: renderImageCell },
  ];

  const repository = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory");
   const numberRepository = genericRepository<number, number>("Subcategory");

  const getSubcategories = async () => {
    setLoading(true);
    try {
      const recordsResponse=await numberRepository.getAllByQuery<number>(`/recordsNumber`);
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
      const data = await repository.getAllByQuery<SubcategoryDto[]>(`?${queryParams}`);
      if (!data.error && data.response) {
        const formatted = data.response.map((item: SubcategoryDto) => ({
          ...item,
          id: item.id,
          category: item.category?.categoryTranslations[0]?.name || "N/A",
          name:item.subcategoryTranslations[0]?.name|| "—",          
        }));
        setRows(formatted);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
     const result= await repository.delete(id);
     if(!result.error)
     {
      await getSubcategories();
     }else
     {
      console.error("Delete failed:", result.message || "Unknown error");
     }     
    } catch (error:any) {
      console.error("Unexpected error during delete:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditId(null);
    getSubcategories();
  };

  useEffect(() => {
    getSubcategories();
  }, [page, pageSize, i18n.language]);

  return (
    <Box>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <DataGridCustom
            columns={columns}
            rows={rows}
            title="Subcategory"
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
            title={editId ? "Edit Subcategory" : "Create Subcategory"}
          >
            <SubcategoryCreate id={editId} onClose={handleDialogClose} />
          </GenericDialog>
        </>
      )}
    </Box>
  );
};

export default SubcategoriesList;
