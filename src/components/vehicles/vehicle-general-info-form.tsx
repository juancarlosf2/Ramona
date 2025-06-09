import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { VehicleFormValues } from "./new-vehicle-schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { VehicleStatusSelector } from "~/components/vehicles/vehicle-status-selector";
import { VehicleImageUpload } from "~/components/vehicles/vehicle-image-upload";

interface VehicleGeneralInfoFormProps {
  form: UseFormReturn<VehicleFormValues>;
}

export function VehicleGeneralInfoForm({ form }: VehicleGeneralInfoFormProps) {
  // Car brands for dropdown
  // !TODO: we need to fetch this list from an API or a config file
  const carBrands = [
    "Toyota",
    "Honda",
    "Nissan",
    "Mazda",
    "Hyundai",
    "Kia",
    "Ford",
    "Chevrolet",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Lexus",
    "Jeep",
    "Subaru",
  ];

  // Vehicle types for dropdown
  const vehicleTypes = [
    "Sedan",
    "SUV",
    "Pickup",
    "Hatchback",
    "Coupé",
    "Convertible",
    "Minivan",
    "Crossover",
    "Wagon",
    "Luxury",
  ];

  // Colors with hex codes
  const colors = [
    { name: "Blanco", hex: "#FFFFFF" },
    { name: "Negro", hex: "#000000" },
    { name: "Gris", hex: "#808080" },
    { name: "Plata", hex: "#C0C0C0" },
    { name: "Rojo", hex: "#FF0000" },
    { name: "Azul", hex: "#0000FF" },
    { name: "Verde", hex: "#008000" },
    { name: "Amarillo", hex: "#FFFF00" },
    { name: "Naranja", hex: "#FFA500" },
    { name: "Marrón", hex: "#A52A2A" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Dorado", hex: "#FFD700" },
  ];

  // Animation for field focus
  useEffect(() => {
    const inputs = document.querySelectorAll("input, select, textarea");

    const handleFocus = (e: Event) => {
      const target = e.target as HTMLElement;
      target.classList.add("scale-[1.01]", "ring-2", "ring-primary/50");
    };

    const handleBlur = (e: Event) => {
      const target = e.target as HTMLElement;
      target.classList.remove("scale-[1.01]", "ring-2", "ring-primary/50");
    };

    inputs.forEach((input) => {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
      });
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Marca<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-150">
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[200px]">
                  {carBrands.map((brand, index) => (
                    <SelectItem
                      key={brand}
                      value={brand}
                      className="animate-in fade-in-50 slide-in-from-top-2"
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Modelo<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. Corolla, Civic, etc."
                  className="transition-all duration-150"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="year"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>
                Año<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2023"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  className="transition-all duration-150"
                  value={value?.toString() || ""}
                  onChange={(e) =>
                    onChange(
                      e.target.value ? parseInt(e.target.value, 10) : undefined
                    )
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trim"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Versión / Trim</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. XSE CVT"
                  className="transition-all duration-150"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tipo de vehículo<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-150">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicleTypes.map((type, index) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="animate-in fade-in-50 slide-in-from-top-2"
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Color<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-150">
                    <SelectValue placeholder="Seleccionar color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colors.map((color, index) => (
                    <SelectItem
                      key={color.name}
                      value={color.name}
                      className="animate-in fade-in-50 slide-in-from-top-2 flex items-center"
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      <span
                        className="w-4 h-4 rounded-full mr-2 inline-block border border-gray-200"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Condición<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-150">
                    <SelectValue placeholder="Seleccionar condición" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    value="new"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                  >
                    Nuevo
                  </SelectItem>
                  <SelectItem
                    value="used"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                    style={{ animationDelay: "20ms" }}
                  >
                    Usado
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Estado inicial del vehículo
              <span className="text-destructive ml-1">*</span>
            </FormLabel>
            <FormControl>
              <VehicleStatusSelector
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Foto(s) del vehículo</FormLabel>
            <FormControl>
              <VehicleImageUpload
                initialImages={field.value || []}
                onImagesChange={(urls) => field.onChange(urls)}
                maxImages={10}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción general</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Características destacadas, notas del vendedor, etc."
                className="min-h-[100px] transition-all duration-150"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
