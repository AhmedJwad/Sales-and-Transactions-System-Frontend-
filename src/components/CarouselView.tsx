import { FC } from "react";
import { Box } from "@mui/material";

interface CarouselViewProps {
  images: string[];
}

const CarouselView: FC<CarouselViewProps> = ({ images }) => {
  return (
    <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
      {images.map((image, index) => (
        <Box
          key={index}
          sx={{
            width: 150,
            height: 150,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 2,
          }}
        >
          <img
            src={`https://localhost:7027/${image}`}
            alt={`Image ${index}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default CarouselView;
