// components/ImageUploader.tsx
import { FC, useRef, useState } from "react";
import { Avatar, Box, Button, Typography, MenuItem, Select } from "@mui/material";
import { ColourDTO } from "../types/ColoutDTO"; // ✅ استدعاء نوع اللون

interface Props {
  onImageSelected: (base64Image: string, selectedColor: ColourDTO) => void;
  nonSelectedColors: ColourDTO[]; // ✅ الألوان المتاحة
  initialImage?: string;
}

const ImageUploaderColor: FC<Props> = ({ onImageSelected, nonSelectedColors, initialImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage ?? null);
  const [selectedColor, setSelectedColor] = useState<ColourDTO | null>(null);

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
      const base64Only = result.split(",")[1];
      setImagePreview(result);

      // ✅ لا نرسل إلا إذا كان في لون مختار
      if (selectedColor) {
        onImageSelected(base64Only, selectedColor);
      }
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
    setSelectedColor(null);
    // ممكن ترجع للأب إنو تم الحذف
    // onImageSelected("", {id: 0, name: ""} as ColourDTO);
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

      {/* ✅ Dropdown لاختيار اللون */}
      <Select
        fullWidth
        value={selectedColor?.id || ""}
        onChange={(e) => {
          const color = nonSelectedColors.find(c => c.id === Number(e.target.value));
          setSelectedColor(color || null);
          if (imagePreview && color) {
            const base64Only = imagePreview.split(",")[1];
            onImageSelected(base64Only, color);
          }
        }}
        displayEmpty
      >
        <MenuItem value="">اختر لون</MenuItem>
        {nonSelectedColors.map((c) => (
          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
        ))}
      </Select>

      {imagePreview && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar src={imagePreview} sx={{ width: 200, height: 200 }} />
        </Box>
      )}
    </Box>
  );
};

export default ImageUploaderColor;
