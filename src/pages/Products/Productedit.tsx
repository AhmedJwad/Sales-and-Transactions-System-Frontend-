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
import { SizeDTO } from "../../types/SizeDTO";
import { BrandDto } from "../../types/BrandDto";

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
    ProductSizeIds:[],    
    BrandId:0,
  });

  const [nonSelectedSubcategories, setNonSelectedSubcategories] = useState<SubcategoryDto[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<SubcategoryDto[]>([]);
  const [nonSelectedColors, setNonSelectedColors] = useState<ColourDTO[]>([]);
  const [selectedColors, setSelectedColors] = useState<ColourDTO[]>([]);
  const[selectSize, setSelectSize]=useState<SizeDTO[]>([]);
  const[nonselectSize, setnonselectSize]=useState<SizeDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [brand ,setBrand]=useState<BrandDto[]>([]);

  const navigate = useNavigate();
  
  const repoproductbyId = genericRepository<ProductDTO[], ProductDTO>("Product");
  const repo = genericRepository<ProductDtoRequest[], ProductDtoRequest>("Product/full");
  const subcategoryRepo = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory/combo");
  const ImageRepo = genericRepository<ProductImageUploadDTO[], ProductImageUploadDTO>("Product/addImages");
  const RemoveImageRepo = genericRepository<ProductImageUploadDTO[], ProductImageUploadDTO>("Product/removeLastImage");
  const ColorRepo = genericRepository<ColourDTO[], ColourDTO>("colours/combo");
  const Sizerepo=genericRepository<SizeDTO[], SizeDTO>("sizes/combo");
  const brandRepo=genericRepository<BrandDto[], BrandDto>("Brand/combo");

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
const fetchSizes = async () => {
    setLoading(true);
    try {
      const result = await Sizerepo.getAll();
      if (!result.error && result.response) {
      setnonselectSize(result.response);
        console.log("sizes:", result.response)
         return result.response;
      } else {
        console.error("Error fetching Colors:", result.message);
        return[];
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message || error);
       return [];
    } finally {
      setLoading(false);
    }
  };
  const fetchProductById = async (subcategories: SubcategoryDto[], colors: ColourDTO[], sizes:SizeDTO[]) => {
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
          ProductSizeIds:dto.productSize?.map((s)=> s.sizeId)||[],
          BrandId:dto.brandId,          
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
         const selectedsizes = sizes.filter((siz) =>
          transformed.ProductSizeIds?.includes(siz.id)
        );
       setSelectSize(selectedsizes);
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
const fetchBrands=async()=>{      
        try {
            const result=await brandRepo.getAll();
            if(!result.error && result.response)
            {
               setBrand(result.response)

            }
            else
            {
                console.error("Error fetching subcategories:", result.message);
            }
        } catch (error:any) {
            console.error("Unexpected error:", error.message || error);  
        }finally{
           
        }
    }
  // ===== useEffect =====
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const subcategories = await fetchSubcategories();
      const colors = await fetchColors();
      const sizes=await fetchSizes();
      await fetchProductById(subcategories, colors, sizes);
     await fetchBrands();
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
        selectedSizes={selectSize}
        nonSelectedSizes={nonselectSize}
        addImageAction={addImagesAsync}
        onValidSubmit={updateAsync}
        returnAction={handleReturn}
        removeImageAction={removeImagesAsync}      
      />

    
    </>
  );
};

export default ProductEdit;
