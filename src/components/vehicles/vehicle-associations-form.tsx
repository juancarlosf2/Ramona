import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { VehicleFormValues } from "~/components/vehicles/new-vehicle-schema";
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
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Check, Info, Save, User, Building2, Clock } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { useConcesionarios, getErrorMessage } from "~/hooks/useSupabaseData";

interface VehicleAssociationsFormProps {
  form: UseFormReturn<VehicleFormValues>;
  onAddAnother: (value: boolean) => void;
  addAnother: boolean;
}

export function VehicleAssociationsForm({
  form,
  onAddAnother,
  addAnother,
}: VehicleAssociationsFormProps) {
  // Fetch available concesionarios from server
  const {
    data: concesionarios = [],
    isLoading: isLoadingConcesionarios,
    error: concesionariosError,
  } = useConcesionarios();

  const selectedConcesionarioId = form.watch("concesionarioId");
  const selectedConcesionario = concesionarios.find(
    (c) => c.id === selectedConcesionarioId
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-4">
        {/* Consignment Assignment Section */}
        <FormField
          control={form.control}
          name="concesionarioId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Asignar a concesionario
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  // Convert "unassigned" back to empty string for the form
                  field.onChange(value === "unassigned" ? "" : value);
                }}
                defaultValue={field.value || "unassigned"}
                disabled={isLoadingConcesionarios}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingConcesionarios
                          ? "Cargando concesionarios..."
                          : "Seleccionar concesionario (opcional)"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {concesionariosError && (
                    <div className="p-2 text-sm text-destructive">
                      Error: {getErrorMessage(concesionariosError)}
                    </div>
                  )}
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  {concesionarios.map((concesionario) => (
                    <SelectItem key={concesionario.id} value={concesionario.id}>
                      {concesionario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Asigna este vehículo a un concesionario específico para su
                gestión
              </p>

              {selectedConcesionario && (
                <Alert className="animate-in fade-in-50 slide-in-from-top-2 duration-300 bg-green-50 border-green-200">
                  <Building2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Vehículo será asignado a{" "}
                    <span className="font-medium">
                      {selectedConcesionario.name}
                    </span>{" "}
                    para su gestión y venta.
                  </AlertDescription>
                </Alert>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Disabled Client Association Section - Coming Soon */}
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                Asociar a cliente existente
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Próximamente
                </Badge>
              </FormLabel>
              <div className="space-y-2">
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Buscar por nombre, cédula o email"
                      className="transition-all duration-150 pr-10 bg-muted cursor-not-allowed"
                      disabled
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </FormControl>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    La función de asociación directa con clientes estará
                    disponible próximamente. Por ahora, puedes asignar el
                    vehículo a un concesionario.
                  </AlertDescription>
                </Alert>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="pt-4 border-t">
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar y agregar otro vehículo
            </FormLabel>
            <p className="text-sm text-muted-foreground">
              Activa esta opción para agregar otro vehículo después de guardar
            </p>
          </div>
          <FormControl>
            <Switch
              checked={addAnother}
              onCheckedChange={onAddAnother}
              className="transition-all duration-200 data-[state=checked]:animate-pulse"
            />
          </FormControl>
        </FormItem>
      </div>
    </div>
  );
}
