// src/pages/Categories/CategoriesList.tsx
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DataGridCustom from "../../components/DataGridCustom";
import LoadingComponent from "../../components/LoadingComponent";
import CategoryRepository from "../../repositories/categoryRepository";
import GenericDialog from "../../components/GenericDialog";
import CategoriesCreate from "./CategoriesCreate";

const CategoriesList = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 12},
  ];

  const getCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoryRepository().get();
      setRows(data.map((item: any) => ({ ...item, id: item.id })));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await CategoryRepository().delete(id);
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
