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
import { Car, Wrench, DollarSign, Users } from "lucide-react";
import {
  vehicleFormSchema,
  type VehicleFormValues,
} from "~/components/vehicles/new-vehicle-schema";

export const Route = createFileRoute("/_authed/vehicles/register")({
  component: RegisterVehiclePage,
});

function RegisterVehiclePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [addAnother, setAddAnother] = useState(false);

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

  // Handle form submission
  const onSubmit = (data: VehicleFormValues) => {
    console.log("Form submitted:", data);

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
