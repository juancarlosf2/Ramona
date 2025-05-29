import { createFileRoute, useRouter } from "@tanstack/react-router";

import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { CardInput } from "~/components/ui/card-input";
import {
  User,
  Car,
  DollarSign,
  FileText,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn, formatCurrency } from "~/lib/utils";
import { Wizard, type WizardStep } from "~/components/ui/wizard";
import {
  useAvailableVehicles,
  useCreateClient,
  useCreateContract,
  getErrorMessage,
} from "~/hooks/useSupabaseData";
import { Button } from "~/components/ui/button";
import { toast, useToast } from "~/hooks/use-toast";

// Define the form schema with Zod
const clientFormSchema = z.object({
  // Step 1: Client Data
  cedula: z
    .string()
    .min(11, { error: "La cédula debe tener 11 dígitos" })
    .max(13, { error: "Formato de cédula inválido" }),
  name: z.string().min(2, { error: "El nombre es requerido" }),
  email: z.email({ error: "Email Inválido" }).optional(),
  phone: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .optional(),
  address: z.string().min(5, { error: "La dirección es requerida" }),

  // Step 2: Vehicle Selection
  vehicleId: z.string().min(1, { error: "Debe seleccionar un vehículo" }),

  // Step 3: Sale Terms
  price: z.string().min(1, { error: "El precio es requerido" }),
  paymentMethod: z.enum(["cash", "financing"]),
  downPayment: z.string().optional(),
  months: z.string().optional(),
  monthlyPayment: z.string().optional(),

  // Step 4: Contract
  notes: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

// Sample vehicle data (remove this once we connect to the server)
const vehicles = [
  {
    id: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    color: "Blanco",
    vin: "1HGCM82633A123456",
    price: 950000,
    status: "available",
  },
  {
    id: "2",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    color: "Negro",
    vin: "2HGFG12567H789012",
    price: 875000,
    status: "available",
  },
  {
    id: "3",
    brand: "Hyundai",
    model: "Tucson",
    year: 2023,
    color: "Gris",
    vin: "5NPE24AF1FH123789",
    price: 1250000,
    status: "available",
  },
];

export const Route = createFileRoute("/_authed/clients/new")({
  component: NewClientPage,
});

export default function NewClientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // Fetch available vehicles from the server
  const {
    data: availableVehicles = [],
    isLoading: isLoadingVehicles,
    error: vehiclesError,
  } = useAvailableVehicles();

  // Mutations for creating client and contract
  const createClientMutation = useCreateClient();
  const createContractMutation = useCreateContract();

  // Define form with react-hook-form
  const form = useForm<ClientFormValues>({
    resolver: standardSchemaResolver(clientFormSchema),
    defaultValues: {
      cedula: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      vehicleId: "",
      price: "",
      paymentMethod: "cash",
      downPayment: "",
      months: "24",
      monthlyPayment: "",
      notes: "",
    },
    mode: "onChange",
  });

  // Watch form values for calculations
  const paymentMethod = form.watch("paymentMethod");
  const price = form.watch("price");
  const downPayment = form.watch("downPayment");
  const months = form.watch("months");
  const vehicleId = form.watch("vehicleId");

  // Calculate monthly payment when values change
  React.useEffect(() => {
    if (paymentMethod === "financing" && price && downPayment && months) {
      const priceValue = Number.parseFloat(price.replace(/[^\d.]/g, ""));
      const downPaymentValue = Number.parseFloat(
        downPayment.replace(/[^\d.]/g, "")
      );
      const monthsValue = Number.parseInt(months);

      if (
        !isNaN(priceValue) &&
        !isNaN(downPaymentValue) &&
        !isNaN(monthsValue) &&
        monthsValue > 0
      ) {
        const financedAmount = priceValue - downPaymentValue;
        // Simple calculation (no interest for demo)
        const monthly = financedAmount / monthsValue;
        form.setValue("monthlyPayment", formatCurrency(monthly));
      }
    }
  }, [price, downPayment, months, paymentMethod]);

  // Format cedula as user types
  const formatCedula = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");

    // Format as XXX-XXXXXXX-X
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 10)}-${digits.slice(10, 11)}`;
    }
  };

  // Format phone number as user types
  const formatPhone = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");

    // Format as XXX-XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

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

  // Handle form submission
  const onSubmit = async (data: ClientFormValues) => {
    try {
      // First create the client
      const client = await createClientMutation.mutateAsync({
        cedula: data.cedula.replace(/\D/g, ""), // Remove formatting
        name: data.name,
        email: data.email || undefined,
        phone: data.phone?.replace(/\D/g, "") || undefined, // Remove formatting
        address: data.address,
      });

      // Then create the contract
      await createContractMutation.mutateAsync({
        clientId: client.id,
        vehicleId: data.vehicleId,
        price: Number.parseFloat(data.price.replace(/[^\d.]/g, "")),
        paymentMethod: data.paymentMethod,
        downPayment: data.downPayment
          ? Number.parseFloat(data.downPayment.replace(/[^\d.]/g, ""))
          : null,
        months: data.months ? Number.parseInt(data.months) : null,
        monthlyPayment: data.monthlyPayment
          ? Number.parseFloat(data.monthlyPayment.replace(/[^\d.]/g, ""))
          : null,
        notes: data.notes || undefined,
      });

      toast({
        title: "Cliente registrado con éxito",
        description: "El cliente y contrato han sido creados correctamente.",
      });

      // Navigate back to clients list after successful submission
      router.navigate({ to: "/clients" });
    } catch (error) {
      toast({
        title: "Error al registrar cliente",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Define wizard steps
  const wizardSteps: WizardStep[] = [
    {
      id: "client",
      label: "Datos del Cliente",
      description: "Información personal",
      icon: <User className="h-4 w-4" />,
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cedula"
              render={({ field }) => (
                <FormItem>
                  <CardInput
                    label="Cédula"
                    icon={<User className="h-4 w-4 text-muted-foreground" />}
                    placeholder="000-0000000-0"
                    required
                    value={field.value}
                    onChange={(e) => {
                      const formatted = formatCedula(e.target.value);
                      field.onChange(formatted);
                    }}
                    error={form.formState.errors.cedula?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <CardInput
                    label="Nombre Completo"
                    icon={<User className="h-4 w-4 text-muted-foreground" />}
                    placeholder="Nombre y apellido"
                    required
                    {...field}
                    error={form.formState.errors.name?.message}
                  />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <CardInput
                    label="Email"
                    type="email"
                    icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                    placeholder="ejemplo@correo.com"
                    {...field}
                    error={form.formState.errors.email?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <CardInput
                    label="Teléfono"
                    icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                    placeholder="809-000-0000"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      field.onChange(formatted);
                    }}
                    error={form.formState.errors.phone?.message}
                  />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Dirección<span className="text-destructive ml-1">*</span>
                </FormLabel>
                <div className="relative">
                  <div className="absolute top-3 left-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Textarea
                    placeholder="Dirección completa"
                    className={cn(
                      "pl-10 min-h-[80px]",
                      form.formState.errors.address &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    {...field}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
      validate: async () => {
        const result = await form.trigger(["cedula", "name", "address"]);
        return result;
      },
    },
    {
      id: "vehicle",
      label: "Vehículo",
      description: "Selección de vehículo",
      icon: <Car className="h-4 w-4" />,
      component: (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="vehicleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Seleccionar Vehículo
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);

                    // Only find vehicle from available vehicles - no fallback
                    const vehicle = availableVehicles.find(
                      (v) => v.id === value
                    );

                    if (vehicle) {
                      console.log("Selected vehicle:", vehicle);
                      setSelectedVehicle(vehicle);
                      form.setValue("price", vehicle.price.toString());
                    }
                  }}
                  defaultValue={field.value}
                  disabled={isLoadingVehicles || availableVehicles.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingVehicles
                            ? "Cargando vehículos..."
                            : availableVehicles.length === 0
                              ? "No hay vehículos disponibles"
                              : "Selecciona un vehículo"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehiclesError && (
                      <div className="p-2 text-sm text-destructive">
                        Error: {getErrorMessage(vehiclesError)}
                      </div>
                    )}
                    {availableVehicles.length === 0 &&
                      !isLoadingVehicles &&
                      !vehiclesError && (
                        <div className="p-2 text-sm text-muted-foreground">
                          No hay vehículos disponibles para asignar
                        </div>
                      )}
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} {vehicle.year} -{" "}
                        {vehicle.color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {availableVehicles.length === 0 &&
                  !isLoadingVehicles &&
                  !vehiclesError && (
                    <FormDescription className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      No hay vehículos disponibles.{" "}
                      <button
                        type="button"
                        onClick={() =>
                          router.navigate({ to: "/vehicles/register" })
                        }
                        className="text-primary underline hover:no-underline"
                      >
                        Registrar un nuevo vehículo
                      </button>
                    </FormDescription>
                  )}
                {vehiclesError && (
                  <FormDescription className="text-destructive">
                    {getErrorMessage(vehiclesError)}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />

          {selectedVehicle && (
            <div className="bg-muted/50 rounded-lg p-4 border">
              <h3 className="font-medium mb-2 flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Detalles del Vehículo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Marca / Modelo:</p>
                  <p className="font-medium">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Año:</p>
                  <p className="font-medium">{selectedVehicle.year}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Color:</p>
                  <p className="font-medium">{selectedVehicle.color}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">VIN/Chasis:</p>
                  <p className="font-medium">{selectedVehicle.vin}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Precio Sugerido:</p>
                  <p className="font-medium">
                    {formatCurrency(selectedVehicle.price)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado:</p>
                  <p className="font-medium capitalize">
                    {selectedVehicle.status}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
      validate: async () => {
        // Check if there are available vehicles first
        if (availableVehicles.length === 0) {
          toast({
            title: "No hay vehículos disponibles",
            description:
              "Debe registrar al menos un vehículo disponible para asignar a un cliente.",
            variant: "destructive",
          });
          return false;
        }

        const result = await form.trigger(["vehicleId"]);
        return result;
      },
    },
    {
      id: "terms",
      label: "Términos de Venta",
      description: "Precio y financiamiento",
      icon: <DollarSign className="h-4 w-4" />,
      component: (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <CardInput
                  label="Precio de Venta"
                  icon={
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  }
                  placeholder="RD$ 0"
                  required
                  value={field.value}
                  onChange={(e) => {
                    const formatted = formatCurrencyInput(e.target.value);
                    field.onChange(formatted);
                  }}
                  error={form.formState.errors.price?.message}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Método de Pago<span className="text-destructive ml-1">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona método de pago" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">Pago Completo</SelectItem>
                    <SelectItem value="financing">Financiamiento</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {paymentMethod === "financing" && (
            <div className="space-y-4 border rounded-lg p-4 bg-muted/30 animate-in fade-in-50 duration-300">
              <h3 className="font-medium flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Detalles del Financiamiento
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="downPayment"
                  render={({ field }) => (
                    <FormItem>
                      <CardInput
                        label="Cuota Inicial"
                        icon={
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        }
                        placeholder="RD$ 0"
                        required
                        value={field.value}
                        onChange={(e) => {
                          const formatted = formatCurrencyInput(e.target.value);
                          field.onChange(formatted);
                        }}
                        error={form.formState.errors.downPayment?.message}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="months"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Meses a Financiar
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona plazo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="12">12 meses</SelectItem>
                          <SelectItem value="24">24 meses</SelectItem>
                          <SelectItem value="36">36 meses</SelectItem>
                          <SelectItem value="48">48 meses</SelectItem>
                          <SelectItem value="60">60 meses</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="monthlyPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Monto Mensual Estimado
                    </FormLabel>
                    <Input
                      readOnly
                      value={field.value || "RD$ 0"}
                      className="bg-muted/50"
                    />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      ),
      validate: async () => {
        let result = await form.trigger(["price", "paymentMethod"]);

        if (result && paymentMethod === "financing") {
          result = await form.trigger(["downPayment", "months"]);
        }

        return result;
      },
    },
    {
      id: "contract",
      label: "Contrato",
      description: "Revisión y generación",
      icon: <FileText className="h-4 w-4" />,
      component: (
        <div className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-4 border">
            <h3 className="font-medium mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Vista Previa del Contrato
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Datos del Cliente
                  </h4>
                  <div className="mt-1 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Nombre:</span>{" "}
                      {form.getValues("name")}
                    </p>
                    <p>
                      <span className="font-medium">Cédula:</span>{" "}
                      {form.getValues("cedula")}
                    </p>
                    <p>
                      <span className="font-medium">Dirección:</span>{" "}
                      {form.getValues("address")}
                    </p>
                    {form.getValues("phone") && (
                      <p>
                        <span className="font-medium">Teléfono:</span>{" "}
                        {form.getValues("phone")}
                      </p>
                    )}
                    {form.getValues("email") && (
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {form.getValues("email")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Datos del Vehículo
                  </h4>
                  {selectedVehicle && (
                    <div className="mt-1 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Marca/Modelo:</span>{" "}
                        {selectedVehicle.brand} {selectedVehicle.model}
                      </p>
                      <p>
                        <span className="font-medium">Año:</span>{" "}
                        {selectedVehicle.year}
                      </p>
                      <p>
                        <span className="font-medium">Color:</span>{" "}
                        {selectedVehicle.color}
                      </p>
                      <p>
                        <span className="font-medium">VIN/Chasis:</span>{" "}
                        {selectedVehicle.vin}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Términos de Venta
                </h4>
                <div className="mt-1 space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Precio de Venta:</span>{" "}
                    {form.getValues("price")}
                  </p>
                  <p>
                    <span className="font-medium">Método de Pago:</span>{" "}
                    {form.getValues("paymentMethod") === "cash"
                      ? "Pago Completo"
                      : "Financiamiento"}
                  </p>

                  {form.getValues("paymentMethod") === "financing" && (
                    <>
                      <p>
                        <span className="font-medium">Cuota Inicial:</span>{" "}
                        {form.getValues("downPayment")}
                      </p>
                      <p>
                        <span className="font-medium">Plazo:</span>{" "}
                        {form.getValues("months")} meses
                      </p>
                      <p>
                        <span className="font-medium">Cuota Mensual:</span>{" "}
                        {form.getValues("monthlyPayment")}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Notas Adicionales
                </FormLabel>
                <Textarea
                  placeholder="Notas o condiciones especiales para el contrato"
                  className="min-h-[100px]"
                  {...field}
                />
                <FormDescription>
                  Estas notas se incluirán en el contrato final.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Importante</p>
              <p>
                Al generar este contrato, confirma que toda la información
                proporcionada es correcta. El contrato será legalmente
                vinculante una vez firmado por ambas partes.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Agregar Cliente</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Wizard
            steps={wizardSteps}
            title="Registro de Cliente y Contrato"
            description="Complete la información para registrar un nuevo cliente y generar un contrato"
            onComplete={form.handleSubmit(onSubmit)}
            cancelHref="/clients"
            completeText={
              createClientMutation.isPending || createContractMutation.isPending
                ? "Generando Contrato..."
                : "Generar Contrato"
            }
            autoSave={true}
          />
        </form>
      </Form>
    </div>
  );
}
