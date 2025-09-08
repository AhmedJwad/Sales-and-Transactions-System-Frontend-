import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import genericRepository from "../../repositories/genericRepository";
import { ProductDtoRequest } from "../../types/ProductDtorequest";
import { SubcategoryDto } from "../../types/SubcategoryDto";
import ProductForm from "./ProductForm";
import { ColourDTO } from "../../types/ColoutDTO";

const ProductCreate: FC = () => {
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : 0;

  const [product, setProduct] = useState<ProductDtoRequest>({
    id: 0,
    name: "",
    description: "",
    barcode: "5E5C2D9C45D0",
    price: 0,
    cost: 0,
    desiredProfit: 0,
    stock: 0,
    brandId: 1,
    hasSerial: false,
    productCategoryIds: [],
    ProductColorIds:[],
    productImages: [],
    serialNumbers: [],
  });

  const [nonSelectedSubcategories, setNonSelectedSubcategories] = useState<SubcategoryDto[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<SubcategoryDto[]>([]);
  const [nonSelectedColors, setNonSelectedColors] = useState<ColourDTO[]>([]);
  const [selectedSubColors, setSelectedColors] = useState<ColourDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const repo = genericRepository<ProductDtoRequest[], ProductDtoRequest>("Product/full");
  const subcategoryRepo = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory/combo");
  const ColorRepo = genericRepository<ColourDTO[], ColourDTO>("colours/combo");

  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const result = await subcategoryRepo.getAll();
      if (!result.error && result.response) {
        setNonSelectedSubcategories(result.response);
      } else {
        console.error("Error fetching Subcategories:", result.message);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message || error);
    } finally {
      setLoading(false);
    }
  };
  const fetchColors = async () => {
    setLoading(true);
    try {
      const result = await ColorRepo.getAll();
      if (!result.error && result.response) {
        setNonSelectedColors(result.response);
        console.log("colors:", result.response)
      } else {
        console.error("Error fetching Colors:", result.message);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductbyId = async () => {
    if (!numericId) return;
    setLoading(true);
    try {
      const result = await repo.getOne(numericId);
      if (!result.error && result.response) {
        const productData = result.response;
        setProduct(productData);

        const selectedSubs = nonSelectedSubcategories.filter(sub =>
          productData.productCategoryIds?.includes(sub.id));
        const selectedcolr = nonSelectedColors.filter(col =>
          productData.ProductColorIds?.includes(col.id)
        );
        setSelectedSubcategories(selectedSubs);
        setSelectedColors(selectedcolr);
      } else {
        console.error("Error fetching product by ID:", result.message);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateAsync = async (updatedProduct: ProductDtoRequest) => {    
    const result = numericId > 0
      ? await repo.put({ ...updatedProduct, id: numericId })
      : await repo.post(updatedProduct);  
    console.log("Product after post", updatedProduct);  
    if (!result.error) {
      navigate("/admin/products");
    } else {
      console.error("Error submitting product:", result.message);
    }  
  };
  

  const handleReturn = () => {
    navigate("/admin/products");
  };
useEffect(() => {
  const fetchData = async () => {
    await fetchSubcategories();
    await fetchColors();
    if (numericId > 0) {
      await fetchProductbyId();
    }
  };
  fetchData();
}, [numericId]);
  

  return loading ? (
    <LoadingComponent />
  ) : (
    <ProductForm
      product={product}
      isEdit={false}
      nonSelectedSubcategories={nonSelectedSubcategories}
      selectedSubcategories={selectedSubcategories}
      selectedColors={selectedSubColors}
      nonSelectedColors={nonSelectedColors}
      onValidSubmit={createOrUpdateAsync}
      returnAction={handleReturn}
    />
  );
};

export default ProductCreate;