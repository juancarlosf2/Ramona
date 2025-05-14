import type React from "react";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ImagePlus, X, MoveVertical, Edit, Trash2 } from "lucide-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(value || []);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);

      // Simulate file upload with a delay
      setTimeout(() => {
        const newImages = Array.from(e.target.files || []).map((file) => {
          // In a real app, you would upload the file to a server and get a URL back
          // For this demo, we'll use a placeholder
          return `/placeholder.svg?height=400&width=600&query=car`;
        });

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onChange(updatedImages);
        setUploading(false);
      }, 1500);
    }
  };

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (draggedIndex !== null) {
      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];

      // Remove the dragged item
      newImages.splice(draggedIndex, 1);

      // Insert it at the new position
      newImages.splice(index, 0, draggedImage);

      setImages(newImages);
      onChange(newImages);
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  // Handle drag enter for the drop area
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave for the drop area
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle drop for the drop area
  const handleDropArea = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploading(true);

      // Simulate file upload with a delay
      setTimeout(() => {
        const newImages = Array.from(e.dataTransfer.files).map(() => {
          // In a real app, you would upload the file to a server and get a URL back
          return `/placeholder.svg?height=400&width=600&query=car`;
        });

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onChange(updatedImages);
        setUploading(false);
      }, 1500);
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20"
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDropArea}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <ImagePlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">Arrastra y suelta imágenes aquí</p>
            <p className="text-sm text-muted-foreground">
              O haz clic para seleccionar archivos
            </p>
          </div>
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Subiendo...
              </>
            ) : (
              "Seleccionar imágenes"
            )}
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden group transition-all duration-200 ${
                draggedIndex === index ? "opacity-50" : ""
              } ${dragOverIndex === index ? "border-primary" : ""}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="aspect-square relative">
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Vehicle image ${index + 1}`}
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full animate-in fade-in-0 zoom-in-95 duration-200"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full animate-in fade-in-0 zoom-in-95 duration-200"
                    style={{ animationDelay: "50ms" }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full animate-in fade-in-0 zoom-in-95 duration-200"
                    style={{ animationDelay: "100ms" }}
                  >
                    <MoveVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
