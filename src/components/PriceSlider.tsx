import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

interface PriceSliderProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  minPrice: number;
  maxPrice: number;
  onCommit: () => void; 
}
 

 const PriceSlider: React.FC<PriceSliderProps> = ({
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
  onCommit,  
}) => {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        size="small"
        value={priceRange}
        min={minPrice}
        max={maxPrice}
        step={1000}
        marks
        onChange={(_, value) => setPriceRange(value as number[])} // Type casting
        onChangeCommitted={onCommit}
        valueLabelDisplay="auto"       
        aria-label="Price range"
      />
    </Box>
  );
};

export default PriceSlider;