import type React from "react";

import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  HelpCircle,
  Hourglass,
  PackageCheck,
  ShieldAlert,
  ShoppingCart,
  Tag,
  Truck,
  UserCheck,
  Wrench,
  XCircle,
} from "lucide-react";

interface VehicleStatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface StatusOption {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}

export function VehicleStatusSelector({
  value,
  onChange,
}: VehicleStatusSelectorProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    value || "available"
  );

  const statusOptions: StatusOption[] = [
    {
      id: "available",
      label: "Disponible",
      color:
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      description: "Vehículo listo para ser vendido",
    },
    {
      id: "reserved",
      label: "Reservado",
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
      icon: <Clock className="h-3.5 w-3.5" />,
      description: "Vehículo apartado por un cliente",
    },
    {
      id: "in_process",
      label: "En proceso",
      color:
        "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200",
      icon: <ShoppingCart className="h-3.5 w-3.5" />,
      description: "Vehículo en proceso de venta",
    },
    {
      id: "financing",
      label: "En financiamiento",
      color:
        "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200",
      icon: <DollarSign className="h-3.5 w-3.5" />,
      description: "Vehículo en proceso de financiamiento",
    },
    {
      id: "sold",
      label: "Vendido",
      color: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
      icon: <UserCheck className="h-3.5 w-3.5" />,
      description: "Vehículo vendido",
    },
    {
      id: "unavailable",
      label: "No disponible",
      color: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
      icon: <XCircle className="h-3.5 w-3.5" />,
      description: "Vehículo no disponible para la venta",
    },
    {
      id: "retired",
      label: "Retirado",
      color: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
      icon: <ShieldAlert className="h-3.5 w-3.5" />,
      description: "Vehículo retirado del inventario",
    },
    {
      id: "preparation",
      label: "En preparación",
      color: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200",
      icon: <Wrench className="h-3.5 w-3.5" />,
      description: "Vehículo en preparación o acondicionamiento",
    },
    {
      id: "pending_delivery",
      label: "Entrega pendiente",
      color: "bg-sky-100 text-sky-800 hover:bg-sky-200 border-sky-200",
      icon: <Truck className="h-3.5 w-3.5" />,
      description: "Vehículo vendido pendiente de entrega",
    },
    {
      id: "with_offer",
      label: "Con oferta",
      color: "bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200",
      icon: <Tag className="h-3.5 w-3.5" />,
      description: "Vehículo con oferta especial",
    },
    {
      id: "with_contract",
      label: "Con contrato",
      color:
        "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200",
      icon: <FileText className="h-3.5 w-3.5" />,
      description: "Vehículo con contrato generado",
    },
    {
      id: "payment_pending",
      label: "Pago pendiente",
      color: "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200",
      icon: <Hourglass className="h-3.5 w-3.5" />,
      description: "Vehículo con pago pendiente",
    },
    {
      id: "completed",
      label: "Finalizado",
      color:
        "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200",
      icon: <FileCheck className="h-3.5 w-3.5" />,
      description: "Proceso de venta finalizado",
    },
    {
      id: "maintenance",
      label: "En mantenimiento",
      color: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 border-cyan-200",
      icon: <Wrench className="h-3.5 w-3.5" />,
      description: "Vehículo en mantenimiento",
    },
    {
      id: "administrative",
      label: "En gestión",
      color: "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200",
      icon: <HelpCircle className="h-3.5 w-3.5" />,
      description: "Vehículo en gestión administrativa",
    },
    {
      id: "test_drive",
      label: "Test drive",
      color:
        "bg-violet-100 text-violet-800 hover:bg-violet-200 border-violet-200",
      icon: <PackageCheck className="h-3.5 w-3.5" />,
      description: "Vehículo con test drive agendado",
    },
  ];

  const handleStatusChange = (statusId: string) => {
    setSelectedStatus(statusId);
    onChange(statusId);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <TooltipProvider delayDuration={200}>
          {statusOptions.map((status) => (
            <Tooltip key={status.id}>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={`${status.color} cursor-pointer transition-all duration-200 font-jakarta font-bold text-[14px] py-1.5 px-2.5 ${
                    selectedStatus === status.id
                      ? "ring-2 ring-offset-1 ring-primary/30 scale-110"
                      : "opacity-80"
                  }`}
                  onClick={() => handleStatusChange(status.id)}
                >
                  <span className="flex items-center gap-1.5">
                    {status.icon}
                    {status.label}
                  </span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="animate-in fade-in-0 zoom-in-95 duration-200"
              >
                <p>{status.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
