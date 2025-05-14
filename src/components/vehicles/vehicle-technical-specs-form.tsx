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

interface VehicleTechnicalSpecsFormProps {
  form: UseFormReturn<VehicleFormValues>;
}

export function VehicleTechnicalSpecsForm({
  form,
}: VehicleTechnicalSpecsFormProps) {
  // Format VIN as user types
  const formatVIN = (value: string) => {
    // Remove spaces and convert to uppercase
    return value.replace(/\s/g, "").toUpperCase();
  };

  // Format plate as user types
  const formatPlate = (value: string) => {
    // Remove spaces and convert to uppercase
    return value.replace(/\s/g, "").toUpperCase();
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="transmission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Transmisión<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-150">
                    <SelectValue placeholder="Seleccionar transmisión" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    value="automatic"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                  >
                    Automática
                  </SelectItem>
                  <SelectItem
                    value="manual"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                    style={{ animationDelay: "20ms" }}
                  >
                    Manual
                  </SelectItem>
                  <SelectItem
                    value="cvt"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                    style={{ animationDelay: "40ms" }}
                  >
                    CVT
                  </SelectItem>
                  <SelectItem
                    value="dct"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                    style={{ animationDelay: "60ms" }}
                  >
                    Doble Embrague (DCT)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fuelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Combustible<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-150">
                    <SelectValue placeholder="Seleccionar combustible" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    value="gasoline"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                  >
                    Gasolina
                  </SelectItem>
                  <SelectItem
                    value="diesel"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                    style={{ animationDelay: "20ms" }}
                  >
                    Diesel
                  </SelectItem>
                  <SelectItem
                    value="electric"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                    style={{ animationDelay: "40ms" }}
                  >
                    Eléctrico
                  </SelectItem>
                  <SelectItem
                    value="hybrid"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                    style={{ animationDelay: "60ms" }}
                  >
                    Híbrido
                  </SelectItem>
                  <SelectItem
                    value="plugin_hybrid"
                    className="animate-in fade-in-50 slide-in-from-top-2"
                    style={{ animationDelay: "80ms" }}
                  >
                    Híbrido Enchufable
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
        name="engineSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Motor (litros)<span className="text-destructive ml-1">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ej. 1.8L"
                className="transition-all duration-150"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                VIN/Chasis<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Número de chasis (17 caracteres)"
                  className="transition-all duration-150"
                  value={field.value}
                  onChange={(e) => {
                    const formatted = formatVIN(e.target.value);
                    field.onChange(formatted);
                  }}
                  maxLength={17}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input
                  placeholder="Número de placa"
                  className="transition-all duration-150"
                  value={field.value}
                  onChange={(e) => {
                    const formatted = formatPlate(e.target.value);
                    field.onChange(formatted);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="mileage"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Kilometraje</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0"
                  className="transition-all duration-150 pr-12"
                  value={value === 0 ? "" : value}
                  onChange={(e) =>
                    onChange(
                      e.target.value ? Number.parseInt(e.target.value) : 0
                    )
                  }
                  min={0}
                  {...field}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                  km
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="doors"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>
                Puertas<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Select
                onValueChange={(value) => onChange(Number.parseInt(value))}
                defaultValue={value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="transition-all duration-150">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[2, 3, 4, 5].map((num, index) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className="animate-in fade-in-50 slide-in-from-top-2"
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      {num}
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
          name="seats"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>
                Asientos<span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Select
                onValueChange={(value) => onChange(Number.parseInt(value))}
                defaultValue={value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="transition-all duration-150">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className="animate-in fade-in-50 slide-in-from-top-2"
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
