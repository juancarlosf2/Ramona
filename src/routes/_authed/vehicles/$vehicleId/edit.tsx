"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Wizard, type WizardStep } from "~/components/ui/wizard";
import { VehicleGeneralInfoForm } from "~/components/vehicles/vehicle-general-info-form";
import { VehicleTechnicalSpecsForm } from "~/components/vehicles/vehicle-technical-specs-form";
import { VehicleFinancialForm } from "~/components/vehicles/vehicle-financial-form";
import { VehicleAssociationsForm } from "~/components/vehicles/vehicle-associations-form";
import { useToast } from "~/hooks/use-toast";
import { Car, Wrench, DollarSign, Users } from "lucide-react";
import { createFileRoute, useRouter } from "@tanstack/react-router";

// Define the form schema with Zod
const vehicleFormSchema = z.object({
  // Step 1: General Information
  brand: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  year: z.string().min(4, "El año es requerido"),
  trim: z.string().optional(),
  vehicleType: z.string().min(1, "El tipo de vehículo es requerido"),
  color: z.string().min(1, "El color es requerido"),
  status: z.string().min(1, "El estado es requerido"),
  condition: z.string().min(1, "La condición es requerida"),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),

  // Step 2: Technical Specifications
  transmission: z.string().min(1, "La transmisión es requerida"),
  fuelType: z.string().min(1, "El tipo de combustible es requerido"),
  engineSize: z.string().min(1, "El tamaño del motor es requerido"),
  plate: z.string().optional(),
  vin: z
    .string()
    .min(17, "El VIN debe tener 17 caracteres")
    .max(17, "El VIN debe tener 17 caracteres"),
  mileage: z.number().optional(),
  doors: z.number().min(1, "El número de puertas es requerido"),
  seats: z.number().min(1, "El número de asientos es requerido"),

  // Step 3: Financial and Administrative
  price: z.string().min(1, "El precio es requerido"),
  hasOffer: z.boolean().default(false),
  offerPrice: z.string().optional(),
  adminStatus: z.string().optional(),
  inMaintenance: z.boolean().default(false),
  entryDate: z.date().optional(),

  // Step 4: Associations (Optional)
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  contractId: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

// Sample vehicle data for editing
const vehicleData = {
  id: "1",
  brand: "Toyota",
  model: "Corolla",
  year: "2022",
  trim: "XSE CVT",
  vehicleType: "Sedán",
  color: "Blanco",
  status: "available",
  condition: "new",
  images: ["/placeholder.svg?key=c3c0u"],
  description: "Vehículo en excelentes condiciones",

  transmission: "Automática",
  fuelType: "Gasolina",
  engineSize: "1.8L",
  plate: "A123456",
  vin: "1HGCM82633A123456",
  mileage: 1500,
  doors: 4,
  seats: 5,

  price: "950000",
  hasOffer: true,
  offerPrice: "899000",
  adminStatus: "",
  inMaintenance: false,
  entryDate: new Date("2023-10-15"),

  clientId: "",
  clientName: "",
  contractId: "",
};

export const Route = createFileRoute("/_authed/vehicles/$vehicleId/edit")({
  component: EditVehiclePage,
});

export default function EditVehiclePage() {
  const router = useRouter();
  const { vehicleId: id } = Route.useParams();

  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Define form with react-hook-form
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear().toString(),
      trim: "",
      vehicleType: "",
      color: "",
      status: "available",
      condition: "new",
      images: [],
      description: "",

      transmission: "",
      fuelType: "",
      engineSize: "",
      plate: "",
      vin: "",
      mileage: 0,
      doors: 4,
      seats: 5,

      price: "",
      hasOffer: false,
      offerPrice: "",
      adminStatus: "",
      inMaintenance: false,
      entryDate: new Date(),

      clientId: "",
      clientName: "",
      contractId: "",
    },
    mode: "onChange",
  });

  // Load vehicle data
  useEffect(() => {
    // Simulate API call to fetch vehicle data
    const timer = setTimeout(() => {
      // In a real app, you would fetch the vehicle data based on the ID
      form.reset(vehicleData);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id, form]);

  // Handle form submission
  const onSubmit = (data: VehicleFormValues) => {
    console.log("Form submitted:", data);

    // Show success toast
    toast({
      title: "¡Éxito!",
      description: `Vehículo actualizado correctamente.`,
      variant: "success",
    });

    // Redirect to vehicle details
    setTimeout(() => {
      router.navigate({
        to: `/vehicles/$vehicleId`,
        params: { vehicleId: id },
      });
    }, 1500);
  };

  // Define wizard steps
  const steps: WizardStep[] = [
    {
      id: "general-info",
      label: "Información General",
      description: "Datos básicos del vehículo",
      icon: <Car className="h-4 w-4" />,
      component: <VehicleGeneralInfoForm form={form} />,
      validate: async () => {
        const result = await form.trigger(
          [
            "brand",
            "model",
            "year",
            "vehicleType",
            "color",
            "status",
            "condition",
          ],
          {
            shouldFocus: true,
          }
        );
        return result;
      },
    },
    {
      id: "technical-specs",
      label: "Especificaciones Técnicas",
      description: "Detalles técnicos del vehículo",
      icon: <Wrench className="h-4 w-4" />,
      component: <VehicleTechnicalSpecsForm form={form} />,
      validate: async () => {
        const result = await form.trigger(
          ["transmission", "fuelType", "engineSize", "vin", "doors", "seats"],
          {
            shouldFocus: true,
          }
        );
        return result;
      },
    },
    {
      id: "financial-admin",
      label: "Datos Financieros",
      description: "Información financiera y administrativa",
      icon: <DollarSign className="h-4 w-4" />,
      component: <VehicleFinancialForm form={form} />,
      validate: async () => {
        const result = await form.trigger(["price"], { shouldFocus: true });
        return result;
      },
    },
    {
      id: "associations",
      label: "Asociaciones",
      description: "Asociar a cliente o contrato (opcional)",
      icon: <Users className="h-4 w-4" />,
      optional: true,
      component: (
        <VehicleAssociationsForm
          form={form}
          onAddAnother={() => {}}
          addAnother={false}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded mb-6"></div>
        <div className="h-[600px] bg-muted rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 animate-in fade-in-50 duration-500">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Editar Vehículo
      </h1>

      <Wizard
        steps={steps}
        onComplete={form.handleSubmit(onSubmit)}
        cancelHref={`/vehicles/${id}`}
        completeText="Guardar Cambios"
        nextText="Continuar"
        backText="Anterior"
        cancelText="Cancelar"
        showStepSummary={true}
        autoSave={true}
        className="shadow-lg border-0 rounded-xl overflow-hidden"
      />
    </div>
  );
}
