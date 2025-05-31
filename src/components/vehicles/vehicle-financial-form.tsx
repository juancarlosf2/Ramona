import { SelectItem } from "~/components/ui/select";

import { SelectContent } from "~/components/ui/select";

import { SelectValue } from "~/components/ui/select";

import { SelectTrigger } from "~/components/ui/select";

import { Select } from "~/components/ui/select";

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
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "~/lib/utils";

interface VehicleFinancialFormProps {
  form: UseFormReturn<VehicleFormValues>;
}

export function VehicleFinancialForm({ form }: VehicleFinancialFormProps) {
  // Format currency as user types
  const formatCurrencyInput = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");

    // Format as currency
    if (digits) {
      return new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency: "DOP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number.parseInt(digits));
    }
    return "";
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <FormField
        control={form.control}
        name="entryDate"
        render={({ field }) => {
          // Convert field value from ISO string to Date for the calendar
          const selectedDate = field.value ? new Date(field.value) : undefined;

          return (
            <FormItem className="flex flex-col">
              <FormLabel>
                Fecha de ingreso
                <span className="text-destructive ml-1">*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(new Date(field.value), "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      // Convert Date back to ISO string for the form
                      field.onChange(date ? date.toISOString() : "");
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Precio del vehículo
              <span className="text-destructive ml-1">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="RD$ 0"
                className="transition-all duration-150"
                value={field.value}
                onChange={(e) => {
                  const formatted = formatCurrencyInput(e.target.value);
                  field.onChange(formatted);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="hasOffer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  ¿Tiene oferta activa?
                </FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="transition-all duration-200 data-[state=checked]:animate-pulse"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("hasOffer") && (
          <FormField
            control={form.control}
            name="offerPrice"
            render={({ field }) => (
              <FormItem className="animate-in fade-in-50 slide-in-from-top-5 duration-300">
                <FormLabel>Precio con oferta</FormLabel>
                <FormControl>
                  <Input
                    placeholder="RD$ 0"
                    className="transition-all duration-150"
                    value={field.value}
                    onChange={(e) => {
                      const formatted = formatCurrencyInput(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        control={form.control}
        name="adminStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado administrativo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="transition-all duration-150">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  value="processing"
                  className="animate-in fade-in-50 slide-in-from-top-2"
                >
                  En gestión
                </SelectItem>
                <SelectItem
                  value="pending_payment"
                  className="animate-in fade-in-50 slide-in-from-top-2"
                  style={{ animationDelay: "20ms" }}
                >
                  Pago pendiente
                </SelectItem>
                <SelectItem
                  value="completed"
                  className="animate-in fade-in-50 slide-in-from-top-2"
                  style={{ animationDelay: "40ms" }}
                >
                  Completado
                </SelectItem>
                <SelectItem
                  value="importing"
                  className="animate-in fade-in-50 slide-in-from-top-2"
                  style={{ animationDelay: "60ms" }}
                >
                  En importación
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="inMaintenance"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                En preparación o mantenimiento
              </FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="transition-all duration-200 data-[state=checked]:animate-pulse"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
