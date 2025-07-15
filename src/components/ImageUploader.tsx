// components/ImageUploader.tsx
import { FC, useRef, useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";

interface Props {
  onImageSelected: (base64Image: string) => void;
  initialImage?: string;
}

const ImageUploader: FC<Props> = ({ onImageSelected, initialImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file only.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum image size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      console.log("Full result:", result);
      const base64Only = result.split(",")[1];
      setImagePreview(result);
      onImageSelected(base64Only);
    };
    reader.onerror = () => {
      alert("An error occurred while reading the file.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelected("");
  };

  return (
    <Box>
      <input
        type="file"
        hidden
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>
          {imagePreview ? "Change Image" : "Upload Image"}
        </Button>
        {imagePreview && (
          <Button variant="outlined" color="error" onClick={handleRemove}>
            Remove Image
          </Button>
        )}
      </Box>

      {imagePreview && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar src={imagePreview} sx={{ width: 200, height: 200 }} />
        </Box>
      )}
    </Box>
  );
};

export default ImageUploader;
