import { useEffect, useRef, useState } from "react";
import genericRepository from "../../../repositories/genericRepository";
import { ProductDTO } from "../../../types/ProductDTO";
import { Box, Button, Card, CardContent, CardMedia, Grid, TextField, Typography, Slider, FormControlLabel, Checkbox, Chip, Paper, Divider, IconButton } from "@mui/material";
import Pagination from '@mui/material/Pagination';
import LoadingComponent from "../../../components/LoadingComponent";
import Autocomplete from '@mui/material/Autocomplete';
import { BrandDto } from "../../../types/BrandDto";
import { ColourDTO } from "../../../types/ColoutDTO";
import { SizeDTO } from "../../../types/SizeDTO";
import { useCart } from "../../../context/CartContext";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../../context/CurrencyContext";
import { PriceRangeDTO } from "../../../types/PriceRangeDTO";
import { useParams } from "react-router-dom";
import { SubcategoryDto } from "../../../types/SubcategoryDto";
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';

const PublicProductList = () => {   
    const { type, value } = useParams<{ type: string; value: string }>();
    const numericValue = Number(value);
    const isCategory = type === "category";
    const isDiscount = type === "discount";
    const numericCategoryId = isCategory ? numericValue : null;
    const numericDiscountId = isDiscount ? numericValue : null;

    const { currency } = useCurrency();
    const { i18n } = useTranslation();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);  
    const productRepo = genericRepository<ProductDTO[], ProductDTO>(`Product`); 
    const PriceRangeRepo = genericRepository<PriceRangeDTO[],PriceRangeDTO>(`Product`); 
    const numberRepository = genericRepository<number, number>("Product");    
    const [searchText, setSearchText] = useState("");
    const [brands, setBrands] = useState<BrandDto[]>([]);
    const [colors, setColors] = useState<ColourDTO[]>([]);
    const [sizes, setSizes] = useState<SizeDTO[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
    const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 0]);
    const [showAllBrands, setShowAllBrands] = useState(false);
    const [showAllColors, setShowAllColors] = useState(false);
    const [showAllSizes, setShowAllSizes] = useState(false);
    const [isCategoryReady, setIsCategoryReady] = useState(false);   
    const isInitialPageSet = useRef(false);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);   
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(1);
    const [totalPages, setTotalPages] = useState(0); 
    const [subcategory, setSubcategoies]=useState<SubcategoryDto[]>([]);     
    var subcategoryrepo=genericRepository<SubcategoryDto[], SubcategoryDto>(`Subcategory/combocategory/${numericCategoryId}?lang=${i18n.language || "en"}`);
    
    const fetchsubcategories = async () => {  
        setLoading(true);
        try {
            const result = await subcategoryrepo.getAll();
            if (!result.error && result.response) {
                setSubcategoies(result.response);   
                console.log("subcategories:", subcategory)    
            } else {
                console.error("Error fetching Subcategories:", result.message);
            }
        } catch (error: any) {
            console.error("Unexpected error:", error.message || error);
        } finally {
            setLoading(false);
        }
    };  

    const fetchFiltersData = async () => {
        try {
            const brandsRes = await genericRepository<BrandDto[], BrandDto>(`Brand/combo?lang=${i18n.language || "en"}`).getAll();
            const colorsRes = await genericRepository<ColourDTO[], ColourDTO>("colours/combo").getAll();
            const sizesRes = await genericRepository<SizeDTO[], SizeDTO>("sizes/combo").getAll();

            if (brandsRes.response) setBrands(brandsRes.response);
            if (colorsRes.response) setColors(colorsRes.response);
            if (sizesRes.response) setSizes(sizesRes.response);
        } catch (error) {
            console.error("Error fetching filter data:", error);
        }
    };

    const formatPrice=(amount:number, currency:string)=>{
        if(!amount) {
            return "";
        }
        if(currency==="IQ") {
            return `${Math.round(amount).toLocaleString("en-US")} IQ`
        }  
        else if(currency==="USD") {
            return `${amount.toFixed(2)} $`
        }
        else {
            return amount.toString();
        }
    }   

    const fetchProducts = async () => {  
        setLoading(true);
        try {
            const recordsResponse = await numberRepository.getAllByQuery<number>(`/recordsNumber`);
            const totalRecords = !recordsResponse.error && recordsResponse.response
                ? Number(recordsResponse.response)
                : 10;     
            setRowCount(totalRecords);   
            console.log("totalRecords:", totalRecords)
            
            const totalPagesResponse = await numberRepository.getAllByQuery<number>(`/totalPages`);
            const pages = !totalPagesResponse.error && totalPagesResponse.response
                ? Number(totalPagesResponse.response)
                : 1;           
            setTotalPages(pages); 
            console.log("totalpages:", totalPages)                            
            
            const queryParams = new URLSearchParams({
                Page: page.toString(),      
                RecordsNumber: pageSize.toString(),
                Language: i18n.language || "en",
                CurrencyCode: currency,
            });   
            
            if (searchText && searchText.trim() !== "") {
                queryParams.append("Filter", searchText);
            }
            if (isCategory && selectedSubcategoryId.length > 0) {
                selectedSubcategoryId.forEach(id =>
                    queryParams.append("CategoryId", id.toString())
                );
            }
            if (numericDiscountId !== null) {                              
                queryParams.append("DiscountIds", numericDiscountId.toString());
            }
            if (selectedBrandId !== null) {
                queryParams.append("BrandId", selectedBrandId.toString());
            }
            if (selectedColorIds.length > 0) {
                selectedColorIds.forEach(colorId => {
                    queryParams.append("ColorIds", colorId.toString());
                });
            }
            if (selectedSizeIds.length > 0) {
                selectedSizeIds.forEach(sizeId => {
                    queryParams.append("SizeIds", sizeId.toString());
                });
            }
            
            const minPriceValue = Math.floor(priceRange[0]);
            const maxPriceValue = Math.floor(priceRange[1]);                               
            if (minPriceValue >= 0 && minPriceValue <= 999999999999) {
                queryParams.append("MinPrice", minPriceValue.toString());                                        
            }
            if (maxPriceValue >= 0 && maxPriceValue <= 999999999999) {
                queryParams.append("MaxPrice", maxPriceValue.toString());                                        
            } else if (maxPriceValue > 999999999999) {                                    
                queryParams.append("MaxPrice", "999999999999");                                       
            }

            const data = await productRepo.getAllByQuery<ProductDTO[]>(`?${queryParams.toString()}`);      
            if (!data.error && data.response) {               
                const products = data.response.map((item: ProductDTO) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price:item.price,
                    oldPrice: item.oldPrice,
                    discountPercent: item.discountPercent || 0,
                    stock: item.stock,          
                    categories: item.categories?.map(c => ({
                        id: c.id,
                        category: c.category,
                    })) ?? [],  
                    image: item.productImages && item.productImages.length > 0
                        ? item.productImages[0]
                        : "/no-image.png",     
                    colors:item.colors?.map(c=>c.hexCode) ?? [],
                    sizes:item.sizes?.map(s=>s.name) ??[],
                    brand:item.brand?.brandTranslations?.[0]?.name ?? "",            
                }));
                setProducts(products);
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
          
    useEffect(() => {           
        fetchFiltersData();
    }, []); 

    useEffect(() => {     
        if (!isInitialPageSet.current) {
            isInitialPageSet.current = true;
            return;
        }     
        setPage(1);             
    }, [searchText, selectedBrandId, selectedColorIds, selectedSizeIds, priceRange,selectedSubcategoryId]);

    useEffect(() => {
        if (!isCategoryReady) {
            return;
        }
        if (isDiscount && (numericDiscountId === null || isNaN(numericDiscountId))) {
            return;
        }
        // Scroll to top when filters change or page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchProducts();        
    }, [page, pageSize, i18n.language, currency, searchText, selectedBrandId, 
        selectedColorIds, selectedSizeIds, priceRange,selectedSubcategoryId,numericDiscountId,
        isDiscount,numericCategoryId, isCategory]);

    useEffect(() => {
        const fetchInitialPrices = async () => {
            try {
                const data = await PriceRangeRepo.getAllByQuery<PriceRangeDTO[]>(`/price-range`);
                if (data.response && data.response.length > 0) {
                    const first = data.response[0];
                    setMinPrice(first.minPrice);
                    setMaxPrice(first.maxPrice);
                    setPriceRange([first.minPrice, first.maxPrice]);
                    console.log("min price:", first.minPrice)
                }
            } catch (error) {
                console.error("Error fetching price range:", error);
            }
        };
        fetchInitialPrices();
    }, []);

    useEffect(() => {
        if (!isCategory || numericCategoryId === null || isNaN(numericCategoryId)) {
            setSubcategoies([]);
            setSelectedSubcategoryId([]);
            setIsCategoryReady(true);
            return;
        }

        setIsCategoryReady(false);

        const subcategoryRepo = genericRepository<SubcategoryDto[], SubcategoryDto>(
            `Subcategory/combocategory/${numericCategoryId}?lang=${i18n.language || "en"}`
        );

        const fetchSubcategories = async () => {
            setLoading(true);
            try {
                const result = await subcategoryRepo.getAll();
                if (!result.error && result.response) {
                    setSubcategoies(result.response);
                    const allIds = result.response.map(sub => sub.id);
                    setSelectedSubcategoryId(allIds);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setIsCategoryReady(true);
            }
        };
        fetchSubcategories();
    }, [numericCategoryId, isCategory, i18n.language]);

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 3 }}>
            {loading ? <LoadingComponent /> : (
                <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
                    {/* Search Bar */}
                    <Box sx={{ mb: 3 ,mt:4}}>
                        <Autocomplete
                            freeSolo
                            options={products.map((p) => p.name)}
                            inputValue={searchText}
                            onInputChange={(event, newInputValue) => { setSearchText(newInputValue) }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search for products..."
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <SearchIcon sx={{ color: '#6c757d', mr: 1, ml: 0.5 }} />
                                        ),
                                    }}
                                    sx={{
                                        bgcolor: 'white',
                                        '& .MuiOutlinedInput-root': {
                                            height: 44,
                                            fontSize: '14px',
                                            borderRadius: '4px',
                                            '&:hover fieldset': {
                                                borderColor: '#007bff',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#007bff',
                                                borderWidth: 1
                                            }
                                        }
                                    }}
                                />
                            )}
                        />
                    </Box>

                    {/* Top Bar with Sort and View Options */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 3,
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            Products
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '13px' }}>
                                    Sort by:
                                </Typography>
                                <TextField
                                    select
                                    size="small"
                                    defaultValue="relevance"
                                    SelectProps={{ native: true }}
                                    sx={{ 
                                        minWidth: 140,
                                        '& .MuiOutlinedInput-root': {
                                            fontSize: '13px',
                                            bgcolor: 'white'
                                        }
                                    }}
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest</option>
                                </TextField>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '13px' }}>
                                    View:
                                </Typography>
                                <IconButton size="small" sx={{ bgcolor: '#e9ecef', '&:hover': { bgcolor: '#dee2e6' } }}>
                                    <GridViewIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small">
                                    <ViewListIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3 }}>
                        {/* Sidebar Filters */}
                        <Box sx={{ 
                            width: 240,
                            flexShrink: 0,
                            display: { xs: 'none', md: 'block' }
                        }}>
                            {/* Categories */}
                            {subcategory.length > 0 && (
                                <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', boxShadow: 'none', border: '1px solid #e9ecef' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#2c3e50' }}>
                                        Categories
                                    </Typography>
                                    {subcategory.map((sub) => (
                                        <FormControlLabel
                                            key={sub.id}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    checked={selectedSubcategoryId.includes(sub.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedSubcategoryId([...selectedSubcategoryId, sub.id]);
                                                        } else {
                                                            setSelectedSubcategoryId(selectedSubcategoryId.filter(id => id !== sub.id));
                                                        }
                                                    }}
                                                    sx={{ 
                                                        py: 0.5,
                                                        '&.Mui-checked': { color: '#007bff' }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography sx={{ fontSize: '13px', color: '#495057' }}>
                                                    {sub.subcategoryTranslations?.[0]?.name}
                                                </Typography>
                                            }
                                            sx={{ mb: 0.5, ml: 0, display: 'flex', alignItems: 'center' }}
                                        />
                                    ))}
                                </Paper>
                            )}

                            {/* Price Range */}
                            <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', boxShadow: 'none', border: '1px solid #e9ecef' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                                    Price Range
                                </Typography>
                                <Box sx={{ px: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <TextField
                                            size="small"
                                            value={Math.floor(priceRange[1])}
                                            InputProps={{
                                                readOnly: true,
                                                sx: { fontSize: '12px' }
                                            }}
                                            sx={{ width: '45%' }}
                                        />
                                        <Typography sx={{ alignSelf: 'center', color: '#6c757d' }}>-</Typography>
                                        <TextField
                                            size="small"
                                            value={Math.floor(priceRange[0])}
                                            InputProps={{
                                                readOnly: true,
                                                sx: { fontSize: '12px' }
                                            }}
                                            sx={{ width: '45%' }}
                                        />
                                    </Box>
                                    <Slider
                                        value={priceRange}
                                        onChange={(e, newValue) => setPriceRange(newValue as number[])}
                                        valueLabelDisplay="auto"
                                        max={maxPrice}
                                        min={minPrice}
                                        valueLabelFormat={(value) => `${Math.round(value).toLocaleString()} IQ`}
                                        sx={{
                                            color: '#007bff',
                                            '& .MuiSlider-thumb': {
                                                width: 16,
                                                height: 16
                                            }
                                        }}
                                    />
                                </Box>
                            </Paper>

                            {/* Brands */}
                            <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', boxShadow: 'none', border: '1px solid #e9ecef' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#2c3e50' }}>
                                    Brands
                                </Typography>
                                {brands.slice(0, showAllBrands ? brands.length : 5).map((b) => (
                                    <FormControlLabel
                                        key={b.id}
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={selectedBrandId === b.id}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedBrandId(b.id);
                                                    } else {
                                                        setSelectedBrandId(null);
                                                    }
                                                }}
                                                sx={{ 
                                                    py: 0.5,
                                                    '&.Mui-checked': { color: '#007bff' }
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography sx={{ fontSize: '13px', color: '#495057' }}>
                                                {b.brandTranslations?.[0]?.name}
                                            </Typography>
                                        }
                                        sx={{ mb: 0.5, ml: 0 }}
                                    />
                                ))}
                                {brands.length > 5 && (
                                    <Button
                                        size="small"
                                        onClick={() => setShowAllBrands(!showAllBrands)}
                                        sx={{
                                            textTransform: 'none',
                                            fontSize: '12px',
                                            color: '#007bff',
                                            p: 0,
                                            minWidth: 'auto',
                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                        }}
                                    >
                                        {showAllBrands ? 'Show Less' : 'Show More'}
                                    </Button>
                                )}
                            </Paper>

                            {/* Colors */}
                            <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', boxShadow: 'none', border: '1px solid #e9ecef' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#2c3e50' }}>
                                    Colors
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {colors.slice(0, showAllColors ? colors.length : 6).map((c) => (
                                        <Box
                                            key={c.id}
                                            onClick={() => {
                                                if (selectedColorIds.includes(c.id)) {
                                                    setSelectedColorIds(selectedColorIds.filter((id) => id !== c.id));
                                                } else {
                                                    setSelectedColorIds([...selectedColorIds, c.id]);
                                                }
                                            }}
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                backgroundColor: c.hexCode,
                                                border: selectedColorIds.includes(c.id) ? '3px solid #007bff' : '2px solid #dee2e6',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                                {colors.length > 6 && (
                                    <Button
                                        size="small"
                                        onClick={() => setShowAllColors(!showAllColors)}
                                        sx={{
                                            textTransform: 'none',
                                            fontSize: '12px',
                                            color: '#007bff',
                                            p: 0,
                                            mt: 1,
                                            minWidth: 'auto',
                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                        }}
                                    >
                                        {showAllColors ? 'Show Less' : 'Show More'}
                                    </Button>
                                )}
                            </Paper>

                            {/* Sizes */}
                            <Paper sx={{ p: 2, mb: 2, bgcolor: 'white', boxShadow: 'none', border: '1px solid #e9ecef' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#2c3e50' }}>
                                    Sizes
                                </Typography>
                                {sizes.slice(0, showAllSizes ? sizes.length : 5).map((s) => (
                                    <FormControlLabel
                                        key={s.id}
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={selectedSizeIds.includes(s.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedSizeIds([...selectedSizeIds, s.id]);
                                                    else setSelectedSizeIds(selectedSizeIds.filter((id) => id !== s.id));
                                                }}
                                                sx={{ 
                                                    py: 0.5,
                                                    '&.Mui-checked': { color: '#007bff' }
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography sx={{ fontSize: '13px', color: '#495057' }}>
                                                {s.name}
                                            </Typography>
                                        }
                                        sx={{ mb: 0.5, ml: 0 }}
                                    />
                                ))}
                                {sizes.length > 5 && (
                                    <Button
                                        size="small"
                                        onClick={() => setShowAllSizes(!showAllSizes)}
                                        sx={{
                                            textTransform: 'none',
                                            fontSize: '12px',
                                            color: '#007bff',
                                            p: 0,
                                            minWidth: 'auto',
                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                        }}
                                    >
                                        {showAllSizes ? 'Show Less' : 'Show More'}
                                    </Button>
                                )}
                            </Paper>

                            {/* Clear Filters Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    bgcolor: '#dc3545',
                                    color: 'white',
                                    textTransform: 'none',
                                    py: 1,
                                    '&:hover': { bgcolor: '#c82333' }
                                }}
                                onClick={() => {
                                    setSelectedBrandId(null);
                                    setSelectedColorIds([]);
                                    setSelectedSizeIds([]);
                                    setPriceRange([minPrice, maxPrice]);
                                    setSearchText("");
                                }}
                            >
                                Clear All Filters
                            </Button>
                        </Box>

                        {/* Products Grid */}
                        <Box sx={{ flex: 1 }}>
                            <Grid container spacing={2.5}>
                                {products.map((prod) => (
                                    <Grid size={{xs:12, sm:6, md:4}} key={prod.id}>
                                        <Card 
                                            sx={{ 
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                bgcolor: 'white',
                                                boxShadow: 'none',
                                                border: '1px solid #e9ecef',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ position: 'relative', bgcolor: '#f8f9fa', p: 2 }}>
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={`https://localhost:7027/${prod.image}`}
                                                    alt={prod.name}
                                                    sx={{
                                                        objectFit: 'contain',
                                                        mixBlendMode: 'multiply'
                                                    }}
                                                />
                                                {prod.discountPercent > 0 && (
                                                    <Chip
                                                        label={`-${prod.discountPercent}%`}
                                                        size="small"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            right: 12,
                                                            bgcolor: '#dc3545',
                                                            color: 'white',
                                                            fontWeight: 600,
                                                            fontSize: '11px',
                                                            height: 24
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 500,
                                                        mb: 1,
                                                        color: '#2c3e50',
                                                        fontSize: '14px',
                                                        lineHeight: 1.4,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        minHeight: '40px'
                                                    }}
                                                >
                                                    {prod.name}
                                                </Typography>

                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 0.5, 
                                                    mb: 1.5
                                                }}>
                                                    <Box sx={{ display: 'flex', gap: 0.3 }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Typography key={i} sx={{ color: i < 3 ? '#ffc107' : '#e4e5e9', fontSize: '14px' }}>
                                                                ★
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                </Box>

                                                <Box sx={{ mb: 2 }}>
                                                    {prod.discountPercent > 0 && prod.oldPrice && (
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: '#6c757d',
                                                                textDecoration: 'line-through',
                                                                fontSize: '12px',
                                                                display: 'block',
                                                                mb: 0.5
                                                            }}
                                                        >
                                                            {formatPrice(prod.oldPrice, currency)}                                               
                                                        </Typography>
                                                    )}
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: '#2c3e50',
                                                            fontSize: '18px'
                                                        }}
                                                    >
                                                        {formatPrice(prod.price, currency)}                                                
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center',
                                                    mt: 'auto'
                                                }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            addToCart({
                                                                ProductId: prod.id,
                                                                Name: prod.name,
                                                                Description: prod.description,
                                                                Image: `https://localhost:7027/${prod.image}`,
                                                                Price: prod.price,
                                                                Quantity: 1,
                                                            })
                                                        }
                                                        sx={{
                                                            bgcolor: 'white',
                                                            border: '1px solid #dee2e6',
                                                            width: 36,
                                                            height: 36,
                                                            '&:hover': {
                                                                bgcolor: '#f8f9fa',
                                                                borderColor: '#007bff'
                                                            }
                                                        }}
                                                    >
                                                        <AddIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Pagination */}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center',
                                alignItems: 'center',
                                mt: 4,
                                gap: 2
                            }}>
                                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '13px' }}>
                                    Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, rowCount)} of {rowCount} Products
                                </Typography>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(e, value) => setPage(value)}
                                    variant="outlined"
                                    shape="rounded"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            border: '1px solid #dee2e6',
                                            '&.Mui-selected': {
                                                bgcolor: '#007bff',
                                                color: 'white',
                                                borderColor: '#007bff',
                                                '&:hover': {
                                                    bgcolor: '#0056b3'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default PublicProductList;