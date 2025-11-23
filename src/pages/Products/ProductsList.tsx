import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DataGridCustom from "../../components/DataGridCustom";
import LoadingComponent from "../../components/LoadingComponent";
import genericRepository from "../../repositories/genericRepository";
import { ProductDTO } from "../../types/ProductDTO";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const ProductList = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]); 
  const [editId, setEditId] = useState<number | null>(null);  
  const { i18n } = useTranslation() 
  //pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const renderImageCell = (params: any) => {
    const noImage = "https://localhost:7027/images/products/no-image.png";
    const imagePath =
      params.value && params.value !== "/no-image.png"
        ? `https://localhost:7027/${params.value}`
        : noImage;

    return (
      <img
        src={imagePath}
        alt="Product"
        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
      />
    );
  };
const renderColorCell = (params: any) => {
  if (!Array.isArray(params.value)) return null; 
  return (
    <Box display="flex" gap={0.5}>
      {params.value.map((hex: string) => (
        <Box
          key={hex}
          sx={{
            width: 20,
            height: 20,
            bgcolor: hex,
            borderRadius: "50%",
            border: "1px solid #ccc",
          }}
        />
      ))}
    </Box>
  );
};

  const columns = [
    { field: "id", headerName: "Id", flex: 1 },
    { field: "name", headerName: "Name", flex: 6 },
    { field: "description", headerName: "Description", flex: 6 },
    { field: "price", headerName: "Price", flex: 3 },
    { field: "stock", headerName: "Stock", flex: 3 },
    
      {
    field: "brand",
    headerName: "Brand",
    flex: 6,
    renderCell: (params:any) => {
      const brand = params.value;
      if (!brand) return "";
      return brand;
    }
  },
   {
    field: "categories",
    headerName: "Categories",
    flex: 12,
    renderCell: (params: any) =>
      Array.isArray(params.value)
        ? params.value.map((c: any) => c.category).join(", ")
        : "",
  },
    { field: "color", headerName: "colors", flex: 6 , renderCell:renderColorCell},
    { field: "sizes", headerName: "Sizes", flex: 6 },
    { field: "image", headerName: "Image", flex: 6, renderCell: renderImageCell },
  ];

  const productRepo = genericRepository<ProductDTO[], ProductDTO>("Product"); 
  const numberRepository = genericRepository<number, number>("Product");
   

  const getProducts = async () => {  
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
       const data=await  await productRepo.getAllByQuery<ProductDTO[]>(`?${queryParams}`);;      
      if (!data.error && data.response) {
        const products = data.response.map((item: ProductDTO) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            stock: item.stock,          
            categories: item.categories?.map(c => ({
                                                        id: c.id,
                                                        category: c.category,
                                                      })) ?? [],  
           
            image: item.productImages && item.productImages.length > 0
                            ? item.productImages[0]
                            : "/no-image.png",     
            color:item.productColor ?? [],
            sizes:item.productSize ?? [],
            brand:item.brand?.brandTranslations?.[0]?.name ?? "",            
         
        }));
        setRows(products);
        console.log("product Data:", products)
      } else {
        console.error("Error fetching Products:", data.message);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const result = await productRepo.delete(id);
      if (!result.error) {      
        await getProducts();
      } else {
        console.error("Delete failed:", result.message || "Unknown error");
      }
    } catch (error: any) {
      console.error("Unexpected error during delete:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    navigate("/admin/products/create");
  };

  const handleEditClick = (id: number) => {
    navigate(`/admin/products/edit/${id}`);
  };
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        
        await getProducts();       
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [page, pageSize, totalPages, i18n.language]);

  return (
    <Box>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <DataGridCustom
            columns={columns}
            rows={rows}
            title="Products"      
            filtercolumn={["name"]}     
            onDelete={handleDelete}
            onCreateClick={() => {
                setEditId(null);
                handleCreateClick();
            }}
            onEditClick={(id) => {
                setEditId(id);
              handleEditClick(id);
            }}
            page={page}
            pageSize={pageSize}
            rowCount={rowCount}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
          />           
          
        </>
      )}
    </Box>
  );
};

export default ProductList;
