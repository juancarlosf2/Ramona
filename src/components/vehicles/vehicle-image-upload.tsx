import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "~/hooks/use-toast";

interface VehicleImageUploadProps {
  onImagesChange: (files: File[]) => void;
  initialFiles?: File[];
  maxImages?: number;
}

export function VehicleImageUpload({
  onImagesChange,
  initialFiles = [],
  maxImages = 10,
}: VehicleImageUploadProps) {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [previewUrls, setPreviewUrls] = useState<string[]>(() => {
    // Create preview URLs for initial files, but only if they exist and are File objects
    return initialFiles
      .filter((file): file is File => file instanceof File)
      .map((file) => URL.createObjectURL(file));
  });

  // Handle changes to initialFiles from parent component
  useEffect(() => {
    // Only update if the arrays are actually different
    const filesChanged =
      initialFiles.length !== files.length ||
      !initialFiles.every((file, index) => file === files[index]);

    if (filesChanged) {
      // Clean up existing preview URLs
      previewUrls.forEach((url) => URL.revokeObjectURL(url));

      // Update files and create new preview URLs
      setFiles(initialFiles);
      const newPreviewUrls = initialFiles
        .filter((file): file is File => file instanceof File)
        .map((file) => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  }, [initialFiles]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    if (files.length + selectedFiles.length > maxImages) {
      toast({
        title: "Demasiadas imágenes",
        description: `Solo puedes agregar un máximo de ${maxImages} imágenes`,
        variant: "destructive",
      });
      return;
    }

    // Validate file types
    const invalidFiles = selectedFiles.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      toast({
        title: "Tipo de archivo inválido",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes (4MB max per file to match UploadThing config)
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 4 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast({
        title: "Archivo demasiado grande",
        description: "Cada imagen debe ser menor a 4MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URLs for new files
    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    const updatedFiles = [...files, ...selectedFiles];
    const updatedPreviewUrls = [...previewUrls, ...newPreviewUrls];

    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviewUrls);
    onImagesChange(updatedFiles);

    // Clear the input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(previewUrls[index]);

    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviewUrls);
    onImagesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Imágenes del vehículo ({files.length}/{maxImages})
        </h3>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={files.length >= maxImages}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={files.length >= maxImages}
            asChild
          >
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Agregar imágenes
            </label>
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No hay imágenes seleccionadas aún
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Haz clic en "Agregar imágenes" para comenzar
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border">
                <img
                  src={url}
                  alt={`Imagen del vehículo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          {files.length} imagen(es) seleccionada(s) - Se subirán al registrar el
          vehículo
        </div>
      )}
    </div>
  );
}
