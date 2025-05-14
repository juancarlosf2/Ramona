import { cn } from "~/lib/utils";

type StatusType =
  | "active"
  | "interested"
  | "in-process"
  | "follow-up"
  | "inactive"
  | "blacklisted"
  | "test-drive"
  | "contract-signed"
  | "vehicle-delivered"
  | "returning";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  { label: string; className: string; icon?: string }
> = {
  active: {
    label: "Activo",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "🟢",
  },
  interested: {
    label: "Interesado",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "🔵",
  },
  "in-process": {
    label: "En proceso",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "🟡",
  },
  "follow-up": {
    label: "Requiere seguimiento",
    className: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "🟣",
  },
  inactive: {
    label: "Inactivo",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: "🔴",
  },
  blacklisted: {
    label: "Bloqueado",
    className: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "⚫",
  },
  "test-drive": {
    label: "Test drive agendado",
    className: "bg-sky-100 text-sky-800 border-sky-200",
    icon: "🧊",
  },
  "contract-signed": {
    label: "Contrato firmado",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: "🧾",
  },
  "vehicle-delivered": {
    label: "Vehículo entregado",
    className: "bg-teal-100 text-teal-800 border-teal-200",
    icon: "📦",
  },
  returning: {
    label: "Cliente recurrente",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "🔁",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
