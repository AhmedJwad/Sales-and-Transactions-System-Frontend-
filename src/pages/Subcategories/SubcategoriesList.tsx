import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import LoadingComponent from "../../components/LoadingComponent";
import SubcategoryCreate from "./ٍSubcategorycreate";
import genericRepository from "../../repositories/genericRepository";
import { SubcategoryDto } from "../../types/SubcategoryDto"; 

const SubcategoriesList = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 3 },
    { field: "category", headerName: "Category", flex: 6 },
  ];

  const repository = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory");

  const getSubcategories = async () => {
    setLoading(true);
    try {
      const data = await repository.getAll();
      if (!data.error && data.response) {
        const formatted = data.response.map((item: SubcategoryDto) => ({
          ...item,
          id: item.id,
          category: item.category?.name || "N/A",
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
  }, []);

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
