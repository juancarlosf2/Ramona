import { useState } from "react";
import { useUploadThing } from "~/lib/uploadthing-client";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "~/hooks/use-toast";

interface VehicleImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
}

export function VehicleImageUpload({
  onImagesChange,
  initialImages = [],
  maxImages = 10,
}: VehicleImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);

  const { startUpload, isUploading } = useUploadThing("vehicleImageUploader", {
    onClientUploadComplete: (res) => {
      const newUrls = res?.map((file) => file.ufsUrl) || [];
      const updatedImages = [...images, ...newUrls];
      setImages(updatedImages);
      onImagesChange(updatedImages);
      toast({
        title: "Imágenes subidas exitosamente",
        description: `${newUrls.length} imagen(es) subida(s)`,
      });
    },
    onUploadError: (error) => {
      toast({
        title: "Error al subir imágenes",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Demasiadas imágenes",
        description: `Solo puedes subir un máximo de ${maxImages} imágenes`,
        variant: "destructive",
      });
      return;
    }

    await startUpload(files);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Imágenes del vehículo ({images.length}/{maxImages})
        </h3>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading || images.length >= maxImages}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading || images.length >= maxImages}
            asChild
          >
            <label htmlFor="image-upload" className="cursor-pointer">
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isUploading ? "Subiendo..." : "Agregar imágenes"}
            </label>
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No hay imágenes subidas aún
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Haz clic en "Agregar imágenes" para comenzar
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
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

      {isUploading && (
        <div className="text-sm text-muted-foreground text-center">
          Subiendo imágenes...
        </div>
      )}
    </div>
  );
}
