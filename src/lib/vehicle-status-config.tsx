import type React from "react";
import {
  CheckCircle2,
  Clock,
  Hourglass,
  Wrench,
  // Future status icons (commented out for now)
  // AlertCircle,
  // Banknote,
  // Briefcase,
  // Car,
  // FileCheck,
  // FileText,
  // Tag,
  // TimerReset,
  // Truck,
  // X,
} from "lucide-react";
import type { VehicleStatus } from "~/types/vehicle";

/**
 * Centralized vehicle status configuration
 * Maps vehicle status to display properties (label, styling, icons, descriptions)
 * Used across all vehicle-related components for consistency
 * 
 * Currently active statuses: available, sold, reserved, in_process, maintenance
 * Future statuses are commented out and can be enabled when added to database schema
 */
export const vehicleStatusMap: Record<
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
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bgClassName: "bg-yellow-50",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    description: "Vehículo listo para venta inmediata",
  },
  reserved: {
    label: "Reservado",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    bgClassName: "bg-blue-50",
    icon: <Clock className="h-3.5 w-3.5" />,
    description: "Vehículo apartado por un cliente",
  },
  in_process: {
    label: "En proceso de venta",
    className: "bg-orange-100 text-orange-800 border-orange-200",
    bgClassName: "bg-orange-50",
    icon: <Hourglass className="h-3.5 w-3.5" />,
    description: "Venta en proceso de finalización",
  },
  // TODO: Add these statuses to database schema when needed
  // financing: {
  //   label: "En financiamiento",
  //   className: "bg-purple-100 text-purple-800 border-purple-200",
  //   bgClassName: "bg-purple-50",
  //   icon: <Banknote className="h-3.5 w-3.5" />,
  //   description: "En proceso de aprobación de financiamiento",
  // },
  sold: {
    label: "Vendido",
    className: "bg-green-100 text-green-800 border-green-200",
    bgClassName: "bg-green-50",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    description: "Venta completada",
  },
  // unavailable: {
  //   label: "No disponible",
  //   className: "bg-red-100 text-red-800 border-red-200",
  //   bgClassName: "bg-red-50",
  //   icon: <AlertCircle className="h-3.5 w-3.5" />,
  //   description: "Temporalmente no disponible para venta",
  // },
  // retired: {
  //   label: "Retirado",
  //   className: "bg-gray-800 text-gray-100 border-gray-700",
  //   bgClassName: "bg-gray-50",
  //   icon: <X className="h-3.5 w-3.5" />,
  //   description: "Retirado permanentemente del inventario",
  // },
  // preparing: {
  //   label: "En preparación",
  //   className: "bg-amber-100 text-amber-800 border-amber-200",
  //   bgClassName: "bg-amber-50",
  //   icon: <Wrench className="h-3.5 w-3.5" />,
  //   description: "En proceso de preparación para venta",
  // },
  // pending_delivery: {
  //   label: "Entrega pendiente",
  //   className: "bg-sky-100 text-sky-800 border-sky-200",
  //   bgClassName: "bg-sky-50",
  //   icon: <Truck className="h-3.5 w-3.5" />,
  //   description: "Vendido, pendiente de entrega al cliente",
  // },
  // test_drive: {
  //   label: "Test drive",
  //   className: "bg-teal-100 text-teal-800 border-teal-200",
  //   bgClassName: "bg-teal-50",
  //   icon: <Car className="h-3.5 w-3.5" />,
  //   description: "Reservado para prueba de manejo",
  // },
  maintenance: {
    label: "Mantenimiento",
    className: "bg-rose-100 text-rose-800 border-rose-200",
    bgClassName: "bg-rose-50",
    icon: <Wrench className="h-3.5 w-3.5" />,
    description: "En servicio de mantenimiento o reparación",
  },
  // administrative: {
  //   label: "Gestión admin.",
  //   className: "bg-slate-100 text-slate-800 border-slate-200",
  //   bgClassName: "bg-slate-50",
  //   icon: <Briefcase className="h-3.5 w-3.5" />,
  //   description: "En proceso de gestión administrativa",
  // },
  // with_offer: {
  //   label: "Con oferta",
  //   className: "bg-amber-100 text-amber-800 border-amber-200",
  //   bgClassName: "bg-amber-50",
  //   icon: <Tag className="h-3.5 w-3.5" />,
  //   description: "Cliente ha realizado una oferta",
  // },
  // with_contract: {
  //   label: "Con contrato",
  //   className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  //   bgClassName: "bg-indigo-50",
  //   icon: <FileText className="h-3.5 w-3.5" />,
  //   description: "Contrato generado, pendiente de firma",
  // },
  // pending_payment: {
  //   label: "Pago pendiente",
  //   className: "bg-amber-100 text-amber-800 border-amber-200",
  //   bgClassName: "bg-amber-50",
  //   icon: <TimerReset className="h-3.5 w-3.5" />,
  //   description: "Esperando confirmación de pago",
  // },
  // completed: {
  //   label: "Finalizado",
  //   className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  //   bgClassName: "bg-emerald-50",
  //   icon: <FileCheck className="h-3.5 w-3.5" />,
  //   description: "Proceso completado satisfactoriamente",
  // },
};

export default vehicleStatusMap;
