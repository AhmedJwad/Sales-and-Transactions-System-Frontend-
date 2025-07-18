// CarouselView.tsx
import { FC, useMemo } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface CarouselViewProps {
  images: string[];
}

const CarouselView: FC<CarouselViewProps> = ({ images }) => {
  const galleryItems = useMemo(() => {
    return images.map((image) => ({
      original: `https://localhost:7027/${image}`,
      thumbnail: `https://localhost:7027/${image}`,
    }));
  }, [images]);

  return (    
      <ImageGallery
        items={galleryItems}
        showPlayButton={false}
        showFullscreenButton={false}
        slideDuration={300}
        slideInterval={5000}
        showThumbnails={true}
      />   
  );
};

export default CarouselView;
