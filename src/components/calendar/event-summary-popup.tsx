import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Car,
  FileText,
  ParkingMeterIcon as Parking,
  Calendar,
  Clock,
  Phone,
  Mail,
  Edit,
  X,
  ExternalLink,
  Hash,
  DollarSign,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { cn, getInitials, formatCurrency } from "~/lib/utils";
import { useRouter } from "@tanstack/react-router";

// Event types
export type EventType =
  | "CLIENT"
  | "VEHICLE"
  | "CONTRACT"
  | "VEHICLE_LOT"
  | "MEETING"
  | "DELIVERY"
  | "INSURANCE";

// Base event interface
export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  endDate: Date;
  status?: string;
}

// Client event interface
export interface ClientEvent extends CalendarEvent {
  type: "CLIENT";
  client: {
    id: string;
    name: string;
    cedula?: string;
    phone?: string;
    email?: string;
  };
}

// Vehicle event interface
export interface VehicleEvent extends CalendarEvent {
  type: "VEHICLE";
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    status: string;
  };
}

// Contract event interface
export interface ContractEvent extends CalendarEvent {
  type: "CONTRACT";
  contract: {
    id: string;
    amount: number;
  };
  client: {
    id: string;
    name: string;
  };
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
  };
}

// Vehicle lot event interface
export interface VehicleLotEvent extends CalendarEvent {
  type: "VEHICLE_LOT";
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
  };
  lot?: {
    id: string;
    name: string;
  };
}

// Union type for all event types
export type AnyEvent =
  | ClientEvent
  | VehicleEvent
  | ContractEvent
  | VehicleLotEvent
  | CalendarEvent;

// Props for the event summary popup
interface EventSummaryPopupProps {
  event: AnyEvent;
  onClose: () => void;
  position?: { x: number; y: number };
}

export function EventSummaryPopup({
  event,
  onClose,
  position,
}: EventSummaryPopupProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Get the appropriate icon based on event type
  const getEventIcon = () => {
    switch (event.type) {
      case "CLIENT":
        return <User className="h-5 w-5 text-green-600" />;
      case "VEHICLE":
        return <Car className="h-5 w-5 text-amber-600" />;
      case "CONTRACT":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "VEHICLE_LOT":
        return <Parking className="h-5 w-5 text-purple-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  // Get the appropriate title based on event type
  const getEventTitle = () => {
    switch (event.type) {
      case "CLIENT":
        return "Nuevo cliente registrado";
      case "VEHICLE":
        return "Vehículo ingresado al inventario";
      case "CONTRACT":
        return "Contrato creado";
      case "VEHICLE_LOT":
        return "Vehículo asignado al lote";
      default:
        return event.title;
    }
  };

  // Handle the CTA button click
  const handleCtaClick = () => {
    switch (event.type) {
      case "CLIENT":
        router.navigate({
          to: `/clients/$clientId`,
          params: { clientId: (event as ClientEvent).client.id },
        });
        break;
      case "VEHICLE":
        router.navigate({
          to: `/vehicles/$vehicleId`,
          params: { vehicleId: (event as VehicleEvent).vehicle.id },
        });
        break;
      case "CONTRACT":
        router.navigate({
          to: `/contracts/$contractId`,
          params: { contractId: (event as ContractEvent).contract.id },
        });
        break;
      case "VEHICLE_LOT":
        router.navigate({ to: `/vehicles` });
        break;
      default:
        break;
    }
    onClose();
  };

  // Get the CTA button text based on event type
  const getCtaText = () => {
    switch (event.type) {
      case "CLIENT":
        return "Ver perfil del cliente";
      case "VEHICLE":
        return "Ver ficha del vehículo";
      case "CONTRACT":
        return "Ver contrato completo";
      case "VEHICLE_LOT":
        return "Ver inventario";
      default:
        return "Ver detalles";
    }
  };

  // Render the appropriate content based on event type
  const renderEventContent = () => {
    switch (event.type) {
      case "CLIENT":
        const clientEvent = event as ClientEvent;
        return (
          <>
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10 border-2 border-green-100 bg-green-50">
                <AvatarFallback className="text-green-700 font-medium">
                  {getInitials(clientEvent.client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{clientEvent.client.name}</h3>
                {clientEvent.client.cedula && (
                  <p className="text-sm text-muted-foreground">
                    Cédula: {clientEvent.client.cedula}
                  </p>
                )}
              </div>
            </div>
            {(clientEvent.client.phone || clientEvent.client.email) && (
              <div className="space-y-2 mb-3">
                {clientEvent.client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{clientEvent.client.phone}</span>
                  </div>
                )}
                {clientEvent.client.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{clientEvent.client.email}</span>
                  </div>
                )}
              </div>
            )}
          </>
        );

      case "VEHICLE":
        const vehicleEvent = event as VehicleEvent;
        return (
          <>
            <div className="mb-3">
              <h3 className="font-medium">
                {vehicleEvent.vehicle.year} {vehicleEvent.vehicle.brand}{" "}
                {vehicleEvent.vehicle.model}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">
                    {formatCurrency(vehicleEvent.vehicle.price)}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800"
                  )}
                >
                  {vehicleEvent.vehicle.status}
                </Badge>
              </div>
            </div>
          </>
        );

      case "CONTRACT":
        const contractEvent = event as ContractEvent;
        return (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{contractEvent.contract.id}</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8 border-2 border-blue-100 bg-blue-50">
                <AvatarFallback className="text-blue-700 font-medium text-xs">
                  {getInitials(contractEvent.client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{contractEvent.client.name}</h3>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <Badge
                variant="outline"
                className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
              >
                {contractEvent.vehicle.year} {contractEvent.vehicle.brand}{" "}
                {contractEvent.vehicle.model}
              </Badge>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">
                  {formatCurrency(contractEvent.contract.amount)}
                </span>
              </div>
            </div>
          </>
        );

      case "VEHICLE_LOT":
        const vehicleLotEvent = event as VehicleLotEvent;
        return (
          <>
            <div className="mb-3">
              <h3 className="font-medium">
                {vehicleLotEvent.vehicle.year} {vehicleLotEvent.vehicle.brand}{" "}
                {vehicleLotEvent.vehicle.model}
              </h3>
            </div>
            {vehicleLotEvent.lot && (
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Lote: {vehicleLotEvent.lot.name}</span>
              </div>
            )}
          </>
        );

      default:
        return <p>{event.title}</p>;
    }
  };

  // Position styles for the popup
  const positionStyles = position
    ? {
        position: "absolute" as const,
        top: `${position.y}px`,
        left: `${position.x}px`,
      }
    : {};

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={(e) => {
          // Close when clicking outside the card
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          className="z-50 w-full max-w-sm"
          style={positionStyles}
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="pb-2 relative">
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit action
                  }}
                >
                  <Edit className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {getEventIcon()}
                </motion.div>
                <h2 className="text-lg font-semibold">{getEventTitle()}</h2>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{format(event.date, "d 'de' MMMM", { locale: es })}</span>
                <Clock className="h-3.5 w-3.5 ml-2" />
                <span>{format(event.date, "h:mm a", { locale: es })}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-4">{renderEventContent()}</CardContent>

            <CardFooter className="flex justify-end pt-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="sm" className="gap-1" onClick={handleCtaClick}>
                  {getCtaText()}
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
