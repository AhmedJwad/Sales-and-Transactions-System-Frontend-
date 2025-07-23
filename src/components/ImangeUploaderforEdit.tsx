// ImageUploader.tsx
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Button } from "@mui/material";

interface Props {
  onImageSelected: (base64Image: string) => void;
  initialImage?: string;
}

const ImageUploaderforEdit = forwardRef(({ onImageSelected }: Props, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    openFileDialog: () => {
      fileInputRef.current?.click();
    },
  }));

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onImageSelected(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
        accept="image/*"
      />
    </>
  );
});

export default ImageUploaderforEdit;
