import { createFileRoute, useRouter } from "@tanstack/react-router";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Car, User, FileText } from "lucide-react";
import { format, addYears, isValid, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { Wizard } from "~/components/ui/wizard";
import { cn } from "~/lib/utils";
import { useToast } from "~/hooks/use-toast";
import { InsuranceStatusBadge } from "~/components/insurance/insurance-status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState, useEffect } from "react";

// Vehicle type definition
type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  trim?: string;
  color: string;
  vin: string;
  plate: string;
  price: number;
  status: string;
  mileage?: number;
  fuelType: string;
  transmission: string;
  engineSize: string;
  doors: number;
  seats: number;
  images: string[];
  addedDate?: string;
  onSale?: boolean;
  salePrice?: number;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
};

// Sample vehicle data (same structure as in vehicle-grid.tsx)
const vehiclesData: Vehicle[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    trim: "XSE CVT",
    color: "Blanco",
    vin: "1HGCM82633A123456",
    plate: "A123456",
    price: 950000,
    status: "available",
    mileage: 1500,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "1.8L",
    doors: 4,
    seats: 5,
    images: ["/placeholder.svg?key=c3c0u"],
    addedDate: "2023-10-15",
    onSale: true,
    salePrice: 899000,
  },
  {
    id: "2",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    color: "Negro",
    vin: "2HGFG12567H789012",
    plate: "B789012",
    price: 875000,
    status: "sold",
    mileage: 12000,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.0L",
    doors: 4,
    seats: 5,
    images: ["/placeholder.svg?key=d8vlv"],
    addedDate: "2023-09-28",
  },
  {
    id: "3",
    brand: "Hyundai",
    model: "Tucson",
    year: 2023,
    color: "Gris",
    vin: "5NPE24AF1FH123789",
    plate: "C345678",
    price: 1250000,
    status: "reserved",
    mileage: 500,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.0L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=k2tfu"],
    addedDate: "2023-11-05",
  },
  {
    id: "4",
    brand: "Kia",
    model: "Sportage",
    year: 2022,
    color: "Rojo",
    vin: "KNDPB3AC8F7123456",
    plate: "D901234",
    price: 1050000,
    status: "in_process",
    mileage: 3500,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.0L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=r891d"],
    addedDate: "2023-10-22",
  },
  {
    id: "5",
    brand: "Nissan",
    model: "Sentra",
    year: 2023,
    color: "Azul",
    vin: "3N1AB7AP3FY123456",
    plate: "E567890",
    price: 925000,
    status: "maintenance",
    mileage: 1200,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "1.8L",
    doors: 4,
    seats: 5,
    images: ["/placeholder.svg?key=m00c3"],
    addedDate: "2023-11-10",
  },
  {
    id: "6",
    brand: "Toyota",
    model: "RAV4",
    year: 2023,
    color: "Plata",
    vin: "JTMWFREV0JD123456",
    plate: "F123456",
    price: 1350000,
    status: "available",
    mileage: 800,
    fuelType: "Gasolina",
    transmission: "Automática",
    engineSize: "2.5L",
    doors: 5,
    seats: 5,
    images: ["/placeholder.svg?key=3bpp8"],
    addedDate: "2023-10-05",
    onSale: true,
    salePrice: 1299000,
  },
];

// Sample client data
const clientsData = [
  {
    id: "client1",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    cedula: "001-1234567-8",
  },
  {
    id: "client2",
    name: "María Rodríguez",
    email: "maria.rodriguez@example.com",
    cedula: "002-7654321-9",
  },
  {
    id: "client3",
    name: "Carlos Méndez",
    email: "carlos.mendez@example.com",
    cedula: "003-9876543-0",
  },
  {
    id: "client4",
    name: "Ana Martínez",
    email: "ana.martinez@example.com",
    cedula: "004-8765432-1",
  },
  {
    id: "client5",
    name: "Roberto Sánchez",
    email: "roberto.sanchez@example.com",
    cedula: "005-5678901-2",
  },
];

// Sample contract data
const contractsData = [
  {
    id: "contract1",
    number: "CTR-2024-0009",
    description: "Financiamiento Toyota Corolla",
    clientId: "client1",
  },
  {
    id: "contract2",
    number: "CTR-2024-0023",
    description: "Leasing Honda Civic",
    clientId: "client2",
  },
  {
    id: "contract3",
    number: "CTR-2023-0156",
    description: "Financiamiento Kia Sportage",
    clientId: "client3",
  },
  {
    id: "contract4",
    number: "CTR-2023-0078",
    description: "Financiamiento Nissan Frontier",
    clientId: "client5",
  },
  {
    id: "contract5",
    number: "CTR-2024-0045",
    description: "Leasing Jeep Wrangler",
    clientId: "client4",
  },
];

// Helper function to safely format dates
const safeFormatDate = (
  date: Date | null | undefined,
  formatStr: string
): string => {
  if (!date) return "No especificado";
  if (!(date instanceof Date)) return "Fecha inválida";
  if (!isValid(date)) return "Fecha inválida";
  try {
    return format(date, formatStr, { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error de formato";
  }
};

// Helper function to check if a date is valid
const isValidDate = (date: any): boolean => {
  return date instanceof Date && isValid(date);
};

// Form schema with coverageDuration field
const formSchema = z.object({
  vehicleId: z.string().min(1, "Selecciona un vehículo"),
  vehicleInfo: z.string().min(1, "Selecciona un vehículo"),
  vin: z.string().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  contractId: z.string().optional(),
  startDate: z.date({
    message: "Selecciona una fecha de inicio",
    invalid_type_error: "Fecha inválida",
  }),
  expiryDate: z.date({
    message: "Selecciona una fecha de vencimiento",
    invalid_type_error: "Fecha inválida",
  }),
  coverageType: z.enum(["motor_transmission", "full", "basic"], {
    message: "Selecciona un tipo de cobertura",
  }),
  coverageDuration: z.string({
    message: "Selecciona la duración de la cobertura",
  }),
  premium: z
    .number({
      message: "Ingresa el monto de la prima",
    })
    .min(1, "El monto debe ser mayor a 0"),
  status: z.enum(["active", "expiring_soon", "expired", "cancelled"], {
    message: "Selecciona un estado",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/_authed/insurance/new")({
  component: NewInsurancePage,
});

export default function NewInsurancePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<typeof clientsData>([]);
  const [contracts, setContracts] = useState<typeof contractsData>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingContracts, setIsLoadingContracts] = useState(true);

  // Create valid default dates
  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);

  // Load vehicles data
  useEffect(() => {
    // Simulate API call to fetch vehicles
    const timer = setTimeout(() => {
      setVehicles(vehiclesData);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Load clients and contracts data
  useEffect(() => {
    // Simulate API call to fetch clients and contracts
    const timer = setTimeout(() => {
      setClients(clientsData);
      setContracts(contractsData);
      setIsLoadingClients(false);
      setIsLoadingContracts(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Default form values
  const defaultValues: Partial<FormValues> = {
    vehicleId: "",
    vehicleInfo: "",
    vin: "",
    clientName: "",
    clientEmail: "",
    contractId: "",
    startDate: today,
    expiryDate: nextYear,
    coverageType: "motor_transmission",
    coverageDuration: "12",
    status: "active",
    premium: 25000,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Show success toast
    toast({
      title: "✅ Seguro creado exitosamente",
      description: `Se ha creado un nuevo seguro para ${data.vehicleInfo}`,
      variant: "success",
    });

    // Redirect to insurance list
    setTimeout(() => {
      router.navigate({ to: "/insurance" });
    }, 1000);
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    selected: {
      scale: 1,
      opacity: 1,
      boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f8fafc",
      borderColor: "#2563eb",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Validation functions for each step
  const validateVehicleStep = async () => {
    return await form.trigger(["vehicleId", "vehicleInfo", "vin"]);
  };

  const validateClientStep = async () => {
    // Client fields are optional, so we don't need to validate them
    return true;
  };

  const validateDatesStep = async () => {
    return await form.trigger([
      "startDate",
      "expiryDate",
      "coverageType",
      "coverageDuration",
      "premium",
    ]);
  };

  // Safely get date values from form
  const getStartDate = (): Date => {
    const date = form.getValues("startDate");
    return isValidDate(date) ? date : today;
  };

  const getExpiryDate = (): Date => {
    const date = form.getValues("expiryDate");
    return isValidDate(date) ? date : nextYear;
  };

  // Handle coverage duration change
  const handleCoverageDurationChange = (value: string) => {
    form.setValue("coverageDuration", value);

    const startDate = getStartDate();
    let expiryDate: Date;

    // Calculate expiry date based on selected duration
    switch (value) {
      case "3":
        expiryDate = addMonths(startDate, 3);
        break;
      case "6":
        expiryDate = addMonths(startDate, 6);
        break;
      case "12":
      default:
        expiryDate = addYears(startDate, 1);
        break;
      case "24":
        expiryDate = addYears(startDate, 2);
        break;
      case "36":
        expiryDate = addYears(startDate, 3);
        break;
    }

    if (isValidDate(expiryDate)) {
      form.setValue("expiryDate", expiryDate);
    }
  };

  // Wizard steps
  const steps = [
    {
      id: "vehicle",
      label: "Vehículo",
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Seleccionar vehículo
            </h2>

            {/* Hidden field for vehicle ID */}
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehículo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedVehicle = vehicles.find(
                        (v) => v.id === value
                      );
                      if (selectedVehicle) {
                        // Update form values in a single batch to prevent multiple re-renders
                        form.setValue("vehicleId", value, {
                          shouldValidate: false,
                        });
                        form.setValue(
                          "vin",
                          selectedVehicle.vin || selectedVehicle.plate,
                          { shouldValidate: false }
                        );

                        // Format the vehicle info display and update the form field
                        const vehicleInfo = `${selectedVehicle.brand} ${selectedVehicle.model} ${selectedVehicle.year}`;
                        field.onChange(vehicleInfo);

                        // Trigger validation after all updates are complete
                        setTimeout(
                          () =>
                            form.trigger(["vehicleId", "vehicleInfo", "vin"]),
                          0
                        );
                      }
                    }}
                    // Use a stable reference for the value to prevent infinite loops
                    value={form.getValues("vehicleId")}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un vehículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>
                          Cargando vehículos...
                        </SelectItem>
                      ) : vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.brand} {vehicle.model} {vehicle.year} -{" "}
                            {vehicle.color}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          No hay vehículos disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecciona un vehículo del inventario
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN/Placa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1HGCM82633A123456"
                      {...field}
                      readOnly
                      className="bg-muted/30"
                    />
                  </FormControl>
                  <FormDescription>
                    Número de identificación del vehículo o placa (se completa
                    automáticamente)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ),
      validate: validateVehicleStep,
    },
    {
      id: "client",
      label: "Cliente",
      component: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Asociar cliente (opcional)
          </h2>

          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del cliente</FormLabel>
                <Select
                  onValueChange={(value) => {
                    // Find the selected client
                    const selectedClient = clients.find(
                      (client) => client.name === value
                    );
                    if (selectedClient) {
                      // Update client name
                      field.onChange(value);

                      // Auto-populate email field
                      form.setValue("clientEmail", selectedClient.email);
                    }
                  }}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingClients ? (
                      <SelectItem value="loading" disabled>
                        Cargando clientes...
                      </SelectItem>
                    ) : clients.length > 0 ? (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.name}>
                          {client.name} - {client.cedula}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        No hay clientes disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecciona un cliente del sistema
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email del cliente</FormLabel>
                <FormControl>
                  <Input
                    placeholder="cliente@ejemplo.com"
                    {...field}
                    readOnly={!!field.value}
                    className={field.value ? "bg-muted/30" : ""}
                  />
                </FormControl>
                <FormDescription>
                  Correo electrónico del cliente (se completa automáticamente)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contractId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contrato asociado (opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un contrato (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingContracts ? (
                      <SelectItem value="loading" disabled>
                        Cargando contratos...
                      </SelectItem>
                    ) : contracts.length > 0 ? (
                      contracts.map((contract) => (
                        <SelectItem key={contract.id} value={contract.number}>
                          {contract.number} - {contract.description}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        No hay contratos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  ID del contrato relacionado con este seguro
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
      validate: validateClientStep,
    },
    {
      id: "dates",
      label: "Fechas",
      component: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Confirmación de fechas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de inicio</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          type="button"
                        >
                          {isValidDate(field.value) ? (
                            safeFormatDate(field.value, "PPP")
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          isValidDate(field.value) ? field.value : undefined
                        }
                        onSelect={(date) => {
                          if (date && isValidDate(date)) {
                            field.onChange(date);

                            // Update the expiry date based on the selected coverage duration
                            const duration =
                              form.getValues("coverageDuration") || "12";
                            let newExpiryDate: Date;

                            switch (duration) {
                              case "3":
                                newExpiryDate = addMonths(date, 3);
                                break;
                              case "6":
                                newExpiryDate = addMonths(date, 6);
                                break;
                              case "12":
                              default:
                                newExpiryDate = addYears(date, 1);
                                break;
                              case "24":
                                newExpiryDate = addYears(date, 2);
                                break;
                              case "36":
                                newExpiryDate = addYears(date, 3);
                                break;
                            }

                            if (isValidDate(newExpiryDate)) {
                              form.setValue("expiryDate", newExpiryDate);
                            }
                          }
                        }}
                        disabled={(date) => {
                          const yesterday = new Date();
                          yesterday.setDate(yesterday.getDate() - 1);
                          return date < yesterday;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Fecha en que inicia la cobertura
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverageDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración de la cobertura</FormLabel>
                  <Select
                    onValueChange={handleCoverageDurationChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona la duración" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3">3 meses</SelectItem>
                      <SelectItem value="6">6 meses</SelectItem>
                      <SelectItem value="12">1 año</SelectItem>
                      <SelectItem value="24">2 años</SelectItem>
                      <SelectItem value="36">3 años</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Período de vigencia del seguro
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de vencimiento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal transition-all duration-300",
                            !field.value && "text-muted-foreground"
                          )}
                          type="button"
                        >
                          {isValidDate(field.value) ? (
                            safeFormatDate(field.value, "PPP")
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          isValidDate(field.value) ? field.value : undefined
                        }
                        onSelect={(date) => {
                          if (date && isValidDate(date)) {
                            field.onChange(date);
                          }
                        }}
                        disabled={(date) => {
                          const startDate = getStartDate();
                          const yesterday = new Date();
                          yesterday.setDate(yesterday.getDate() - 1);
                          return date <= startDate || date < yesterday;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Fecha en que termina la cobertura
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de cobertura</FormLabel>
                  <div className="w-full bg-muted/30 p-4 rounded-md border">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                      <div className="font-medium">Motor y Transmisión</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Cubre daños al motor y la transmisión del vehículo.
                    </p>
                  </div>
                  <FormDescription>
                    Tipo de cobertura disponible actualmente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="premium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prima del seguro (DOP)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="25000"
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? 0 : Number.parseFloat(value)
                      );
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Monto a pagar por la cobertura
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
      validate: validateDatesStep,
    },
    {
      id: "confirm",
      label: "Confirmar",
      component: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Confirmar información
          </h2>
          <motion.div
            className="border rounded-lg p-4 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Resumen del seguro</h3>
              <InsuranceStatusBadge status={form.getValues("status")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Car className="h-4 w-4" /> Información del vehículo
                </h4>
                <div className="mt-2 text-sm">
                  <p>
                    <span className="font-medium">Vehículo:</span>{" "}
                    {form.getValues("vehicleInfo") || "No especificado"}
                  </p>
                  <p>
                    <span className="font-medium">VIN/Placa:</span>{" "}
                    {form.getValues("vin") || "No especificado"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> Información del cliente
                </h4>
                <div className="mt-2 text-sm">
                  <p>
                    <span className="font-medium">Nombre:</span>{" "}
                    {form.getValues("clientName") || "No especificado"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {form.getValues("clientEmail") || "No especificado"}
                  </p>
                  <p>
                    <span className="font-medium">Contrato:</span>{" "}
                    {form.getValues("contractId") || "No asociado"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" /> Fechas de cobertura
                </h4>
                <div className="mt-2 text-sm">
                  <p>
                    <span className="font-medium">Inicio:</span>{" "}
                    {safeFormatDate(getStartDate(), "PPP")}
                  </p>
                  <p>
                    <span className="font-medium">Duración:</span>{" "}
                    {(() => {
                      switch (form.getValues("coverageDuration")) {
                        case "3":
                          return "3 meses";
                        case "6":
                          return "6 meses";
                        case "12":
                          return "1 año";
                        case "24":
                          return "2 años";
                        case "36":
                          return "3 años";
                        default:
                          return "1 año";
                      }
                    })()}
                  </p>
                  <p>
                    <span className="font-medium">Vencimiento:</span>{" "}
                    {safeFormatDate(getExpiryDate(), "PPP")}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Detalles de la póliza
                </h4>
                <div className="mt-2 text-sm">
                  <p>
                    <span className="font-medium">Cobertura:</span> Motor y
                    Transmisión
                  </p>
                  <p>
                    <span className="font-medium">Prima:</span>{" "}
                    {form.getValues("premium")
                      ? `DOP ${form.getValues("premium").toLocaleString()}`
                      : "No especificado"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="border border-amber-200 bg-amber-50 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <p className="text-sm text-amber-800">
              Al hacer clic en "Completar", se creará un nuevo seguro con la
              información proporcionada. Asegúrate de que todos los datos sean
              correctos antes de continuar.
            </p>
          </motion.div>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className="max-w-4xl mx-auto p-8"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Seguro</h1>
        <p className="text-muted-foreground">
          Crea una nueva póliza de seguro para un vehículo
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="insurance-form">
          <Wizard
            steps={steps}
            onComplete={() => {
              const formElement = document.getElementById(
                "insurance-form"
              ) as HTMLFormElement;
              if (formElement) {
                formElement.requestSubmit();
              }
            }}
            completeText="Completar"
            nextText="Siguiente"
            backText="Anterior"
            cancelHref="/insurance"
            cancelText="Cancelar"
          />
        </form>
      </Form>
    </motion.div>
  );
}
