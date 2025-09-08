import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DataGridCustom from "../../components/DataGridCustom";
import LoadingComponent from "../../components/LoadingComponent";
import genericRepository from "../../repositories/genericRepository";
import { ProductDTO } from "../../types/ProductDTO";
import { CategoryDto } from "../../types/CategoryDto";
import { SubcategoryDto } from "../../types/SubcategoryDto";
import { useNavigate } from "react-router-dom";
import { ColourDTO } from "../../types/ColoutDTO";


const ProductList = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [subcategoriesList, setSubcategoriesList] = useState<SubcategoryDto[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryDto[]>([]); 
  const [colorList, setColorList] = useState<ColourDTO[]>([]); 
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
    //{ field: "brand", headerName: "Brand", flex: 6 },
    { field: "categories", headerName: "Categories", flex: 6 },
    { field: "subcategories", headerName: "Subcategories", flex: 6 },
    { field: "color", headerName: "colors", flex: 6 , renderCell:renderColorCell},
    { field: "image", headerName: "Image", flex: 6, renderCell: renderImageCell },
  ];

  const productRepo = genericRepository<ProductDTO[], ProductDTO>("Product");
  const categoryRepo = genericRepository<CategoryDto[], CategoryDto>("Categories");
  const subcategoryRepo = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory");
   const Colrepository=genericRepository<ColourDTO[], ColourDTO>("colours");

  const getProducts = async (
    categories: CategoryDto[],
    subcategories: SubcategoryDto[],  
    color:ColourDTO[],        
  ) => {
    setLoading(true);
    try {
      const data = await productRepo.getAll();
      if (!data.error && data.response) {
        const products = data.response.map((item: ProductDTO) => {
          const subcategoryNames = item.productsubCategories
            .map((p) => subcategories.find((s) => s.id === p.subcategoryId)?.name)
            .filter(Boolean)
            .join(", ");

          const categoryNames = item.productsubCategories
            .map((p) => {
              const sub = subcategories.find((s) => s.id === p.subcategoryId);
              return sub ? categories.find((c) => c.id === sub.categoryId)?.name : null;
            })
            .filter(Boolean)
            .filter((value, index, self) => self.indexOf(value) === index)
            .join(", ");

         //const brandName = item.brand && !Array.isArray(item.brand) ? item.brand.name : "N/A";
         const brandName = item.productsubCategories
                            .map((psc) => {
                              const sub = subcategories.find((s) => s.id === psc.subcategoryId);                             
                              return sub?.brands?.[0]?.name ?? null;
                            })
                            .filter(Boolean)
                            .filter((value, index, self) => self.indexOf(value) === index)
                            .join(", ");
                        console.log(brandName);
          const imagePath =
            item.productImages && item.productImages.length > 0
              ? item.productImages[0].image
              : "/no-image.png";
              console.log("show products image", imagePath);
              const colorElements = item.productColor
                                    .map((p) => color.find((c) => c.id === p.colorId)?.hexCode)
                                    .filter(Boolean);
                                    
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            stock: item.stock,
            brand: brandName,
            subcategories: subcategoryNames,
            categories: categoryNames,
            image: imagePath,
            color:colorElements,
          };
        });

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
      if (result.error) {
        const [cats, subs, cols] = [categoriesList, subcategoriesList, colorList];
        await getProducts(cats, subs, cols);
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
        const [catRes, subRes , colRes] = await Promise.all([
          categoryRepo.getAll(),
          subcategoryRepo.getAll(),
          Colrepository.getAll(),
        ]);

        const cats = catRes.response || [];
        const subs = subRes.response || [];
        const cols=colRes.response || [];
        console.log("colors:", cols)
        setCategoriesList(cats);
        setSubcategoriesList(subs);
        setColorList(cols);

        await getProducts(cats, subs,cols,);
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
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
          />           
          
        </>
      )}
    </Box>
  );
};

export default ProductList;
