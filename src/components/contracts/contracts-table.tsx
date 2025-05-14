import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { Button } from "~/components/ui/button";
import { MoreHorizontal, Pencil, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "~/lib/utils";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { getInitials } from "~/lib/utils";
import { Checkbox } from "~/components/ui/checkbox";
import { Link } from "@tanstack/react-router";

// Contract type
type Contract = {
  id: string;
  clientName: string;
  clientEmail: string;
  vehicleInfo: string;
  vehicleBrand: string;
  date: string;
  amount: number;
  status: "active" | "pending" | "completed" | "cancelled";
};

// Status mapping for contracts
const contractStatusMap: Record<
  Contract["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Activo",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  pending: {
    label: "Pendiente",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  completed: {
    label: "Completado",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

// Brand color mapping
const brandColorMap: Record<string, string> = {
  Toyota: "bg-red-100",
  Honda: "bg-blue-100",
  Hyundai: "bg-sky-100",
  Kia: "bg-orange-100",
  Nissan: "bg-gray-100",
  Mazda: "bg-purple-100",
  Ford: "bg-indigo-100",
  Chevrolet: "bg-yellow-100",
  BMW: "bg-blue-100",
  "Mercedes-Benz": "bg-gray-100",
};

// Sample data
const data: Contract[] = [
  {
    id: "1",
    clientName: "Juan Pérez",
    clientEmail: "juan.perez@example.com",
    vehicleInfo: "Toyota Corolla 2022",
    vehicleBrand: "Toyota",
    date: "2023-10-15",
    amount: 950000,
    status: "active",
  },
  {
    id: "2",
    clientName: "María Rodríguez",
    clientEmail: "maria.rodriguez@example.com",
    vehicleInfo: "Honda Civic 2021",
    vehicleBrand: "Honda",
    date: "2023-09-28",
    amount: 875000,
    status: "active",
  },
  {
    id: "3",
    clientName: "Carlos Gómez",
    clientEmail: "carlos.gomez@example.com",
    vehicleInfo: "Hyundai Tucson 2023",
    vehicleBrand: "Hyundai",
    date: "2023-11-05",
    amount: 1250000,
    status: "pending",
  },
  {
    id: "4",
    clientName: "Laura Sánchez",
    clientEmail: "laura.sanchez@example.com",
    vehicleInfo: "Kia Sportage 2022",
    vehicleBrand: "Kia",
    date: "2023-10-22",
    amount: 1050000,
    status: "active",
  },
  {
    id: "5",
    clientName: "Roberto Méndez",
    clientEmail: "roberto.mendez@example.com",
    vehicleInfo: "Nissan Sentra 2023",
    vehicleBrand: "Nissan",
    date: "2023-11-10",
    amount: 925000,
    status: "pending",
  },
  {
    id: "6",
    clientName: "Ana Martínez",
    clientEmail: "ana.martinez@example.com",
    vehicleInfo: "Toyota RAV4 2023",
    vehicleBrand: "Toyota",
    date: "2023-10-05",
    amount: 1350000,
    status: "completed",
  },
  {
    id: "7",
    clientName: "Pedro Fernández",
    clientEmail: "pedro.fernandez@example.com",
    vehicleInfo: "Mazda CX-5 2022",
    vehicleBrand: "Mazda",
    date: "2023-11-02",
    amount: 1150000,
    status: "active",
  },
  {
    id: "8",
    clientName: "Sofía Ramírez",
    clientEmail: "sofia.ramirez@example.com",
    vehicleInfo: "Honda HR-V 2023",
    vehicleBrand: "Honda",
    date: "2023-10-18",
    amount: 980000,
    status: "cancelled",
  },
];

export function ContractsTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === data.length ? [] : data.map((contract) => contract.id)
    );
  };

  const columns: ColumnDef<Contract>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selectedRows.length === data.length}
            onCheckedChange={toggleAll}
            aria-label="Seleccionar todos"
            className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </div>
      ),
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={selectedRows.includes(contract.id)}
              onCheckedChange={() => toggleRow(contract.id)}
              aria-label={`Seleccionar ${contract.clientName}`}
              className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "clientName",
      header: "Cliente",
      cell: ({ row }) => {
        const contract = row.original;

        return (
          <div className="flex items-center gap-3">
            <Avatar className="bg-primary/10 border border-muted">
              <AvatarFallback className="text-primary font-medium">
                {getInitials(contract.clientName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{contract.clientName}</span>
              <span className="text-xs text-muted-foreground">
                {contract.clientEmail}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "vehicleInfo",
      header: "Vehículo",
      cell: ({ row }) => {
        const contract = row.original;
        const brandColor =
          brandColorMap[contract.vehicleBrand] || "bg-gray-100";

        return (
          <div className="flex items-center gap-3">
            <Avatar className={`${brandColor} border border-muted h-8 w-8`}>
              <AvatarFallback className="text-foreground text-xs">
                {contract.vehicleBrand.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{contract.vehicleInfo}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        return <div className="text-sm">{formatDate(date)}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"));
        return (
          <div className="text-sm font-medium">{formatCurrency(amount)}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as Contract["status"];
        const config = contractStatusMap[status];

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contract = row.original;

        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground"
            >
              <Link
                to={`/contracts/$contractId`}
                params={{ contractId: contract.id }}
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(contract.id)}
                >
                  Copiar ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to={`/contracts/$contractId`}
                    params={{ contractId: contract.id }}
                  >
                    Ver detalles
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={`/contracts/$contractId/edit`}
                    params={{ contractId: contract.id }}
                  >
                    Editar contrato
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="clientName"
      searchPlaceholder="Buscar por cliente..."
    />
  );
}
