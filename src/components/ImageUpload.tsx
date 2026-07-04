
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isLoading?: boolean;
}

export const ImageUpload = ({ onImageUpload, isLoading }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 transition-colors duration-200 bg-card cursor-pointer",
          "hover:border-primary/40 hover:bg-primary/[0.03]",
          isDragActive ? "border-primary bg-primary/5" : "border-border",
          isLoading && "opacity-60 cursor-not-allowed pointer-events-none"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          {preview ? (
            <div className="relative w-full aspect-video">
              <img
                src={preview}
                alt="Preview of the uploaded pest photo"
                className="rounded-lg object-contain w-full h-full"
              />
            </div>
          ) : (
            <>
              <div className="p-3.5 bg-primary/10 rounded-full">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">Drop your pest image here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to select a file
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>JPG, PNG or WEBP · max 5MB</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
