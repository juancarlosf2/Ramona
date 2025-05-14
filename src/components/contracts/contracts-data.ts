export type Contract = {
  id: string;
  clientName: string;
  clientEmail: string;
  vehicleInfo: string;
  vehicleBrand: string;
  date: string;
  amount: number;
  status: "active" | "pending" | "completed" | "cancelled";
  signedDate?: string;
  signedBy?: string;
};

// Status mapping for contracts
export const contractStatusMap: Record<
  Contract["status"],
  {
    label: string;
    className: string;
    bgColor: string;
    icon: string;
  }
> = {
  active: {
    label: "Activo",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bgColor: "bg-emerald-100",
    icon: "check-circle",
  },
  pending: {
    label: "Pendiente",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    bgColor: "bg-amber-100",
    icon: "clock",
  },
  completed: {
    label: "Completado",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    bgColor: "bg-blue-100",
    icon: "check",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800 border-red-200",
    bgColor: "bg-red-100",
    icon: "x-circle",
  },
};

// Brand color mapping
export const brandColorMap: Record<string, string> = {
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
export const contracts: Contract[] = [
  {
    id: "CTR-2023-1001",
    clientName: "Juan Pérez",
    clientEmail: "juan.perez@example.com",
    vehicleInfo: "Toyota Corolla 2022",
    vehicleBrand: "Toyota",
    date: "2023-10-15",
    amount: 950000,
    status: "active",
    signedDate: "2023-10-18",
    signedBy: "Juan Pérez",
  },
  {
    id: "CTR-2023-1002",
    clientName: "María Rodríguez",
    clientEmail: "maria.rodriguez@example.com",
    vehicleInfo: "Honda Civic 2021",
    vehicleBrand: "Honda",
    date: "2023-09-28",
    amount: 875000,
    status: "active",
    signedDate: "2023-10-01",
    signedBy: "María Rodríguez",
  },
  {
    id: "CTR-2023-1003",
    clientName: "Carlos Gómez",
    clientEmail: "carlos.gomez@example.com",
    vehicleInfo: "Hyundai Tucson 2023",
    vehicleBrand: "Hyundai",
    date: "2023-11-05",
    amount: 1250000,
    status: "pending",
  },
  {
    id: "CTR-2023-1004",
    clientName: "Laura Sánchez",
    clientEmail: "laura.sanchez@example.com",
    vehicleInfo: "Kia Sportage 2022",
    vehicleBrand: "Kia",
    date: "2023-10-22",
    amount: 1050000,
    status: "active",
    signedDate: "2023-10-25",
    signedBy: "Laura Sánchez",
  },
  {
    id: "CTR-2023-1005",
    clientName: "Roberto Méndez",
    clientEmail: "roberto.mendez@example.com",
    vehicleInfo: "Nissan Sentra 2023",
    vehicleBrand: "Nissan",
    date: "2023-11-10",
    amount: 925000,
    status: "pending",
  },
  {
    id: "CTR-2023-1006",
    clientName: "Ana Martínez",
    clientEmail: "ana.martinez@example.com",
    vehicleInfo: "Toyota RAV4 2023",
    vehicleBrand: "Toyota",
    date: "2023-10-05",
    amount: 1350000,
    status: "completed",
    signedDate: "2023-10-07",
    signedBy: "Ana Martínez",
  },
  {
    id: "CTR-2023-1007",
    clientName: "Pedro Fernández",
    clientEmail: "pedro.fernandez@example.com",
    vehicleInfo: "Mazda CX-5 2022",
    vehicleBrand: "Mazda",
    date: "2023-11-02",
    amount: 1150000,
    status: "active",
    signedDate: "2023-11-05",
    signedBy: "Pedro Fernández",
  },
  {
    id: "CTR-2023-1008",
    clientName: "Sofía Ramírez",
    clientEmail: "sofia.ramirez@example.com",
    vehicleInfo: "Honda HR-V 2023",
    vehicleBrand: "Honda",
    date: "2023-10-18",
    amount: 980000,
    status: "cancelled",
  },
  {
    id: "CTR-2023-1009",
    clientName: "Ricardo Herrera",
    clientEmail: "ricardo.herrera@example.com",
    vehicleInfo: "Chevrolet Traverse 2022",
    vehicleBrand: "Chevrolet",
    date: "2023-09-15",
    amount: 1450000,
    status: "completed",
    signedDate: "2023-09-20",
    signedBy: "Ricardo Herrera",
  },
  {
    id: "CTR-2023-1010",
    clientName: "Elena Castro",
    clientEmail: "elena.castro@example.com",
    vehicleInfo: "Ford Explorer 2023",
    vehicleBrand: "Ford",
    date: "2023-11-08",
    amount: 1550000,
    status: "pending",
  },
];
