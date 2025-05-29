import { createFileRoute, useRouter } from "@tanstack/react-router";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import {
  User,
  Car,
  DollarSign,
  Calendar,
  FileText,
  AlertCircle,
  CreditCard,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "~/lib/utils";
import { Wizard, type WizardStep } from "~/components/ui/wizard";
import { ContractStatusSelector } from "~/components/contracts/contract-status-selector";
import { ContractStatusBadge } from "~/components/contracts/contract-status-badge";
import { useToast } from "~/hooks/use-toast";
import {
  useClients,
  useAvailableVehicles,
  useCreateContract,
  getErrorMessage,
} from "~/hooks/useSupabaseData";

// Define the form schema with Zod
const contractFormSchema = z.object({
  status: z.enum(["active", "pending", "completed"]),
  clientId: z.string().min(1, "Debe seleccionar un cliente"),
  vehicleId: z.string().min(1, "Debe seleccionar un vehículo"),
  price: z.string().min(1, "El precio es requerido"),
  date: z.string().min(1, "La fecha es requerida"),
  financingType: z.enum(["cash", "financing"]),
  downPayment: z.string().optional(),
  months: z.string().optional(),
  monthlyPayment: z.string().optional(),
  notes: z.string().optional(),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

// Sample client data (remove once connected to server)
const clients = [
  {
    id: "1",
    name: "Juan Pérez",
    cedula: "001-1234567-8",
    email: "juan.perez@example.com",
    dealerId: "dealer1",
  },
  {
    id: "2",
    name: "María Rodríguez",
    cedula: "002-9876543-2",
    email: "maria.rodriguez@example.com",
    dealerId: "dealer1",
  },
  {
    id: "3",
    name: "Carlos Gómez",
    cedula: "003-4567890-1",
    email: "carlos.gomez@example.com",
    dealerId: "dealer1",
  },
  {
    id: "4",
    name: "Laura Sánchez",
    cedula: "004-3210987-6",
    email: "laura.sanchez@example.com",
    dealerId: "dealer1",
  },
  {
    id: "5",
    name: "Roberto Méndez",
    cedula: "005-6789012-3",
    email: "roberto.mendez@example.com",
    dealerId: "dealer1",
  },
];

// Sample vehicle data (remove once connected to server)
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
    id: "3",
    brand: "Hyundai",
    model: "Tucson",
    year: 2023,
    color: "Gris",
    vin: "5NPE24AF1FH123789",
    price: 1250000,
    status: "available",
  },
  {
    id: "4",
    brand: "Kia",
    model: "Sportage",
    year: 2022,
    color: "Rojo",
    vin: "KNDPB3AC8F7123456",
    price: 1050000,
    status: "available",
  },
];

export const Route = createFileRoute("/_authed/contracts/new")({
  component: NewContractPage,
  validateSearch: (search) =>
    search as {
      date: string | undefined;
    },
});

export default function NewContractPage() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const searchParams = Route.useSearch();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch data from server
  const {
    data: serverClients = [],
    isLoading: isLoadingClients,
    error: clientsError,
  } = useClients();

  const {
    data: availableVehicles = [],
    isLoading: isLoadingVehicles,
    error: vehiclesError,
  } = useAvailableVehicles();

  // Mutation for creating contract
  const createContractMutation = useCreateContract();

  // Get date from URL if available
  const dateFromUrl = searchParams.date;

  // Get today's date in YYYY-MM-DD format or use date from URL
  const today = dateFromUrl || new Date().toISOString().split("T")[0];

  // Define form with react-hook-form
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      status: "pending",
      clientId: "",
      vehicleId: "",
      price: "",
      date: today,
      financingType: "cash",
      downPayment: "",
      months: "24",
      monthlyPayment: "",
      notes: "",
    },
    mode: "onChange",
  });

  // Watch form values for calculations
  const financingType = form.watch("financingType");
  const price = form.watch("price");
  const downPayment = form.watch("downPayment");
  const months = form.watch("months");
  const clientId = form.watch("clientId");
  const vehicleId = form.watch("vehicleId");
  const status = form.watch("status");

  // Calculate monthly payment when values change
  useEffect(() => {
    if (financingType === "financing" && price && downPayment && months) {
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
  }, [price, downPayment, months, financingType]);

  // Update selected client when clientId changes
  useEffect(() => {
    if (clientId) {
      // First try to find in server data
      let client = serverClients.find((c) => c.id === clientId);

      // Fallback to sample data if server data not available
      if (!client) {
        client = clients.find((c) => c.id === clientId);
      }

      if (client) {
        setSelectedClient(client);
      }
    }
  }, [clientId, serverClients]);

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
  const onSubmit = async (data: ContractFormValues) => {
    try {
      await createContractMutation.mutateAsync({
        clientId: data.clientId,
        vehicleId: data.vehicleId,
        price: Number.parseFloat(data.price.replace(/[^\d.]/g, "")),
        financingType: data.financingType,
        downPayment: data.downPayment
          ? Number.parseFloat(data.downPayment.replace(/[^\d.]/g, ""))
          : null,
        months: data.months ? Number.parseInt(data.months) : null,
        monthlyPayment: data.monthlyPayment
          ? Number.parseFloat(data.monthlyPayment.replace(/[^\d.]/g, ""))
          : null,
        notes: data.notes || undefined,
        status: data.status,
      });

      toast({
        title: "✅ Contrato creado exitosamente",
        description: "El contrato ha sido generado con éxito.",
      });

      // Navigate back to calendar or contracts list
      setTimeout(() => {
        router.navigate({ to: "/calendar" });
      }, 1500);
    } catch (error) {
      toast({
        title: "Error al crear contrato",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Define wizard steps
  const wizardSteps: WizardStep[] = [
    {
      id: "selection",
      label: "Selección",
      description: "Cliente y vehículo",
      icon: <User className="h-4 w-4" />,
      component: (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <ContractStatusSelector
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2 pb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Estado seleccionado:</span>
              <ContractStatusBadge status={status as any} />
            </div>
          </div>

          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Cliente<span className="text-destructive ml-1">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingClients}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingClients
                            ? "Cargando clientes..."
                            : "Seleccionar cliente"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientsError && (
                      <div className="p-2 text-sm text-destructive">
                        Error cargando clientes. Usando datos de ejemplo.
                      </div>
                    )}
                    {(serverClients.length > 0 ? serverClients : clients).map(
                      (client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.cedula}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
                {clientsError && (
                  <FormDescription className="text-destructive">
                    {getErrorMessage(clientsError)}
                  </FormDescription>
                )}
              </FormItem>
            )}
          />

          {selectedClient && (
            <div className="bg-muted/50 rounded-lg p-4 border">
              <h3 className="font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Detalles del Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nombre:</p>
                  <p className="font-medium">{selectedClient.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cédula:</p>
                  <p className="font-medium">{selectedClient.cedula}</p>
                </div>
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="vehicleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Vehículo<span className="text-destructive ml-1">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);

                    // Only find vehicle from available vehicles - no fallback
                    const vehicle = availableVehicles.find(
                      (v) => v.id === value
                    );

                    if (vehicle) {
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
                              : "Seleccionar vehículo"
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
                          No hay vehículos disponibles para crear contratos
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
              "Debe registrar al menos un vehículo disponible para crear un contrato.",
            variant: "destructive",
          });
          return false;
        }

        const result = await form.trigger(["status", "clientId", "vehicleId"]);
        return result;
      },
    },
    {
      id: "terms",
      label: "Términos",
      description: "Precio y financiamiento",
      icon: <DollarSign className="h-4 w-4" />,
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <CardInput
                    label="Fecha"
                    type="date"
                    icon={
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    }
                    required
                    {...field}
                    error={form.formState.errors.date?.message}
                  />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="financingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Tipo de Financiamiento
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar tipo" />
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

          {financingType === "financing" && (
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
        let result = await form.trigger(["price", "date", "financingType"]);

        if (result && financingType === "financing") {
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
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium mr-2">
                  Estado del Contrato:
                </span>
                <ContractStatusBadge status={status as any} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Datos del Cliente
                  </h4>
                  {selectedClient && (
                    <div className="mt-1 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Nombre:</span>{" "}
                        {selectedClient.name}
                      </p>
                      <p>
                        <span className="font-medium">Cédula:</span>{" "}
                        {selectedClient.cedula}
                      </p>
                    </div>
                  )}
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
                    <span className="font-medium">Fecha:</span>{" "}
                    {new Date(form.getValues("date")).toLocaleDateString(
                      "es-DO"
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Método de Pago:</span>{" "}
                    {form.getValues("financingType") === "cash"
                      ? "Pago Completo"
                      : "Financiamiento"}
                  </p>

                  {form.getValues("financingType") === "financing" && (
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
                  placeholder="Notas o condiciones especiales"
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
        <h1 className="text-3xl font-bold tracking-tight">Crear Contrato</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Wizard
            steps={wizardSteps}
            title="Nuevo Contrato de Venta"
            description="Crea un nuevo contrato de venta para un cliente y vehículo"
            onComplete={form.handleSubmit(onSubmit)}
            cancelHref="/calendar"
            completeText={
              createContractMutation.isPending
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
