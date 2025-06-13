import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "@tanstack/react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useCreateConcesionario } from "~/hooks/useSupabaseData";
import { toast } from "~/hooks/use-toast";

// Define the form schema
const concesionarioFormSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre del concesionario es requerido")
    .max(100, "El nombre es demasiado largo"),
  contactName: z
    .string()
    .min(2, "El nombre del contacto es requerido")
    .max(100, "El nombre es demasiado largo"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: "El teléfono debe tener al menos 10 dígitos",
    }),
  address: z
    .string()
    .min(5, "La dirección es requerida")
    .max(200, "La dirección es demasiado larga"),
});

type ConcesionarioFormValues = z.infer<typeof concesionarioFormSchema>;

interface NewConcesionarioFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NewConcesionarioForm({
  onSuccess,
  onCancel,
}: NewConcesionarioFormProps) {
  const router = useRouter();
  const createConcesionario = useCreateConcesionario();

  const form = useForm<ConcesionarioFormValues>({
    resolver: zodResolver(concesionarioFormSchema),
    defaultValues: {
      name: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ConcesionarioFormValues) => {
    try {
      // Convert empty strings to undefined for optional fields
      const submitData = {
        ...data,
        email: data.email || undefined,
        phone: data.phone || undefined,
      };

      await createConcesionario.mutateAsync(submitData);

      toast({
        title: "¡Éxito!",
        description: "Concesionario creado exitosamente.",
        variant: "success",
      });

      // Reset form
      form.reset();

      // Call success callback or navigate
      if (onSuccess) {
        onSuccess();
      } else {
        router.navigate({ to: "/consignments" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          "Error al crear el concesionario. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.navigate({ to: "/consignments" });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Nuevo Concesionario</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Registra un nuevo concesionario para gestionar vehículos en
          consignación
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información del Negocio
              </h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Concesionario *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Auto Central, Vehículos del Norte, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Dirección *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dirección completa del concesionario"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Información de Contacto
              </h3>

              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Contacto *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre completo del contacto principal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contacto@concesionario.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(809) 123-4567"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createConcesionario.isPending}
                className="flex items-center gap-2 flex-1"
              >
                {createConcesionario.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {createConcesionario.isPending
                  ? "Guardando..."
                  : "Crear Concesionario"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
