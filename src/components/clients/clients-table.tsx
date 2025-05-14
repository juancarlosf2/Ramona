import { useState, useCallback, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Eye, Trash2 } from "lucide-react";
import { getInitials } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useToast } from "~/hooks/use-toast";
import { Link } from "@tanstack/react-router";

// Enhanced Client type without status
type Client = {
  id: string;
  name: string;
  cedula: string;
  phone: string;
  email: string;
  address: string;
  lastContact?: string;
  notes?: string;
};

// Sample data with enhanced fields (removed status field)
const data: Client[] = [
  {
    id: "1",
    name: "Juan Pérez",
    cedula: "001-1234567-8",
    phone: "809-555-1234",
    email: "juan.perez@example.com",
    address: "Calle Principal #123, Santo Domingo",
    lastContact: "2023-11-15",
    notes: "Interesado en sedanes de gama media",
  },
  {
    id: "2",
    name: "María Rodríguez",
    cedula: "002-9876543-2",
    phone: "809-555-5678",
    email: "maria.rodriguez@example.com",
    address: "Av. Independencia #456, Santiago",
    lastContact: "2023-11-10",
    notes: "En proceso de financiamiento para SUV",
  },
  {
    id: "3",
    name: "Carlos Gómez",
    cedula: "003-4567890-1",
    phone: "809-555-9012",
    email: "carlos.gomez@example.com",
    address: "Calle Las Flores #789, La Romana",
    lastContact: "2023-10-05",
    notes: "No ha respondido a los últimos contactos",
  },
  {
    id: "4",
    name: "Laura Sánchez",
    cedula: "004-3210987-6",
    phone: "809-555-3456",
    email: "laura.sanchez@example.com",
    address: "Av. Las Américas #101, Santo Domingo",
    lastContact: "2023-11-12",
    notes: "Test drive programado para Toyota Corolla",
  },
  {
    id: "5",
    name: "Roberto Méndez",
    cedula: "005-6789012-3",
    phone: "809-555-7890",
    email: "roberto.mendez@example.com",
    address: "Calle El Sol #202, Puerto Plata",
    lastContact: "2023-11-08",
    notes: "Contrato firmado, esperando entrega del vehículo",
  },
  {
    id: "6",
    name: "Ana Martínez",
    cedula: "006-5432109-8",
    phone: "809-555-2345",
    email: "ana.martinez@example.com",
    address: "Av. Duarte #303, San Francisco de Macorís",
    lastContact: "2023-11-14",
    notes: "Interesada en vehículos híbridos",
  },
  {
    id: "7",
    name: "Pedro Fernández",
    cedula: "007-8901234-5",
    phone: "809-555-6789",
    email: "pedro.fernandez@example.com",
    address: "Calle Restauración #404, Moca",
    lastContact: "2023-11-01",
    notes: "Requiere seguimiento para oferta especial",
  },
  {
    id: "8",
    name: "Sofía Ramírez",
    cedula: "008-2345678-9",
    phone: "809-555-0123",
    email: "sofia.ramirez@example.com",
    address: "Av. 27 de Febrero #505, Santo Domingo",
    lastContact: "2023-10-25",
    notes: "Vehículo entregado, satisfecha con la compra",
  },
  {
    id: "9",
    name: "Miguel Torres",
    cedula: "009-6789012-3",
    phone: "809-555-4567",
    email: "miguel.torres@example.com",
    address: "Calle Sánchez #606, La Vega",
    lastContact: "2023-11-13",
    notes: "Cliente recurrente, interesado en segundo vehículo",
  },
  {
    id: "10",
    name: "Carmen Díaz",
    cedula: "010-0123456-7",
    phone: "809-555-8901",
    email: "carmen.diaz@example.com",
    address: "Av. Luperón #707, Santo Domingo",
    lastContact: "2023-09-15",
    notes: "Problemas con pagos anteriores",
  },
];

export function ClientsTable() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [clientsData, setClientsData] = useState<Client[]>(data);
  const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null);
  const [multiDeleteOpen, setMultiDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Get client by ID
  const getClientById = useCallback(
    (id: string) => {
      return clientsData.find((client) => client.id === id);
    },
    [clientsData]
  );

  // Handle row selection
  const toggleRowSelection = useCallback(
    (id: string, shiftKey = false) => {
      setSelectedClients((prev) => {
        // If holding shift and there's already a selection
        if (shiftKey && prev.length > 0) {
          const lastSelectedId = prev[prev.length - 1];
          const lastSelectedIndex = clientsData.findIndex(
            (client) => client.id === lastSelectedId
          );
          const currentIndex = clientsData.findIndex(
            (client) => client.id === id
          );

          // Select all rows between the last selected and current
          const startIdx = Math.min(lastSelectedIndex, currentIndex);
          const endIdx = Math.max(lastSelectedIndex, currentIndex);

          const rangeIds = clientsData
            .slice(startIdx, endIdx + 1)
            .map((client) => client.id);

          // Combine previous selection with range, removing duplicates
          return [...new Set([...prev, ...rangeIds])];
        }

        // Toggle selection for single row
        return prev.includes(id)
          ? prev.filter((clientId) => clientId !== id)
          : [...prev, id];
      });
    },
    [clientsData]
  );

  // Handle select all
  const toggleSelectAll = useCallback(() => {
    setSelectedClients((prev) =>
      prev.length === clientsData.length
        ? []
        : clientsData.map((client) => client.id)
    );
  }, [clientsData]);

  // Handle single delete
  const handleSingleDelete = useCallback(async () => {
    if (!singleDeleteId) return;

    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Remove client from data
      setClientsData((prev) =>
        prev.filter((client) => client.id !== singleDeleteId)
      );

      // Show success toast
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente.",
        variant: "default",
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el cliente. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setSingleDeleteId(null);
    }
  }, [singleDeleteId, toast]);

  // Handle multi delete
  const handleMultiDelete = useCallback(async () => {
    if (selectedClients.length === 0) return;

    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove clients from data
      setClientsData((prev) =>
        prev.filter((client) => !selectedClients.includes(client.id))
      );

      // Show success toast
      toast({
        title: `${selectedClients.length} clientes eliminados`,
        description:
          "Los clientes seleccionados han sido eliminados exitosamente.",
        variant: "default",
      });

      // Clear selection
      setSelectedClients([]);
    } catch (error) {
      // Show error toast
      toast({
        title: "Error al eliminar",
        description:
          "No se pudieron eliminar los clientes seleccionados. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setMultiDeleteOpen(false);
    }
  }, [selectedClients, toast]);

  // Handle escape key to clear selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedClients.length > 0) {
        setSelectedClients([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedClients]);

  const columns: ColumnDef<Client>[] = [
    {
      id: "select",
      header: () => (
        <div className="flex items-center justify-center h-full">
          <Checkbox
            checked={
              selectedClients.length === clientsData.length &&
              clientsData.length > 0
            }
            onCheckedChange={toggleSelectAll}
            aria-label="Seleccionar todos"
          />
        </div>
      ),
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center justify-center h-full">
            <Checkbox
              checked={selectedClients.includes(client.id)}
              onCheckedChange={(checked) => {
                if (checked !== "indeterminate") {
                  toggleRowSelection(client.id);
                }
              }}
              onClick={(e) => {
                // Handle shift+click for range selection
                if (e.shiftKey) {
                  e.preventDefault();
                  toggleRowSelection(client.id, true);
                }
              }}
              aria-label={`Seleccionar ${client.name}`}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Cliente",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar
              className={`h-9 w-9 border border-muted transition-all ${
                selectedClients.includes(client.id)
                  ? "bg-primary/20"
                  : "bg-primary/10"
              }`}
            >
              <AvatarFallback className="text-primary font-medium text-sm">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{client.name}</span>
              <span className="text-xs text-muted-foreground">
                {client.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "cedula",
      header: "Cédula",
      cell: ({ row }) => (
        <div className="text-sm font-medium">{row.getValue("cedula")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => <div className="text-sm">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "address",
      header: "Dirección",
      cell: ({ row }) => (
        <div
          className="text-sm max-w-[300px] truncate"
          title={row.getValue("address")}
        >
          {row.getValue("address")}
        </div>
      ),
    },
    {
      accessorKey: "lastContact",
      header: "Último Contacto",
      cell: ({ row }) => {
        const date = row.original.lastContact;
        if (!date)
          return <div className="text-sm text-muted-foreground">-</div>;

        const formattedDate = new Intl.DateTimeFormat("es-DO", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(date));

        return <div className="text-sm">{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const client = row.original;
        const isHovered = hoveredRow === client.id;

        return (
          <div
            className="flex items-center justify-end gap-2 h-full"
            onMouseEnter={() => setHoveredRow(client.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className={`text-muted-foreground transition-opacity hover:text-primary ${isHovered ? "opacity-100" : "opacity-70 sm:opacity-100"}`}
                  >
                    <Link
                      to={`/clients/$clientId`}
                      params={{ clientId: client.id }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5} className="font-medium text-xs">
                  Ver detalles
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSingleDeleteId(client.id)}
                    className={`text-muted-foreground transition-all hover:text-rose-600 hover:scale-105 ${
                      isHovered ? "opacity-100" : "opacity-0 sm:opacity-70"
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar cliente</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5} className="font-medium text-xs">
                  Eliminar cliente
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  return (
    <div className="relative">
      <DataTable
        columns={columns}
        data={clientsData}
        searchColumn="name"
        searchPlaceholder="Buscar por nombre..."
        pagination
      />

      {/* Floating action bar for multi-selection */}
      {selectedClients.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-lg">
            <span className="font-medium">
              {selectedClients.length}{" "}
              {selectedClients.length === 1
                ? "cliente seleccionado"
                : "clientes seleccionados"}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setMultiDeleteOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar seleccionados
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedClients([])}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Single delete confirmation dialog */}
      <Dialog
        open={singleDeleteId !== null}
        onOpenChange={(open) => !open && setSingleDeleteId(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar a{" "}
              {singleDeleteId && getClientById(singleDeleteId)?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={handleSingleDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Eliminando...
                </>
              ) : (
                <>Eliminar</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSingleDeleteId(null)}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multi delete confirmation dialog */}
      <Dialog open={multiDeleteOpen} onOpenChange={setMultiDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación múltiple</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar {selectedClients.length}{" "}
              {selectedClients.length === 1 ? "cliente" : "clientes"}? Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={handleMultiDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Eliminando...
                </>
              ) : (
                <>
                  Eliminar {selectedClients.length}{" "}
                  {selectedClients.length === 1 ? "cliente" : "clientes"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setMultiDeleteOpen(false)}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
