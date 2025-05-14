import type React from "react";

import { useState, useEffect } from "react";
import {
  Check,
  X,
  Mail,
  Phone,
  CreditCard,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { getInitials } from "~/lib/utils";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";

interface ClientEditFormProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    cedula: string;
    address: string;
  };
  onSave: (updatedClient: any) => void;
  onCancel: () => void;
}

export function ClientEditForm({
  client,
  onSave,
  onCancel,
}: ClientEditFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ ...client });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "phone") {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setHasChanges(true);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (
      formData.phone &&
      !/^\d{3}-\d{3}-\d{4}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Formato de teléfono inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Shake fields with errors
      document.querySelectorAll(".error-shake").forEach((el) => {
        el.classList.add("animate-shake");
        setTimeout(() => el.classList.remove("animate-shake"), 500);
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      toast({
        title: "Información actualizada",
        description:
          "Los datos del cliente han sido actualizados exitosamente.",
        variant: "success",
      });
    }, 800);
  };

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 animate-in fade-in duration-300"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative group">
          <Avatar className="h-16 w-16 border-4 border-background bg-primary/10 transition-all group-hover:opacity-80">
            <AvatarFallback className="text-xl font-semibold text-primary">
              {getInitials(formData.name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/60 rounded-full h-full w-full flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Label
            htmlFor="name"
            className="text-sm font-medium text-muted-foreground mb-1 block"
          >
            Nombre completo
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={cn(
              "h-10 text-lg font-semibold transition-all focus-visible:ring-primary",
              errors.name &&
                "border-destructive focus-visible:ring-destructive error-shake"
            )}
            autoFocus
          />
          {errors.name && (
            <div className="flex items-center mt-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.name}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label
            htmlFor="email"
            className="text-sm font-medium text-muted-foreground mb-1 block"
          >
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={cn(
                "pl-10 transition-all focus-visible:ring-primary",
                errors.email &&
                  "border-destructive focus-visible:ring-destructive error-shake"
              )}
            />
          </div>
          {errors.email && (
            <div className="flex items-center mt-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <Label
            htmlFor="phone"
            className="text-sm font-medium text-muted-foreground mb-1 block"
          >
            Teléfono
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={cn(
                "pl-10 transition-all focus-visible:ring-primary",
                errors.phone &&
                  "border-destructive focus-visible:ring-destructive error-shake"
              )}
            />
          </div>
          {errors.phone && (
            <div className="flex items-center mt-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.phone}
            </div>
          )}
        </div>

        <div>
          <Label
            htmlFor="cedula"
            className="text-sm font-medium text-muted-foreground mb-1 block"
          >
            Cédula / RNC
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="cedula"
              name="cedula"
              value={formData.cedula}
              disabled
              className="pl-10 bg-muted/50 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            La cédula no puede ser modificada. Contacte a un administrador.
          </p>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="gap-1"
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
          Cancelar
        </Button>
        <Button
          type="submit"
          className="gap-1"
          disabled={isSubmitting || !hasChanges}
        >
          <Check className="h-4 w-4" />
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
