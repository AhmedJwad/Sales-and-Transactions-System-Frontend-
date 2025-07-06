// src/pages/Categories/CategoriesList.tsx
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DataGridCustom from "../../components/DataGridCustom";
import LoadingComponent from "../../components/LoadingComponent";
import GenericDialog from "../../components/GenericDialog";
import CategoriesCreate from "./CategoriesCreate";
import { CategoryDto } from "../../types/CategoryDto";
import genericRepository from "../../repositories/genericRepository";

const CategoriesList = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<CategoryDto[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 12 },
  ];

  // استخدم genericRepository مباشرة مع المسار المناسب و الـ DTO
  const repository = genericRepository<CategoryDto[], CategoryDto>("categories");

  const getCategories = async () => {
    setLoading(true);
    try {
      const data = await repository.getAll();
      if (!data.error && data.response) {
        const categories = data.response.map((item: CategoryDto) => ({
          ...item,
          id: item.id, // مطلوب لـ MUI DataGrid
        }));
        setRows(categories);
      }else
      {
        console.log(data.error);
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
      await repository.delete(id);
      await getCategories();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditId(null);
    getCategories();
  };

  useEffect(() => {
    getCategories();
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
            title="Category"
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
            title={editId ? "Edit Category" : "Create Category"}
          >
            <CategoriesCreate id={editId} onClose={handleDialogClose} />
          </GenericDialog>
        </>
      )}
    </Box>
  );
};

export default CategoriesList;
