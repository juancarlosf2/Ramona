import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { cn, getInitials } from "~/lib/utils";
import { useState, useEffect } from "react";
import { Badge } from "~/components/ui/badge";
import { Car, Clock, Award } from "lucide-react";

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

// Enhanced sales data with additional information
const allSales = [
  {
    id: 1,
    name: "Juan Pérez",
    vehicle: "Toyota Corolla 2022",
    brand: "Toyota",
    amount: 950000,
    avatar: "JP",
    status: "Completado",
    statusColor: "green",
    daysAgo: 0,
    brandColor: "bg-red-100 border-red-300",
    email: "juan.perez@example.com",
  },
  {
    id: 2,
    name: "María Rodríguez",
    vehicle: "Honda Civic 2021",
    brand: "Honda",
    amount: 875000,
    avatar: "MR",
    status: "Financiado",
    statusColor: "blue",
    daysAgo: 1,
    brandColor: "bg-blue-100 border-blue-300",
    email: "maria.rodriguez@example.com",
  },
  {
    id: 3,
    name: "Carlos Gómez",
    vehicle: "Hyundai Tucson 2023",
    brand: "Hyundai",
    amount: 1250000,
    avatar: "CG",
    status: "Completado",
    statusColor: "green",
    daysAgo: 1,
    brandColor: "bg-sky-100 border-sky-300",
    email: "carlos.sanchez@example.com",
  },
  {
    id: 4,
    name: "Laura Sánchez",
    vehicle: "Kia Sportage 2022",
    brand: "Kia",
    amount: 1050000,
    avatar: "LS",
    status: "Leasing",
    statusColor: "purple",
    daysAgo: 2,
    brandColor: "bg-orange-100 border-orange-300",
    email: "laura.sanchez@example.com",
  },
  {
    id: 5,
    name: "Roberto Méndez",
    vehicle: "Nissan Sentra 2023",
    brand: "Nissan",
    amount: 925000,
    avatar: "RM",
    status: "Financiado",
    statusColor: "blue",
    daysAgo: 3,
    brandColor: "bg-gray-100 border-gray-300",
    email: "roberto.mendez@example.com",
  },
  {
    id: 6,
    name: "Ana Martínez",
    vehicle: "Toyota RAV4 2023",
    brand: "Toyota",
    amount: 1350000,
    avatar: "AM",
    status: "Completado",
    statusColor: "green",
    daysAgo: 5,
    brandColor: "bg-red-100 border-red-300",
    email: "ana.martinez@example.com",
  },
  {
    id: 7,
    name: "Pedro Fernández",
    vehicle: "Mazda CX-5 2022",
    brand: "Mazda",
    amount: 1150000,
    avatar: "PF",
    status: "Financiado",
    statusColor: "blue",
    daysAgo: 7,
    brandColor: "bg-purple-100 border-purple-300",
    email: "pedro.fernandez@example.com",
  },
  {
    id: 8,
    name: "Sofía Ramírez",
    vehicle: "Honda HR-V 2023",
    brand: "Honda",
    amount: 980000,
    avatar: "SR",
    status: "Leasing",
    statusColor: "purple",
    daysAgo: 10,
    brandColor: "bg-blue-100 border-blue-300",
    email: "sofia.ramirez@example.com",
  },
  {
    id: 9,
    name: "Miguel Torres",
    vehicle: "Kia Seltos 2023",
    brand: "Kia",
    amount: 890000,
    avatar: "MT",
    status: "Completado",
    statusColor: "green",
    daysAgo: 15,
    brandColor: "bg-orange-100 border-orange-300",
    email: "miguel.torres@example.com",
  },
  {
    id: 10,
    name: "Carmen Díaz",
    vehicle: "Hyundai Santa Fe 2022",
    brand: "Hyundai",
    amount: 1450000,
    avatar: "CD",
    status: "Financiado",
    statusColor: "blue",
    daysAgo: 20,
    brandColor: "bg-sky-100 border-sky-300",
    email: "carmen.diaz@example.com",
  },
  {
    id: 11,
    name: "José Morales",
    vehicle: "Toyota Camry 2023",
    brand: "Toyota",
    amount: 1250000,
    avatar: "JM",
    status: "Completado",
    statusColor: "green",
    daysAgo: 25,
    brandColor: "bg-red-100 border-red-300",
    email: "jose.morales@example.com",
  },
  {
    id: 12,
    name: "Luisa Herrera",
    vehicle: "Nissan Kicks 2022",
    brand: "Nissan",
    amount: 850000,
    avatar: "LH",
    status: "Financiado",
    statusColor: "blue",
    daysAgo: 30,
    brandColor: "bg-gray-100 border-gray-300",
    email: "luisa.herrera@example.com",
  },
  {
    id: 13,
    name: "Fernando Castro",
    vehicle: "Honda Accord 2023",
    brand: "Honda",
    amount: 1150000,
    avatar: "FC",
    status: "Leasing",
    statusColor: "purple",
    daysAgo: 45,
    brandColor: "bg-blue-100 border-blue-300",
    email: "fernando.castro@example.com",
  },
  {
    id: 14,
    name: "Elena Vargas",
    vehicle: "Mazda 3 2022",
    brand: "Mazda",
    amount: 780000,
    avatar: "EV",
    status: "Completado",
    statusColor: "green",
    daysAgo: 60,
    brandColor: "bg-purple-100 border-purple-300",
    email: "elena.vargas@example.com",
  },
  {
    id: 15,
    name: "Ricardo Mendoza",
    vehicle: "Kia Forte 2023",
    brand: "Kia",
    amount: 720000,
    avatar: "RM",
    status: "Financiado",
    statusColor: "blue",
    daysAgo: 90,
    brandColor: "bg-orange-100 border-orange-300",
    email: "ricardo.mendoza@example.com",
  },
  {
    id: 16,
    name: "Gabriela Rojas",
    vehicle: "Toyota Yaris 2022",
    brand: "Toyota",
    amount: 650000,
    avatar: "GR",
    status: "Completado",
    statusColor: "green",
    daysAgo: 120,
    brandColor: "bg-red-100 border-red-300",
    email: "gabriela.rojas@example.com",
  },
  {
    id: 17,
    name: "Javier Paredes",
    vehicle: "Hyundai Elantra 2023",
    brand: "Hyundai",
    amount: 750000,
    avatar: "JP",
    status: "Financiado",
    statusColor: "blue",
    daysAgo: 150,
    brandColor: "bg-sky-100 border-sky-300",
    email: "javier.paredes@example.com",
  },
  {
    id: 18,
    name: "Patricia Guzmán",
    vehicle: "Nissan Versa 2022",
    brand: "Nissan",
    amount: 620000,
    avatar: "PG",
    status: "Leasing",
    statusColor: "purple",
    daysAgo: 180,
    brandColor: "bg-gray-100 border-gray-300",
    email: "patricia.guzman@example.com",
  },
];

interface RecentSalesProps {
  period: string;
}

export function RecentSales({ period }: RecentSalesProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [highlightVisible, setHighlightVisible] = useState(false);
  const [recentSales, setRecentSales] = useState<typeof allSales>([]);

  useEffect(() => {
    // Filter sales based on period
    let filteredSales: typeof allSales = [];

    switch (period) {
      case "today":
        filteredSales = allSales.filter((sale) => sale.daysAgo === 0);
        break;
      case "7days":
        filteredSales = allSales.filter((sale) => sale.daysAgo <= 7);
        break;
      case "30days":
        filteredSales = allSales.filter((sale) => sale.daysAgo <= 30);
        break;
      case "3months":
        filteredSales = allSales.filter((sale) => sale.daysAgo <= 90);
        break;
      case "6months":
        filteredSales = allSales.filter((sale) => sale.daysAgo <= 180);
        break;
      case "12months":
        filteredSales = allSales;
        break;
      default:
        filteredSales = allSales.filter((sale) => sale.daysAgo <= 30);
    }

    // Take only the first 5 sales
    filteredSales = filteredSales.slice(0, 5);
    setRecentSales(filteredSales);

    // Reset animations
    setVisibleItems([]);
    setHighlightVisible(false);

    // First animate the highlight
    const highlightTimeout = setTimeout(() => {
      setHighlightVisible(true);

      // Then animate items in sequence
      const itemsTimeout = setTimeout(() => {
        const interval = setInterval(() => {
          setVisibleItems((prev) => {
            const nextIndex = prev.length;
            if (nextIndex >= filteredSales.length) {
              clearInterval(interval);
              return prev;
            }
            return [...prev, nextIndex];
          });
        }, 150);

        return () => clearTimeout(itemsTimeout);
      }, 300);

      return () => clearTimeout(highlightTimeout);
    }, 200);

    return () => clearTimeout(highlightTimeout);
  }, [period]);

  // Find the top sale
  const topSale =
    recentSales.length > 0
      ? recentSales.reduce(
          (max, sale) => (max.amount > sale.amount ? max : sale),
          recentSales[0]
        )
      : null;

  // Helper function to get status badge color
  const getStatusColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "purple":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Sale Highlight */}
      {topSale && (
        <div
          className={cn(
            "p-3 rounded-lg border border-amber-200 bg-amber-50 transition-all duration-500 transform",
            highlightVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          <div className="flex items-center">
            <Avatar className="h-9 w-9 mr-3">
              <AvatarFallback
                className={`${generateAvatarColor(topSale.name)} text-white text-sm font-medium`}
              >
                {getInitials(topSale.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-amber-800">
                  Venta Destacada
                </h3>
                <Award className="h-4 w-4 text-amber-500 ml-1.5" />
              </div>
              <div className="mt-1 text-sm text-amber-700 flex items-center justify-between">
                <span className="truncate">
                  {topSale.name} – {topSale.vehicle}
                </span>
                <span className="font-medium ml-2">
                  {new Intl.NumberFormat("es-DO", {
                    style: "currency",
                    currency: "DOP",
                  }).format(topSale.amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Cards */}
      <div className="space-y-3">
        {recentSales.map((sale, index) => (
          <div
            key={sale.id}
            className={cn(
              "flex items-center p-3 rounded-lg border bg-card transition-all duration-300 transform hover:shadow-md hover:-translate-y-0.5",
              visibleItems.includes(index)
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            )}
          >
            <Avatar className="h-9 w-9 mr-3">
              <AvatarFallback
                className={`${generateAvatarColor(sale.name)} text-white text-sm font-medium`}
              >
                {getInitials(sale.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center">
                <p className="text-sm font-medium leading-none truncate">
                  {sale.name}
                </p>
                <div className="ml-2 flex items-center text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs">
                    {sale.daysAgo === 0
                      ? "Hoy"
                      : sale.daysAgo === 1
                        ? "Ayer"
                        : `Hace ${sale.daysAgo} días`}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {sale.email}
              </p>
              <div className="flex items-center mt-1">
                <Car className="h-3 w-3 mr-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{sale.vehicle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {new Intl.NumberFormat("es-DO", {
                  style: "currency",
                  currency: "DOP",
                }).format(sale.amount)}
              </p>
              <Badge
                variant="outline"
                className={cn("mt-1", getStatusColor(sale.statusColor))}
              >
                {sale.status}
              </Badge>
            </div>
          </div>
        ))}

        {recentSales.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            No hay ventas en este período
          </div>
        )}
      </div>
    </div>
  );
}
