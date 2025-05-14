import type React from "react";
import {
  AlertCircle,
  Banknote,
  Briefcase,
  Car,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Hourglass,
  Tag,
  TimerReset,
  Truck,
  Wrench,
  X,
} from "lucide-react";

export type VehicleStatus =
  | "available"
  | "reserved"
  | "in_process"
  | "financing"
  | "sold"
  | "unavailable"
  | "retired"
  | "preparing"
  | "pending_delivery"
  | "test_drive"
  | "maintenance"
  | "administrative"
  | "with_offer"
  | "with_contract"
  | "pending_payment"
  | "completed";

// Update the vehicleStatusMap object with improved contrast colors
const vehicleStatusMap: Record<
  VehicleStatus,
  {
    label: string;
    className: string;
    bgClassName: string;
    icon: React.ReactNode;
    description: string;
  }
> = {
  available: {
    label: "Disponible",
    className: "bg-yellow-100 text-yellow-900 border-yellow-300",
    bgClassName: "bg-yellow-50",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    description: "Vehículo listo para venta inmediata",
  },
  reserved: {
    label: "Reservado",
    className: "bg-blue-100 text-blue-900 border-blue-300",
    bgClassName: "bg-blue-50",
    icon: <Clock className="h-3.5 w-3.5" />,
    description: "Vehículo apartado por un cliente",
  },
  in_process: {
    label: "En proceso de venta",
    className: "bg-orange-100 text-orange-900 border-orange-300",
    bgClassName: "bg-orange-50",
    icon: <Hourglass className="h-3.5 w-3.5" />,
    description: "Venta en proceso de finalización",
  },
  financing: {
    label: "En financiamiento",
    className: "bg-purple-100 text-purple-900 border-purple-300",
    bgClassName: "bg-purple-50",
    icon: <Banknote className="h-3.5 w-3.5" />,
    description: "En proceso de aprobación de financiamiento",
  },
  sold: {
    label: "Vendido",
    className: "bg-green-100 text-green-900 border-green-300",
    bgClassName: "bg-green-50",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    description: "Venta completada",
  },
  unavailable: {
    label: "No disponible",
    className: "bg-red-100 text-red-900 border-red-300",
    bgClassName: "bg-red-50",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    description: "Temporalmente no disponible para venta",
  },
  retired: {
    label: "Retirado",
    className: "bg-gray-800 text-gray-100 border-gray-700",
    bgClassName: "bg-gray-50",
    icon: <X className="h-3.5 w-3.5" />,
    description: "Retirado permanentemente del inventario",
  },
  preparing: {
    label: "En preparación",
    className: "bg-amber-100 text-amber-900 border-amber-300",
    bgClassName: "bg-amber-50",
    icon: <Wrench className="h-3.5 w-3.5" />,
    description: "En proceso de preparación para venta",
  },
  pending_delivery: {
    label: "Entrega pendiente",
    className: "bg-sky-100 text-sky-900 border-sky-300",
    bgClassName: "bg-sky-50",
    icon: <Truck className="h-3.5 w-3.5" />,
    description: "Vendido, pendiente de entrega al cliente",
  },
  test_drive: {
    label: "Test drive",
    className: "bg-teal-100 text-teal-900 border-teal-300",
    bgClassName: "bg-teal-50",
    icon: <Car className="h-3.5 w-3.5" />,
    description: "Reservado para prueba de manejo",
  },
  maintenance: {
    label: "Mantenimiento",
    className: "bg-rose-100 text-rose-900 border-rose-300",
    bgClassName: "bg-rose-50",
    icon: <Wrench className="h-3.5 w-3.5" />,
    description: "En servicio de mantenimiento o reparación",
  },
  administrative: {
    label: "Gestión admin.",
    className: "bg-slate-100 text-slate-900 border-slate-300",
    bgClassName: "bg-slate-50",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    description: "En proceso de gestión administrativa",
  },
  with_offer: {
    label: "Con oferta",
    className: "bg-amber-100 text-amber-900 border-amber-300",
    bgClassName: "bg-amber-50",
    icon: <Tag className="h-3.5 w-3.5" />,
    description: "Cliente ha realizado una oferta",
  },
  with_contract: {
    label: "Con contrato",
    className: "bg-indigo-100 text-indigo-900 border-indigo-300",
    bgClassName: "bg-indigo-50",
    icon: <FileText className="h-3.5 w-3.5" />,
    description: "Contrato generado, pendiente de firma",
  },
  pending_payment: {
    label: "Pago pendiente",
    className: "bg-amber-100 text-amber-900 border-amber-300",
    bgClassName: "bg-amber-50",
    icon: <TimerReset className="h-3.5 w-3.5" />,
    description: "Esperando confirmación de pago",
  },
  completed: {
    label: "Finalizado",
    className: "bg-emerald-100 text-emerald-900 border-emerald-300",
    bgClassName: "bg-emerald-50",
    icon: <FileCheck className="h-3.5 w-3.5" />,
    description: "Proceso completado satisfactoriamente",
  },
};

export default vehicleStatusMap;
