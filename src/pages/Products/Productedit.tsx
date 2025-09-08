import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import genericRepository from "../../repositories/genericRepository";
import { ProductDTO } from "../../types/ProductDTO";
import { ProductDtoRequest } from "../../types/ProductDtorequest";
import { SubcategoryDto } from "../../types/SubcategoryDto";
import ProductForm from "./ProductForm";
import { ProductImageUploadDTO } from "../../types/ProductImageUploadDTO";
import { ColourDTO } from "../../types/ColoutDTO";
import ImageUploaderColor from "../../components/ImageUploaderColor";
import { Box, Typography } from "@mui/material";

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
    ProductColorIds: [],
  });

  const [nonSelectedSubcategories, setNonSelectedSubcategories] = useState<SubcategoryDto[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<SubcategoryDto[]>([]);
  const [nonSelectedColors, setNonSelectedColors] = useState<ColourDTO[]>([]);
  const [selectedColors, setSelectedColors] = useState<ColourDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const repoproductbyId = genericRepository<ProductDTO[], ProductDTO>("Product");
  const repo = genericRepository<ProductDtoRequest[], ProductDtoRequest>("Product/full");
  const subcategoryRepo = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory/combo");
  const ImageRepo = genericRepository<ProductImageUploadDTO[], ProductImageUploadDTO>("Product/addImages");
  const RemoveImageRepo = genericRepository<ProductImageUploadDTO[], ProductImageUploadDTO>("Product/removeLastImage");
  const ColorRepo = genericRepository<ColourDTO[], ColourDTO>("colours/combo");

  // ===== Fetch functions =====
  const fetchSubcategories = async () => {
    try {
      const result = await subcategoryRepo.getAll();
      if (!result.error && result.response) {
        setNonSelectedSubcategories(result.response);
        return result.response;
      }
      return [];
    } catch {
      return [];
    }
  };

  const fetchColors = async () => {
    setLoading(true);
    try {
      const result = await ColorRepo.getAll();
      if (!result.error && result.response) {
        setNonSelectedColors(result.response);
        return result.response;
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (subcategories: SubcategoryDto[], colors: ColourDTO[]) => {
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
          ProductColorIds: dto.productColor?.map((c) => c.colorId) || [],
        };

        setProduct(transformed);

        const selectedSubs = subcategories.filter((sub) =>
          transformed.productCategoryIds?.includes(sub.id)
        );
        setSelectedSubcategories(selectedSubs);

        const selectedCols = colors.filter((col) =>
          transformed.ProductColorIds?.includes(col.id)
        );
        setSelectedColors(selectedCols);
      }
    } catch {}
  };

  // ===== Update Product =====
  const updateAsync = async (updatedProduct: ProductDtoRequest) => {
    const result = await repo.put({ ...updatedProduct, id: numericId });
    if (!result.error && result.response) {
      navigate("/admin/products");
    }
  };

  const handleReturn = () => {
    navigate("/admin/products");
  };

  // ===== Add Images =====
  const addImagesAsync = async (images: string[],selectedColor?: { id: number; hexCode: string }) => {
    
    const imageDTO: ProductImageUploadDTO = {
      productId: numericId,
      images: images,
      ProductColorIds: selectedColor ? [selectedColor.id] : selectedColors.map(c => c.id),
    };

    try {     
      const result = await ImageRepo.post(imageDTO);
      if (!result.error && result.response) {
        setProduct((prev) => ({
          ...prev,
          productImages: result.response?.images ?? [],
        }));
      }
    } catch {}
  };

  // ===== Remove Images =====
  const removeImagesAsync = async (images: string[]) => {
    if (!product.productImages?.length) return;

    const imageDTO: ProductImageUploadDTO = {
      productId: numericId,
      images: product.productImages ?? [],
      ProductColorIds: [...(product.ProductColorIds ?? [])],
    };

    try {      
      const result = await RemoveImageRepo.post(imageDTO);
      if (!result.error && result.response) {
        setProduct((prev) => ({
          ...prev,
          productImages: result.response?.images ?? [],
        }));
      }
    } catch {}
  };

  // ===== useEffect =====
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const subcategories = await fetchSubcategories();
      const colors = await fetchColors();
      await fetchProductById(subcategories, colors);
      setLoading(false);
    };
    init();
  }, [numericId]);

  // ===== Render =====
  return loading ? (
    <LoadingComponent />
  ) : (
    <>
      
      <ProductForm
        product={product}
        isEdit={true}
        nonSelectedSubcategories={nonSelectedSubcategories}
        selectedSubcategories={selectedSubcategories}
        selectedColors={selectedColors}
        nonSelectedColors={nonSelectedColors}
        addImageAction={addImagesAsync}
        onValidSubmit={updateAsync}
        returnAction={handleReturn}
        removeImageAction={removeImagesAsync}      
      />

    
    </>
  );
};

export default ProductEdit;
