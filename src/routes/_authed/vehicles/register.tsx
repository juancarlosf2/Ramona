import { createFileRoute, useRouter } from "@tanstack/react-router";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { Wizard, type WizardStep } from "~/components/ui/wizard";
import { VehicleGeneralInfoForm } from "~/components/vehicles/vehicle-general-info-form";
import { VehicleTechnicalSpecsForm } from "~/components/vehicles/vehicle-technical-specs-form";
import { VehicleFinancialForm } from "~/components/vehicles/vehicle-financial-form";
import { VehicleAssociationsForm } from "~/components/vehicles/vehicle-associations-form";
import { useToast } from "~/hooks/use-toast";
import { useCreateVehicle } from "~/hooks/useSupabaseData";
import { Car, Wrench, DollarSign, Users } from "lucide-react";
import {
  vehicleFormSchema,
  type VehicleFormValues,
} from "~/components/vehicles/new-vehicle-schema";
import { parseCurrency } from "~/lib/utils";

export const Route = createFileRoute("/_authed/vehicles/register")({
  component: RegisterVehiclePage,
});

function RegisterVehiclePage() {
  const router = useRouter();
  const { toast } = useToast();
  const createVehicle = useCreateVehicle();
  const [currentStep, setCurrentStep] = useState(0);
  const [addAnother, setAddAnother] = useState(false);

  // Define form with react-hook-form
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema), // Temporary fix for Zod v4 type compatibility
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
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
      entryDate: new Date().toISOString(),

      clientId: "",
      clientName: "",
      contractId: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: VehicleFormValues) => {
    console.log("Form submitted:", data);

    // Prepare data for server submission
    const vehicleData = {
      brand: data.brand,
      model: data.model,
      year: data.year, // Already a number from form schema
      trim: data.trim || undefined,
      vehicleType: data.vehicleType,
      color: data.color,
      status: data.status as
        | "available"
        | "sold"
        | "reserved"
        | "in_process"
        | "maintenance",
      condition: data.condition as "new" | "used",
      images: data.images || [],
      description: data.description || undefined,
      transmission: data.transmission,
      fuelType: data.fuelType,
      engineSize: data.engineSize,
      plate: data.plate || undefined,
      vin: data.vin,
      mileage: data.mileage || null,
      doors: data.doors,
      seats: data.seats,
      price: parseCurrency(data.price),
      hasOffer: data.hasOffer,
      offerPrice: data.offerPrice ? parseCurrency(data.offerPrice) : null,
      adminStatus: data.adminStatus || undefined,
      inMaintenance: data.inMaintenance,
      entryDate: data.entryDate || null, // Keep as Date object for API
      concesionarioId: undefined, // Will be handled in associations step
    };

    // Create the vehicle using the mutation
    createVehicle.mutate(vehicleData, {
      onSuccess: (createdVehicle) => {
        // Show success toast
        let toastMessage = "Vehículo registrado exitosamente.";
        if (data.clientName) {
          toastMessage += ` Asociado a ${data.clientName}.`;
        }

        toast({
          title: "¡Éxito!",
          description: toastMessage,
          variant: "success",
        });

        // Redirect based on user choice
        setTimeout(() => {
          if (addAnother) {
            // Reset form and stay on page
            form.reset();
            setCurrentStep(0);
          } else if (data.clientId && data.contractId) {
            // Go to contract
            router.navigate({
              to: `/contracts/$contractId`,
              params: { contractId: data.contractId },
            });
          } else {
            // Go back to vehicles list
            router.navigate({ to: "/vehicles" });
          }
        }, 1500);
      },
      onError: (error: any) => {
        console.error("Error creating vehicle:", error);
        toast({
          title: "Error",
          description:
            error.message ||
            "Error al registrar el vehículo. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      },
    });
  };

  // Define wizard steps with only titles, no descriptions
  const steps: WizardStep[] = [
    {
      id: "general-info",
      label: "Datos basicos",
      icon: <Car className="h-4 w-4" />,
      component: (
        <Form {...form}>
          <VehicleGeneralInfoForm form={form} />
        </Form>
      ),
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
      label: "Detalles tecnicos",
      icon: <Wrench className="h-4 w-4" />,
      component: (
        <Form {...form}>
          <VehicleTechnicalSpecsForm form={form} />
        </Form>
      ),
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
      label: "Informacion financiera",
      icon: <DollarSign className="h-4 w-4" />,
      component: (
        <Form {...form}>
          <VehicleFinancialForm form={form} />
        </Form>
      ),
      validate: async () => {
        const result = await form.trigger(["price", "entryDate"], {
          shouldFocus: true,
        });
        return result;
      },
    },
    {
      id: "associations",
      label: "Asociaciones (opcional)",
      icon: <Users className="h-4 w-4" />,
      optional: true,
      component: (
        <Form {...form}>
          <VehicleAssociationsForm
            form={form}
            onAddAnother={(value) => setAddAnother(value)}
            addAnother={addAnother}
          />
        </Form>
      ),
    },
  ];

  return (
    <div className="container py-8 animate-in fade-in-50 duration-500">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Agregar Nuevo Vehículo
      </h1>

      <Wizard
        steps={steps}
        onComplete={form.handleSubmit(onSubmit)}
        cancelHref="/vehicles"
        completeText="Guardar Vehículo"
        nextText="Continuar"
        backText="Anterior"
        cancelText="Cancelar"
        showStepSummary={false}
        autoSave={true}
        className="shadow-lg border-0 rounded-xl overflow-hidden"
      />
    </div>
  );
}
