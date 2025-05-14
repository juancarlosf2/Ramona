import type React from "react";

import { useState, useCallback } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCircle2,
  PlusCircle,
  XCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import confetti from "canvas-confetti";

import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";
import { cn, getInitials } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

// Sample data
const data: User[] = [
  {
    id: "1",
    name: "Admin Principal",
    email: "admin@example.com",
    phone: "(809) 555-1234",
    role: "admin",
    status: "active",
  },
  {
    id: "2",
    name: "Juan Vendedor",
    email: "juan.vendedor@example.com",
    phone: "(809) 555-2345",
    role: "sales",
    status: "active",
  },
  {
    id: "3",
    name: "María Finanzas",
    email: "maria.finanzas@example.com",
    phone: "(809) 555-3456",
    role: "finance",
    status: "active",
  },
  {
    id: "4",
    name: "Carlos Inventario",
    email: "carlos.inventario@example.com",
    phone: "(809) 555-4567",
    role: "inventory",
    status: "inactive",
  },
];

// User type
type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "sales" | "finance" | "inventory";
  status: "active" | "inactive";
};

// Form state type
type FormState = {
  name: string;
  email: string;
  phone: string;
  role: User["role"] | "";
  status: User["status"] | "";
};

// Form validation type
type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
};

// Generate a consistent color based on the user's name
function generateAvatarColor(name: string): string {
  // Define a set of pleasant background colors
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  // Create a simple hash of the name to get a consistent index
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to select a color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// Role badge component
function RoleBadge({ role }: { role: User["role"] }) {
  const roleMap: Record<User["role"], { label: string; className: string }> = {
    admin: {
      label: "Administrador",
      className: "bg-indigo-100 text-indigo-700 border border-indigo-300",
    },
    sales: {
      label: "Ventas",
      className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    },
    finance: {
      label: "Finanzas",
      className: "bg-emerald-100 text-emerald-700 border border-emerald-300",
    },
    inventory: {
      label: "Inventario",
      className: "bg-rose-100 text-rose-700 border border-rose-300",
    },
  };

  const { label, className } = roleMap[role];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

// Phone input mask function
function formatPhoneNumber(value: string): string {
  if (!value) return value;

  // Remove all non-digits
  const phoneNumber = value.replace(/[^\d]/g, "");

  // Format the phone number
  if (phoneNumber.length < 4) {
    return `(${phoneNumber}`;
  } else if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
}

// Validate email function
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Launch confetti function
function launchConfetti() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return; // Skip confetti for users who prefer reduced motion
  }

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.3 },
    colors: ["#7C3AED", "#F59E0B", "#10B981", "#3B82F6"],
    scalar: 1.2,
    ticks: 200,
  });
}

export function UserTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "active",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const { toast } = useToast();

  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Define these functions at the component level so they have access to state
  const handleEditUser = useCallback((user: User) => {
    setUserToEdit(user);
    setIsEditMode(true);
    setFormState({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      status: user.status,
    });
    setIsDialogOpen(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  }, []);

  const confirmDeleteUser = () => {
    if (!userToDelete) return;

    // In a real app, you would call an API to delete the user
    // For now, we'll just show a toast

    toast({
      title: "Usuario eliminado",
      description: `${userToDelete.name} ha sido eliminado del sistema.`,
      variant: "default",
    });

    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  // Define columns inside the component to access the handlers
  const columns: ColumnDef<User>[] = [
    {
      id: "avatar",
      header: "",
      cell: ({ row }) => {
        const user = row.original;
        const initials = getInitials(user.name);
        const colorClass = generateAvatarColor(user.name);

        return (
          <Avatar className="h-9 w-9">
            <AvatarFallback
              className={`${colorClass} text-white text-sm font-medium`}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => <div>{row.getValue("phone") || "-"}</div>,
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => {
        return <RoleBadge role={row.getValue("role")} />;
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
              status === "active"
                ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                : "bg-slate-200 text-slate-800 border border-slate-300"
            }`}
          >
            {status === "active" ? "Activo" : "Inactivo"}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-2 justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditUser(user)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteUser(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eliminar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const validateField = (name: keyof FormState, value: string) => {
    if (name === "name" && !value.trim()) {
      return "El nombre es requerido";
    }

    if (name === "email") {
      if (!value.trim()) {
        return "El correo electrónico es requerido";
      }
      if (!validateEmail(value)) {
        return "Ingrese un correo electrónico válido";
      }
    }

    if (name === "role" && !value) {
      return "Seleccione un rol";
    }

    if (name === "status" && !value) {
      return "Seleccione un estado";
    }

    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormState({
        ...formState,
        [name]: formatPhoneNumber(value),
      });
    } else {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState({
      ...formState,
      [name]: value,
    });

    // Validate on change for select fields
    const error = validateField(name as keyof FormState, value);
    setErrors({
      ...errors,
      [name]: error,
    });

    setTouchedFields({
      ...touchedFields,
      [name]: true,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouchedFields({
      ...touchedFields,
      [name]: true,
    });

    // Validate on blur
    const error = validateField(name as keyof FormState, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate all fields
    Object.entries(formState).forEach(([key, value]) => {
      const fieldName = key as keyof FormState;
      const error = validateField(fieldName, value);

      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Mark all fields as touched to show errors
      const allTouched: Record<string, boolean> = {};
      Object.keys(formState).forEach((key) => {
        allTouched[key] = true;
      });
      setTouchedFields(allTouched);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (isEditMode && userToEdit) {
        // In a real app, you would update the user via API
        toast({
          title: "✅ Usuario actualizado",
          description: `Los datos de ${formState.name} han sido actualizados.`,
          variant: "default",
        });
      } else {
        // Add new user (in a real app, this would be an API call)
        const newUser: User = {
          id: (data.length + 1).toString(),
          name: formState.name,
          email: formState.email,
          phone: formState.phone || undefined,
          role: formState.role as User["role"],
          status: formState.status as User["status"],
        };

        // Launch confetti for new users only
        launchConfetti();

        toast({
          title: "✅ Usuario agregado exitosamente",
          description: `${newUser.name} ahora tiene acceso al sistema.`,
          variant: "default",
          action: (
            <Button variant="outline" size="sm" className="text-xs">
              Ver usuario
            </Button>
          ),
        });
      }

      // Reset form
      setFormState({
        name: "",
        email: "",
        phone: "",
        role: "",
        status: "active",
      });

      setErrors({});
      setTouchedFields({});
      setIsSubmitting(false);
      setIsDialogOpen(false);
      setIsEditMode(false);
      setUserToEdit(null);
    }, 1000);
  };

  const resetForm = () => {
    setFormState({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "active",
    });
    setErrors({});
    setTouchedFields({});
    setIsSubmitting(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            resetForm();
            setIsEditMode(false);
            setUserToEdit(null);
            setIsDialogOpen(true);
          }}
        >
          <PlusCircle className="h-4 w-4" />
          Agregar Usuario
        </Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
            setIsEditMode(false);
            setUserToEdit(null);
          }
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[480px] p-6 gap-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl">
              {isEditMode ? "Editar Usuario" : "Agregar Usuario"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Modifica la información del usuario en el sistema."
                : "Crea un nuevo usuario para el sistema. Todos los campos marcados con * son obligatorios."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-600"
              >
                Nombre completo *
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  autoFocus
                  placeholder="Ej: Juan Pérez"
                  className={cn(
                    "rounded-xl border-gray-200 bg-gray-50 transition-all",
                    errors.name && touchedFields.name
                      ? "border-red-300 pr-10"
                      : "",
                    !errors.name && touchedFields.name && formState.name
                      ? "border-green-300 pr-10"
                      : ""
                  )}
                  value={formState.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touchedFields.name && (
                  <>
                    {errors.name ? (
                      <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                    ) : formState.name ? (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                    ) : null}
                  </>
                )}
              </div>
              {errors.name && touchedFields.name && (
                <p className="text-sm text-red-500 mt-1 animate-slide-down">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-600"
              >
                Correo electrónico *
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className={cn(
                    "rounded-xl border-gray-200 bg-gray-50 transition-all",
                    errors.email && touchedFields.email
                      ? "border-red-300 pr-10"
                      : "",
                    !errors.email && touchedFields.email && formState.email
                      ? "border-green-300 pr-10"
                      : ""
                  )}
                  value={formState.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touchedFields.email && (
                  <>
                    {errors.email ? (
                      <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                    ) : formState.email ? (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                    ) : null}
                  </>
                )}
              </div>
              {errors.email && touchedFields.email && (
                <p className="text-sm text-red-500 mt-1 animate-slide-down">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-600"
              >
                Teléfono (opcional)
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(809) ___-____"
                className="rounded-xl border-gray-200 bg-gray-50"
                value={formState.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-sm font-medium text-gray-600"
              >
                Rol *
              </Label>
              <Select
                value={formState.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger
                  id="role"
                  className={cn(
                    "rounded-xl border-gray-200 bg-gray-50",
                    errors.role && touchedFields.role ? "border-red-300" : ""
                  )}
                >
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span>Administrador</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sales">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span>Ventas</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="finance">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>Finanzas</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inventory">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      <span>Inventario</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && touchedFields.role && (
                <p className="text-sm text-red-500 mt-1 animate-slide-down">
                  {errors.role}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-600"
              >
                Estado inicial *
              </Label>
              <Select
                value={formState.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger
                  id="status"
                  className="rounded-xl border-gray-200 bg-gray-50"
                >
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>Activo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-slate-400" />
                      <span>Inactivo</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Guardando...</span>
                  </div>
                ) : isEditMode ? (
                  "Actualizar Usuario"
                ) : (
                  "Guardar Usuario"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar a {userToDelete?.name}? Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
