import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { Button } from "~/components/ui/button";
import { MoreHorizontal, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatCurrency } from "~/lib/utils";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Link } from "@tanstack/react-router";

// Vehicle type
type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  plate: string;
  price: number;
  status: "available" | "sold" | "reserved" | "maintenance" | "importing";
  addedDate?: string;
};

// Status mapping for vehicles
const vehicleStatusMap: Record<
  Vehicle["status"],
  { label: string; className: string }
> = {
  available: {
    label: "Disponible",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  sold: {
    label: "Vendido",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  reserved: {
    label: "Reservado",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  maintenance: {
    label: "En Mantenimiento",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  importing: {
    label: "Importando",
    className: "bg-purple-100 text-purple-800 border-purple-200",
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
const data: Vehicle[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    color: "Blanco",
    vin: "1HGCM82633A123456",
    plate: "A123456",
    price: 950000,
    status: "available",
    addedDate: "2023-10-15",
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
    status: "available",
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
    status: "reserved",
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
    addedDate: "2023-10-05",
  },
  {
    id: "7",
    brand: "Mazda",
    model: "CX-5",
    year: 2022,
    color: "Rojo",
    vin: "JM3KFBDM7N0123456",
    plate: "G789012",
    price: 1150000,
    status: "reserved",
    addedDate: "2023-11-02",
  },
  {
    id: "8",
    brand: "Honda",
    model: "HR-V",
    year: 2023,
    color: "Blanco",
    vin: "3CZRU5H53PM123456",
    plate: "H345678",
    price: 980000,
    status: "available",
    addedDate: "2023-10-18",
  },
  {
    id: "9",
    brand: "Kia",
    model: "Seltos",
    year: 2023,
    color: "Negro",
    vin: "KNDEU2A29P7123456",
    plate: "I901234",
    price: 890000,
    status: "available",
    addedDate: "2023-10-30",
  },
  {
    id: "10",
    brand: "Nissan",
    model: "Kicks",
    year: 2022,
    color: "Azul",
    vin: "3N1CP5CU7NL123456",
    plate: "J567890",
    price: 850000,
    status: "importing",
    addedDate: "2023-11-08",
  },
];

export function VehiclesTable() {
  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "brand",
      header: "Vehículo",
      cell: ({ row }) => {
        const vehicle = row.original;
        const brandColor = brandColorMap[vehicle.brand] || "bg-gray-100";

        return (
          <div className="flex items-center gap-3">
            <Avatar className={`${brandColor} border border-muted`}>
              <AvatarFallback className="text-foreground">
                {vehicle.brand.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">
                {vehicle.brand} {vehicle.model}
              </span>
              <span className="text-xs text-muted-foreground">
                {vehicle.year} • {vehicle.color}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "plate",
      header: "Placa",
      cell: ({ row }) => <div className="text-sm">{row.getValue("plate")}</div>,
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("price"));
        return (
          <div className="text-sm font-medium">{formatCurrency(amount)}</div>
        );
      },
    },
    {
      accessorKey: "addedDate",
      header: "Fecha de Ingreso",
      cell: ({ row }) => {
        const date = row.original.addedDate;
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
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as Vehicle["status"];
        const config = vehicleStatusMap[status];

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
        const vehicle = row.original;

        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground"
            >
              <Link
                to={`/vehicles/$vehicleId`}
                params={{ vehicleId: vehicle.id }}
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
                  onClick={() => navigator.clipboard.writeText(vehicle.id)}
                >
                  Copiar ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    params={{ vehicleId: vehicle.id }}
                    to={`/vehicles/$vehicleId`}
                  >
                    Ver detalles
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                  <Link href={`/vehicles/${vehicle.id}/edit`}>
                    Editar vehículo
                  </Link>
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem asChild>
                  {/* !TODO: fix this link once we create contracts/new 
                  <Link href={`/contracts/new?vehicle=${vehicle.id}`}>
                    Crear contrato
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
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
      searchColumn="brand"
      searchPlaceholder="Buscar por marca..."
    />
  );
}
