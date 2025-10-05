import { useEffect, useState } from "react";
import genericRepository from "../../../repositories/genericRepository";
import { ProductDTO } from "../../../types/ProductDTO";
import { Box, Button, Card, CardContent, CardMedia, Grid, TextField, Typography, Slider, FormControlLabel, Checkbox, Collapse } from "@mui/material";
import Pagination from '@mui/material/Pagination';
import LoadingComponent from "../../../components/LoadingComponent";
import Autocomplete from '@mui/material/Autocomplete';
import { BrandDto } from "../../../types/BrandDto";
import { ColourDTO } from "../../../types/ColoutDTO";
import { SizeDTO } from "../../../types/SizeDTO";
import { ProductFilterDto } from "../../../types/ProductFilterDto";
import { useCart } from "../../../context/CartContext";

const PublicProductList = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState<ProductDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const ProductRepo = genericRepository<ProductDTO[], ProductDTO>(`Product/Getfullproduct`);
    const ProductFilterRepo = genericRepository<ProductDTO[], ProductDTO>("product/productfilter");

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchText, setSearchText] = useState("");

    const [brands, setBrands] = useState<BrandDto[]>([]);
    const [colors, setColors] = useState<ColourDTO[]>([]);
    const [sizes, setSizes] = useState<SizeDTO[]>([]);

    const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
    const [selectedColors, setSelectedColors] = useState<number[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

    const [showAllBrands, setShowAllBrands] = useState(false);
    const [showAllColors, setShowAllColors] = useState(false);
    const [showAllSizes, setShowAllSizes] = useState(false);

    const filteredProducts = products.filter((prod) =>
        prod.name.toLowerCase().includes(searchText.toLowerCase())
    );
    const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => setPage(value);

    const fetchFiltersData = async () => {
        try {
            const brandsRes = await genericRepository<BrandDto[], BrandDto>("Brand/combo").getAll();
            const colorsRes = await genericRepository<ColourDTO[], ColourDTO>("colours/combo").getAll();
            const sizesRes = await genericRepository<SizeDTO[], SizeDTO>("sizes/combo").getAll();

            if (brandsRes.response) setBrands(brandsRes.response);
            if (colorsRes.response) setColors(colorsRes.response);
            if (sizesRes.response) setSizes(sizesRes.response);
        } catch (error) {
            console.error("Error fetching filter data:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const result = await ProductRepo.getAll();
            if (!result.error && result.response) setProducts(result.response);
        } catch (error) {
            console.error("Network error:", error);
            setErrorMessage("Network error while loading Products.");
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredProducts = async (filter: ProductFilterDto) => {
        try {
            setLoading(true);
            const result = await ProductFilterRepo.post(filter);
            if (!result.error && result.response) {
                setProducts(Array.isArray(result.response) ? result.response : [result.response]);
            } else {
                setErrorMessage("No products found with the given filters");
                setProducts([]);
            }
        } catch (error) {
            setErrorMessage("Network error while loading filtered products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchFiltersData();
    }, []);
      
    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {loading ? <LoadingComponent /> : (
                <>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                        Products
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Autocomplete
                            freeSolo
                            options={products.map((p) => p.name)}
                            inputValue={searchText}
                            onInputChange={(event, newInputValue) => { setSearchText(newInputValue); setPage(1); }}
                            sx={{ width: 700 }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Products"
                                    variant="outlined"
                                    sx={{
                                        width: '100%',
                                        height: 50,
                                        '& .MuiInputBase-root': { height: '100%', fontSize: '18px' },
                                        '& .MuiInputLabel-root': { fontSize: '20px' }
                                    }}
                                />
                            )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3 }}>
                        {/* Filters Sidebar */}
                        <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h6">Brands</Typography>
                            {brands.slice(0, showAllBrands ? brands.length : 4).map((b) => (
                                <FormControlLabel
                                    key={b.id}
                                    control={
                                        <Checkbox
                                            checked={selectedBrands.includes(b.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedBrands([...selectedBrands, b.id]);
                                                else setSelectedBrands(selectedBrands.filter((id) => id !== b.id));
                                            }}
                                        />
                                    }
                                    label={b.name}
                                />
                            ))}
                            {brands.length > 4 && (
                                <Button size="small" onClick={() => setShowAllBrands(!showAllBrands)}>
                                    {showAllBrands ? "Show Less" : `More (${brands.length - 4})`}
                                </Button>
                            )}

                           <Typography variant="h6">Colors</Typography>
                                {colors.slice(0, showAllColors ? colors.length : 4).map((c) => (
                                    <FormControlLabel
                                        key={c.id}
                                        control={
                                            <Checkbox
                                                checked={selectedColors.includes(c.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedColors([...selectedColors, c.id]);
                                                    else setSelectedColors(selectedColors.filter((id) => id !== c.id));
                                                }}
                                                sx={{
                                                    color: c.hexCode,
                                                    '&.Mui-checked': { color: c.hexCode }
                                                }}
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 20, height: 20, backgroundColor: c.hexCode, border: '1px solid #ccc', borderRadius: '4px' }} />
                                             
                                            </Box>
                                        }
                                    />
                                ))}
                                {colors.length > 4 && (
                                    <Button size="small" onClick={() => setShowAllColors(!showAllColors)}>
                                        {showAllColors ? "Show Less" : `More (${colors.length - 4})`}
                                    </Button>
                                )}

                            <Typography variant="h6">Sizes</Typography>
                            {sizes.slice(0, showAllSizes ? sizes.length : 4).map((s) => (
                                <FormControlLabel
                                    key={s.id}
                                    control={
                                        <Checkbox
                                            checked={selectedSizes.includes(s.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedSizes([...selectedSizes, s.id]);
                                                else setSelectedSizes(selectedSizes.filter((id) => id !== s.id));
                                            }}
                                        />
                                    }
                                    label={s.name}
                                />
                            ))}
                            {sizes.length > 4 && (
                                <Button size="small" onClick={() => setShowAllSizes(!showAllSizes)}>
                                    {showAllSizes ? "Show Less" : `More (${sizes.length - 4})`}
                                </Button>
                            )}

                            <Typography variant="h6">Price Range</Typography>
                            <Slider
                                value={priceRange}
                                onChange={(e, newValue) => setPriceRange(newValue as number[])}
                                valueLabelDisplay="auto"
                                min={0}
                                max={5000}
                            />

                            <Button
                                variant="contained"
                                onClick={() => {
                                    const newFilters: ProductFilterDto = {
                                        BrandId: selectedBrands.length === 1 ? selectedBrands[0] : undefined,
                                        ColorIds: selectedColors,
                                        SizeIds: selectedSizes,
                                        MinPrice: priceRange[0],
                                        MaxPrice: priceRange[1]
                                    };
                                    fetchFilteredProducts(newFilters);
                                }}
                            >
                                Apply Filters
                            </Button>
                        </Box>

                        {/* Products Grid */}
                        <Box sx={{ flex: 1 }}>
                            <Grid container spacing={3}>
                                {paginatedProducts.map((prod) => (
                                    <Grid size={{xs:12, sm:6, md:4}} key={prod.id}>
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={`https://localhost:7027/${prod.productImages[0]}`}
                                                alt={prod.name}
                                            />
                                            <CardContent>
                                                <Typography variant="h6">{prod.name}</Typography>
                                                <Typography color="text.secondary">{prod.description}</Typography>
                                                <Typography color="text.primary">{prod.price}</Typography>
                                                <Typography color="text.primary">{prod.stock}</Typography>
                                                <Button variant="contained" onClick={()=>addToCart({
                                                   ProductId: prod.id,
                                                    Name: prod.name,
                                                    Description: prod.description,
                                                    Image: `https://localhost:7027/${prod.productImages[0]}`,
                                                    Price: prod.price,
                                                    Quantity: 1
                                                })} sx={{ mt: 2 }}>Buy Now</Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={Math.ceil(filteredProducts.length / pageSize)}
                                    page={page}
                                    onChange={handlePageChange}
                                    variant="outlined"
                                    color="primary"
                                />
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default PublicProductList;
