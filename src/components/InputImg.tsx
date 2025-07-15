import * as React from "react";
import { useState, useEffect } from "react";

interface InputImgProps {
  label?: string;
  imageUrl?: string;
  onImageSelected: (base64: string) => void; // This receives base64 string without "data:image/..." prefix
}

const InputImg: React.FC<InputImgProps> = ({
  label = "Image",
  imageUrl,
  onImageSelected,
}) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrl) {
      if (imageUrl.startsWith("data:image/")) {
        setImageBase64(imageUrl);
      } else {
        setImageBase64(`data:image/jpeg;base64,${imageUrl}`);
      }
    } else {
      setImageBase64(null);
    }
  }, [imageUrl]);
  const convertToBase64 = (file:any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      
      const base64Data = result.split(",")[1];
      setImageBase64(result); // Still show the full base64 for preview
      onImageSelected(base64Data); // Send only base64 string
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label>{label}</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageBase64 && (
        <div style={{ marginTop: 10 }}>
          <img
            src={imageBase64}
            alt="Preview"
            style={{ height: 200, maxWidth: 200 }}
          />
        </div>
      )}
    </div>
  );
};

export default InputImg;
