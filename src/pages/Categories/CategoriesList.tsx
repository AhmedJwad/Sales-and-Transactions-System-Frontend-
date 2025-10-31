// src/pages/Categories/CategoriesList.tsx
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DataGridCustom from "../../components/DataGridCustom";
import LoadingComponent from "../../components/LoadingComponent";
import GenericDialog from "../../components/GenericDialog";
import CategoriesCreate from "./CategoriesCreate";
import { CategoryDto } from "../../types/CategoryDto";
import genericRepository from "../../repositories/genericRepository";
import { useTranslation } from "react-i18next";

const CategoriesList = () => {
   const { i18n } = useTranslation()
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<CategoryDto[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const repository = genericRepository<CategoryDto[], CategoryDto>("Categories");
  const numberRepository = genericRepository<number, number>("Categories");
 
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
    { field: "name", headerName: "Name", flex: 12 },
    { field: "photo", headerName: "Image", flex: 6, renderCell: renderImageCell },
  ];

 
  const getCategories = async () => {
  setLoading(true);
  try {
    // ✅ جلب عدد السجلات من السيرفر أولاً
    const recordsResponse = await numberRepository.getAllByQuery<number>(
      `/recordsNumber`
    );
    const totalRecords = !recordsResponse.error && recordsResponse.response
      ? Number(recordsResponse.response)
      : 10; 
     console.log("totalRecords:", totalRecords)
    setRowCount(totalRecords);   
    const totalPagesResponse = await numberRepository.getAllByQuery<number>(
      `/totalPages`
    );
    const pages = !totalPagesResponse.error && totalPagesResponse.response
      ? Number(totalPagesResponse.response)
      : 1;

    setTotalPages(pages);
     console.log("totalRpages:", pages)

    // ✅ التأكد أن الصفحة الحالية ضمن الحد
    const currentPage = page >= pages ? pages - 1 : page;

    // ✅ جلب بيانات الصفوف حسب pagination
    const queryParams = new URLSearchParams({
      Page: (currentPage + 1).toString(),       // الباكيند يبدأ من 1
      RecordsNumber: pageSize.toString(),
      Language: i18n.language || "en",
    });

    const data = await repository.getAllByQuery<CategoryDto[]>(`?${queryParams}`);
    if (!data.error && data.response) {
      const categories = data.response.map((item: CategoryDto) => ({
        ...item,
        id: item.id,
        name: item.categoryTranslations?.[0]?.name || "—",
      }));
      setRows(categories);
    }
  } catch (error) {
    console.error(error);
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
      console.error(error);
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
            page={page}
            pageSize={pageSize}
            rowCount={rowCount}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
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
