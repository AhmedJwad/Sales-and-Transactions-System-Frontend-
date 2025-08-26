
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import genericRepository from "../../repositories/genericRepository";
import { ProductDTO } from "../../types/ProductDTO";
import { ProductDtoRequest } from "../../types/ProductDtorequest";
import { SubcategoryDto } from "../../types/SubcategoryDto";
import ProductForm from "./ProductForm";
import { ProductImageUploadDTO } from "../../types/ProductImageUploadDTO";

const ProductEdit: FC = () => {
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
    productImages: [],
    serialNumbers: [],
  });

  const [nonSelectedSubcategories, setNonSelectedSubcategories] = useState<SubcategoryDto[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<SubcategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  
  const repoproductbyId = genericRepository<ProductDTO[], ProductDTO>("Product");  
  const repo = genericRepository<ProductDtoRequest[], ProductDtoRequest>("Product/full");
  const subcategoryRepo = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory/combo");
  const ImageRepo = genericRepository<ProductImageUploadDTO[], ProductImageUploadDTO>("Product/addImages"); 
  const RemoveImageRepo = genericRepository<ProductImageUploadDTO[], ProductImageUploadDTO>("Product/removeLastImage");

  const fetchSubcategories = async () => {
    try {
      const result = await subcategoryRepo.getAll();
      if (!result.error && result.response) {
        setNonSelectedSubcategories(result.response);
        return result.response;
      } else {
        console.error("Error fetching Subcategories:", result.message);
        return [];
      }
    } catch (error: any) {
      console.error("Unexpected error fetching subcategories:", error.message || error);
      return [];
    }
  };

  const fetchProductById = async (subcategories: SubcategoryDto[]) => {
    if (!numericId) return;
    try {
      const result = await repoproductbyId.getOne(numericId);
      if (!result.error && result.response) {
        const dto: ProductDTO = result.response;       
        const transformed: ProductDtoRequest = {
          id: dto.id,
          name: dto.name,
          barcode: dto.barcode,
          description: dto.description,
          price: dto.price,
          cost: dto.cost,
          desiredProfit: dto.desiredProfit,
          stock: dto.stock,
          brandId: dto.brandId,
          hasSerial: dto.hasSerial,
          productCategoryIds: dto.productsubCategories?.map((sc) => sc.subcategoryId) || [],
          productImages: dto.productImages?.map((img) => img.image) || [],
          serialNumbers: dto.serialNumbers?.map((s) => s.serialNumberValue) || [],
        };

        setProduct(transformed);      

        const selectedSubs = subcategories.filter((sub) =>
          transformed.productCategoryIds?.includes(sub.id)
        );
        setSelectedSubcategories(selectedSubs);
      } else {
        console.error("Error fetching product by ID:", result.message);
      }
    } catch (error: any) {
      console.error("Unexpected error fetching product:", error.message || error);
    }
  };

  const updateAsync = async (updatedProduct: ProductDtoRequest) => {
    const result = await repo.put({ ...updatedProduct, id: numericId });
    if (!result.error && result.response) {
      navigate("/admin/products");
    } else {
      console.error("Error updating product:", result.message);
    }
  };

  const handleReturn = () => {
    navigate("/admin/products");
  };
  const addImagesAsync = async (images: string[]) => {
    const imageDTO: ProductImageUploadDTO = {
      productId: numericId,
      images: images,
    };
  
    try {
      const result = await ImageRepo.post(imageDTO);
      if (!result.error && result.response) {
        setProduct((prev) => ({
          ...prev,
          productImages: result.response?.images ?? [],
        }));
        console.log("✅ Images updated successfully", result.response?.images);
      } else {
        console.error("Error posting product images:", result.message);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message || error);
    }
  };
  const removeImagesAsync=async(images:string[])=>{
    if(product.productImages?.length==0)
    {
      return;
    }
    const imageDTO: ProductImageUploadDTO = {
      productId: numericId,
      images: product.productImages??[],
    };
    try {
      const result = await RemoveImageRepo.post(imageDTO);
      if (!result.error && result.response) {
        setProduct((prev) => ({
          ...prev,
          productImages: result.response?.images ?? [],
        }));
        console.log("✅ Images updated successfully", result.response?.images);
      } else {
        console.error("Error posting product images:", result.message);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message || error);
    }
  }
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const subcategories = await fetchSubcategories();
      await fetchProductById(subcategories);
      setLoading(false);
    };

    init();
  }, [numericId]);

  return loading ? (
    <LoadingComponent />
  ) : (  
        <ProductForm
        product={product}
        isEdit={true}
        nonSelectedSubcategories={nonSelectedSubcategories}
        selectedSubcategories={selectedSubcategories}
        onValidSubmit={updateAsync}
        returnAction={handleReturn}
        addImageAction={addImagesAsync}
        removeImageAction={removeImagesAsync}        
      />   
  );
};

export default ProductEdit;
