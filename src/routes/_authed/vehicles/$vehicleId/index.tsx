import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  ExternalLink,
  Copy,
  Zap,
  Fuel,
  Gauge,
  Calendar,
  Hash,
  Car,
  Key,
  GitFork,
  Palette,
  Users,
  Award,
  Rocket,
  Leaf,
  CloudFog,
  ShieldCheck,
  Radio,
  Wrench,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  TimerReset,
  Hourglass,
  FileCheck,
  FileText,
  Briefcase,
  Tag,
  Banknote,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { cn, formatCurrency } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toast } from "~/hooks/use-toast";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

// Vehicle type definition
type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  trim: string;
  color: string;
  vin: string;
  plate: string;
  price: number;
  status: VehicleStatus;
  mileage?: number;
  fuelType: string;
  transmission: string;
  engineSize: string;
  doors: number;
  seats: number;
  images: string[];
  purchasedBy?: {
    id: string;
    name: string;
    amount: number;
  };
  performance?: {
    acceleration: string;
    topSpeed: string;
    emissions: string;
    fuelEfficiency: string;
  };
  features: {
    exterior: string[];
    interior: string[];
    safety: string[];
    multimedia: string[];
    engine: string[];
    wheels: string[];
    convenience: string[];
    packages: string[];
  };
  dealerNotes?: string;
};

// Ship component for the importing status icon
function Ship({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className={className}
    >
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2" />
      <path d="M22 9H2v11" />
      <path d="M22 17H2" />
      <path d="M20 12H4" />
      <path d="M15 5h5v4h-5" />
      <path d="M4 5h5v4H4" />
      <path d="M12 5a4 4 0 0 0-4 4v13" />
      <path d="M12 5a4 4 0 0 1 4 4v13" />
    </svg>
  );
}

// Vehicle status types
type VehicleStatus =
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

// Update the vehicleStatusMap object with the standardized color scheme and icons
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
  financing: {
    label: "En financiamiento",
    className: "bg-purple-100 text-purple-800 border-purple-200",
    bgClassName: "bg-purple-50",
    icon: <Banknote className="h-3.5 w-3.5" />,
    description: "En proceso de aprobación de financiamiento",
  },
  sold: {
    label: "Vendido",
    className: "bg-green-100 text-green-800 border-green-200",
    bgClassName: "bg-green-50",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    description: "Venta completada",
  },
  unavailable: {
    label: "No disponible",
    className: "bg-red-100 text-red-800 border-red-200",
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
    className: "bg-amber-100 text-amber-800 border-amber-200",
    bgClassName: "bg-amber-50",
    icon: <Wrench className="h-3.5 w-3.5" />,
    description: "En proceso de preparación para venta",
  },
  pending_delivery: {
    label: "Entrega pendiente",
    className: "bg-sky-100 text-sky-800 border-sky-200",
    bgClassName: "bg-sky-50",
    icon: <Truck className="h-3.5 w-3.5" />,
    description: "Vendido, pendiente de entrega al cliente",
  },
  test_drive: {
    label: "Test drive",
    className: "bg-teal-100 text-teal-800 border-teal-200",
    bgClassName: "bg-teal-50",
    icon: <Car className="h-3.5 w-3.5" />,
    description: "Reservado para prueba de manejo",
  },
  maintenance: {
    label: "Mantenimiento",
    className: "bg-rose-100 text-rose-800 border-rose-200",
    bgClassName: "bg-rose-50",
    icon: <Wrench className="h-3.5 w-3.5" />,
    description: "En servicio de mantenimiento o reparación",
  },
  administrative: {
    label: "Gestión admin.",
    className: "bg-slate-100 text-slate-800 border-slate-200",
    bgClassName: "bg-slate-50",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    description: "En proceso de gestión administrativa",
  },
  with_offer: {
    label: "Con oferta",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    bgClassName: "bg-amber-50",
    icon: <Tag className="h-3.5 w-3.5" />,
    description: "Cliente ha realizado una oferta",
  },
  with_contract: {
    label: "Con contrato",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
    bgClassName: "bg-indigo-50",
    icon: <FileText className="h-3.5 w-3.5" />,
    description: "Contrato generado, pendiente de firma",
  },
  pending_payment: {
    label: "Pago pendiente",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    bgClassName: "bg-amber-50",
    icon: <TimerReset className="h-3.5 w-3.5" />,
    description: "Esperando confirmación de pago",
  },
  completed: {
    label: "Finalizado",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bgClassName: "bg-emerald-50",
    icon: <FileCheck className="h-3.5 w-3.5" />,
    description: "Proceso completado satisfactoriamente",
  },
};

// Icons for accordion categories
const categoryIcons: Record<string, React.ReactNode> = {
  "dealer-notes": <Info className="h-4 w-4 mr-2" />,
  exterior: <Car className="h-4 w-4 mr-2" />,
  interior: <Users className="h-4 w-4 mr-2" />,
  safety: <ShieldCheck className="h-4 w-4 mr-2" />,
  multimedia: <Radio className="h-4 w-4 mr-2" />,
  engine: <Zap className="h-4 w-4 mr-2" />,
  wheels: <GitFork className="h-4 w-4 mr-2" />,
  convenience: <Award className="h-4 w-4 mr-2" />,
  packages: <CheckCircle2 className="h-4 w-4 mr-2" />,
};

// Icons for performance metrics
const performanceIcons: Record<string, React.ReactNode> = {
  acceleration: <Rocket className="h-5 w-5" />,
  topSpeed: <Gauge className="h-5 w-5" />,
  emissions: <CloudFog className="h-5 w-5" />,
  fuelEfficiency: <Leaf className="h-5 w-5" />,
};

// Icons for key details
const keyDetailIcons: Record<string, React.ReactNode> = {
  vin: <Hash className="h-4 w-4 text-muted-foreground" />,
  plate: <Key className="h-4 w-4 text-muted-foreground" />,
  year: <Calendar className="h-4 w-4 text-muted-foreground" />,
  mileage: <Gauge className="h-4 w-4 text-muted-foreground" />,
  fuelType: <Fuel className="h-4 w-4 text-muted-foreground" />,
  transmission: <GitFork className="h-4 w-4 text-muted-foreground" />,
  engineSize: <Zap className="h-4 w-4 text-muted-foreground" />,
  doors: <Car className="h-4 w-4 text-muted-foreground" />,
  color: <Palette className="h-4 w-4 text-muted-foreground" />,
};

// Mock data for a vehicle
const vehicleData: Vehicle = {
  id: "1",
  brand: "Toyota",
  model: "Corolla",
  year: 2023,
  trim: "XSE CVT",
  color: "Rojo metálico",
  vin: "1HGCM82633A123456",
  plate: "A123456",
  price: 950000,
  status: "available",
  mileage: 1500,
  fuelType: "Gasolina",
  transmission: "Automática",
  engineSize: "1.8L",
  doors: 4,
  seats: 5,
  images: [
    "/placeholder.svg?key=j6w9e",
    "/placeholder.svg?key=adz9j",
    "/placeholder.svg?key=t39ln",
    "/placeholder.svg?key=9aj4r",
    "/placeholder.svg?key=pzahb",
    "/placeholder.svg?key=flvdy",
  ],
  performance: {
    acceleration: "7.5 segundos",
    topSpeed: "220 km/h",
    emissions: "CO2 149 g/km",
    fuelEfficiency: "44 km/l",
  },
  features: {
    exterior: [
      "Faros LED",
      "Luces diurnas LED",
      "Espejos laterales eléctricos",
      "Techo solar panorámico",
      "Llantas de aleación de 18 pulgadas",
      "Antena tipo aleta de tiburón",
    ],
    interior: [
      "Asientos de cuero",
      "Asientos delanteros calefaccionados",
      "Volante forrado en cuero",
      "Climatizador automático de doble zona",
      "Iluminación ambiental LED",
      "Asiento del conductor con ajuste eléctrico",
    ],
    safety: [
      "Sistema de frenado antibloqueo (ABS)",
      "Control de estabilidad electrónico (ESC)",
      "Airbags frontales, laterales y de cortina",
      "Cámara de visión trasera",
      "Sensores de estacionamiento delanteros y traseros",
      "Sistema de monitoreo de punto ciego",
    ],
    multimedia: [
      "Pantalla táctil de 8 pulgadas",
      "Sistema de navegación GPS",
      "Apple CarPlay y Android Auto",
      "Sistema de audio premium con 8 altavoces",
      "Bluetooth para llamadas y audio",
      "Cargador inalámbrico para smartphone",
    ],
    engine: [
      "Motor 1.8L 4 cilindros",
      "Potencia: 169 HP",
      "Torque: 205 Nm",
      "Sistema Start-Stop",
      "Modo de conducción ECO",
      "Dirección asistida eléctricamente",
    ],
    wheels: [
      "Llantas de aleación de 18 pulgadas",
      "Neumáticos 225/40R18",
      "Kit de reparación de neumáticos",
    ],
    convenience: [
      "Entrada sin llave",
      "Botón de encendido",
      "Control de crucero adaptativo",
      "Asistente de mantenimiento de carril",
      "Espejo retrovisor con atenuación automática",
      "Limpiaparabrisas con sensor de lluvia",
    ],
    packages: [
      "Paquete Premium",
      "Paquete de Seguridad Avanzada",
      "Paquete de Tecnología",
    ],
  },
  dealerNotes:
    "Este Toyota Corolla XSE CVT 2023 se encuentra en excelentes condiciones. Ha pasado por una inspección completa de 150 puntos y cuenta con garantía del fabricante vigente. El vehículo tiene un historial de servicio completo y ha sido mantenido según las especificaciones del fabricante.",
};

// Component for animated counter
const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
  duration = 1500,
}: {
  value: string | number;
  prefix?: string;
  suffix?: string;
  duration: number;
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const startTime = Date.now();
    const endValue =
      typeof value === "string"
        ? Number.parseFloat(value.replace(/[^0-9.-]+/g, ""))
        : value;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * endValue));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration]);

  return (
    <span ref={countRef}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Function to copy to clipboard with toast notification
const copyToClipboard = (text: string, description: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast({
      title: "Copiado al portapapeles",
      description,
    });
  });
};

export const Route = createFileRoute("/_authed/vehicles/$vehicleId/")({
  component: VehicleDetailPage,
});

export default function VehicleDetailPage() {
  const router = useRouter();
  const { vehicleId: id } = Route.useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // State for redirection check
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Check if we're on the "new" route and redirect if necessary
  useEffect(() => {
    // If the ID is "new", we should be on the registration page, not the detail page
    if (id === "new") {
      // Set the state to trigger the redirection
      setShouldRedirect(true);
      return;
    }

    // For all other IDs, load the vehicle data as normal
    const timer = setTimeout(() => {
      setVehicle(vehicleData);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id, router]);

  // Redirect only after the initial render
  useEffect(() => {
    if (shouldRedirect) {
      router.navigate({ replace: true, to: "/vehicles/register" });
    }
  }, [shouldRedirect, router]);

  // If we're on the "new" route, don't render anything as we'll be redirected
  if (id === "new") {
    return null;
  }

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setIsHeaderSticky(window.scrollY > headerHeight + 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle image navigation
  const nextImage = () => {
    if (!vehicle) return;
    setActiveImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    if (!vehicle) return;
    setActiveImageIndex(
      (prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length
    );
  };

  // Handle lightbox
  const openLightbox = () => {
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  if (isLoading || !vehicle) {
    return (
      <div className="container py-12 animate-pulse">
        <div className="h-8 w-32 bg-muted rounded mb-6"></div>
        <div className="h-12 w-3/4 bg-muted rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
          <div className="md:col-span-3 h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const statusConfig = vehicleStatusMap[vehicle.status];
  const isNew =
    vehicle.mileage === 0 ||
    vehicle.mileage === undefined ||
    vehicle.mileage < 100;

  return (
    <>
      {/* Sticky header */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-3 transform transition-all duration-300",
          isHeaderSticky
            ? "translate-y-0 shadow-md animate-in fade-in slide-in-from-top-2 duration-300"
            : "-translate-y-full"
        )}
      >
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Volver</span>
            </Button>
            <span className="text-sm font-medium">
              {vehicle.year} {vehicle.brand} {vehicle.model}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {formatCurrency(vehicle.price)}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Breadcrumbs */}
        <div
          className="flex items-center text-sm text-muted-foreground mb-6"
          ref={headerRef}
        >
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto mr-2 hover:bg-transparent"
            onClick={() => router.history.back()}
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            <span>Volver</span>
          </Button>
          <span className="mx-2">/</span>
          <span
            className="hover:underline cursor-pointer"
            onClick={() => router.navigate({ to: "/vehicles" })}
          >
            Vehículos
          </span>
          <span className="mx-2">/</span>
          <span>
            {vehicle.brand} {vehicle.model}
          </span>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left column - Thumbnails */}
          <div className="md:col-span-1 hidden md:flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {vehicle.images.map((image, index) => (
              <div
                key={index}
                className={cn(
                  "relative aspect-[4/3] rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200",
                  activeImageIndex === index
                    ? "border-primary shadow-md"
                    : "border-transparent hover:border-primary/50"
                )}
                onClick={() => setActiveImageIndex(index)}
                onMouseEnter={() => setHoveredImage(index)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${vehicle.brand} ${vehicle.model} - Imagen ${index + 1}`}
                  className={cn(
                    "object-cover transition-all duration-200",
                    activeImageIndex === index
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100",
                    hoveredImage === index ? "scale-110" : "scale-100"
                  )}
                />
              </div>
            ))}
          </div>

          {/* Right column - Main image and details */}
          <div className="md:col-span-3 space-y-8">
            {/* Main image carousel */}
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-muted/20 group shadow-md">
              <img
                src={vehicle.images[activeImageIndex] || "/placeholder.svg"}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="object-cover animate-in fade-in zoom-in-95 duration-300"
                onClick={openLightbox}
              />
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
                {activeImageIndex + 1} / {vehicle.images.length}
              </div>
            </div>

            {/* Mobile thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
              {vehicle.images.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative w-20 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200",
                    activeImageIndex === index
                      ? "border-primary shadow-sm"
                      : "border-transparent hover:border-primary/50"
                  )}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${vehicle.brand} ${vehicle.model} - Imagen ${index + 1}`}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Hero info section - Updated with standardized status tags */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
              <div className="flex flex-col gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {vehicle.year} {vehicle.brand} {vehicle.model}
                </h1>
                <h2 className="text-lg text-muted-foreground font-medium">
                  {vehicle.trim}
                </h2>

                {/* Status and condition badges - Using standardized styling */}
                <div className="flex flex-col gap-2 mt-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          className={cn(
                            "w-fit px-2.5 py-1 rounded-full flex items-center gap-1.5 border font-medium shadow-sm",
                            statusConfig.className
                          )}
                        >
                          {statusConfig.icon}
                          <span>{statusConfig.label}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="font-medium">
                        <p>{statusConfig.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Badge
                    className={cn(
                      "w-fit px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-sm",
                      isNew
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-800 border border-gray-300"
                    )}
                  >
                    {isNew ? (
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 mr-1" />
                    )}
                    {isNew ? "Nuevo" : "Usado"}
                  </Badge>
                </div>
              </div>

              {/* Price section with animated counter */}
              <div className="pt-2 border-t">
                <h2 className="text-3xl font-bold text-primary">
                  <AnimatedCounter
                    value={vehicle.price}
                    prefix="$"
                    duration={1500}
                  />
                </h2>
              </div>
            </div>

            {/* Purchase attribution banner (if sold) - Enhanced */}
            {vehicle.purchasedBy && (
              <Card className="border-primary/20 bg-primary/5 animate-in fade-in zoom-in-95 duration-300 delay-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Info className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <p className="text-sm">
                    Este vehículo fue comprado por{" "}
                    <Link
                      to={`/clients/$purchasedById`}
                      params={{ purchasedById: vehicle.purchasedBy.id }}
                      className="font-medium hover:underline"
                    >
                      {vehicle.purchasedBy.name}
                    </Link>{" "}
                    por un monto de{" "}
                    <span className="font-medium">
                      {formatCurrency(vehicle.purchasedBy.amount)}
                    </span>
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Section Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-sm text-muted-foreground">
                  INFORMACIÓN DEL VEHÍCULO
                </span>
              </div>
            </div>

            {/* Key details grid - Redesigned as cards */}
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-250">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Info className="h-4 w-4" />
                Información clave
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* VIN Card with Copy */}
                <TooltipProvider>
                  <Card className="bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors duration-200 overflow-hidden">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">
                          {keyDetailIcons["vin"]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground/70 mb-1">
                            VIN
                          </p>
                          <p className="font-semibold">{vehicle.vin}</p>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-70 hover:opacity-100 hover:bg-secondary/20"
                            onClick={() =>
                              copyToClipboard(
                                vehicle.vin,
                                "Número VIN copiado al portapapeles"
                              )
                            }
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copiar VIN</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardContent>
                  </Card>
                </TooltipProvider>

                {/* Plate Card with Copy */}
                <TooltipProvider>
                  <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        {keyDetailIcons["plate"]}
                        <div>
                          <p className="text-sm text-muted-foreground">Placa</p>
                          <p className="font-medium">{vehicle.plate}</p>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-50 hover:opacity-100"
                            onClick={() =>
                              copyToClipboard(
                                vehicle.plate,
                                "Número de placa copiado al portapapeles"
                              )
                            }
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copiar Placa</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardContent>
                  </Card>
                </TooltipProvider>

                {/* Year Card */}
                <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
                  <CardContent className="flex items-center gap-3 p-4">
                    {keyDetailIcons["year"]}
                    <div>
                      <p className="text-sm text-muted-foreground">Año</p>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Mileage Card */}
                {vehicle.mileage !== undefined && (
                  <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
                    <CardContent className="flex items-center gap-3 p-4">
                      {keyDetailIcons["mileage"]}
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Kilometraje
                        </p>
                        <p className="font-medium">
                          {vehicle.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Fuel Type Card */}
                <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
                  <CardContent className="flex items-center gap-3 p-4">
                    {keyDetailIcons["fuelType"]}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Combustible
                      </p>
                      <p className="font-medium">{vehicle.fuelType}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Transmission Card */}
                <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
                  <CardContent className="flex items-center gap-3 p-4">
                    {keyDetailIcons["transmission"]}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transmisión
                      </p>
                      <p className="font-medium">{vehicle.transmission}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Engine Size Card */}
                <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
                  <CardContent className="flex items-center gap-3 p-4">
                    {keyDetailIcons["engineSize"]}
                    <div>
                      <p className="text-sm text-muted-foreground">Motor</p>
                      <p className="font-medium">{vehicle.engineSize}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Doors/Seats Card */}
                <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
                  <CardContent className="flex items-center gap-3 p-4">
                    {keyDetailIcons["doors"]}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Puertas / Asientos
                      </p>
                      <p className="font-medium">
                        {vehicle.doors} puertas / {vehicle.seats} asientos
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Color Card */}
                <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
                  <CardContent className="flex items-center gap-3 p-4">
                    {keyDetailIcons["color"]}
                    <div className="flex-grow">
                      <p className="text-sm text-muted-foreground">Color</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{
                            backgroundColor: vehicle.color
                              .toLowerCase()
                              .includes("rojo")
                              ? "#e53e3e"
                              : undefined,
                          }}
                        ></div>
                        <span className="font-medium">{vehicle.color}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-sm text-muted-foreground">
                  RENDIMIENTO
                </span>
              </div>
            </div>

            {/* Stats & Performance Section - Enhanced with better contrast */}
            {vehicle.performance && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Rendimiento
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicle.performance.acceleration && (
                    <Card className="bg-secondary/10 border border-secondary/20 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary text-primary-foreground">
                            {performanceIcons["acceleration"]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground/70 mb-1">
                              0-100 km/h
                            </div>
                            <div className="text-xl font-bold">
                              {vehicle.performance.acceleration}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {vehicle.performance.topSpeed && (
                    <Card className="bg-secondary/10 border border-secondary/20 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary text-primary-foreground">
                            {performanceIcons["topSpeed"]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground/70 mb-1">
                              Velocidad máxima
                            </div>
                            <div className="text-xl font-bold">
                              {vehicle.performance.topSpeed}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {vehicle.performance.emissions && (
                    <Card className="bg-secondary/10 border border-secondary/20 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary text-primary-foreground">
                            {performanceIcons["emissions"]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground/70 mb-1">
                              Emisiones
                            </div>
                            <div className="text-xl font-bold">
                              {vehicle.performance.emissions}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {vehicle.performance.fuelEfficiency && (
                    <Card className="bg-secondary/10 border border-secondary/20 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary text-primary-foreground">
                            {performanceIcons["fuelEfficiency"]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground/70 mb-1">
                              Rendimiento
                            </div>
                            <div className="text-xl font-bold">
                              {vehicle.performance.fuelEfficiency}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Section Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-sm text-muted-foreground">
                  CARACTERÍSTICAS Y EQUIPAMIENTO
                </span>
              </div>
            </div>

            {/* Expandable Feature Sections - Enhanced */}
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-350">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Características
              </h3>
              <Card className="border shadow-sm">
                <Accordion type="single" collapsible className="w-full">
                  {vehicle.dealerNotes && (
                    <AccordionItem value="dealer-notes">
                      <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-semibold text-base">
                        <div className="flex items-center">
                          {categoryIcons["dealer-notes"]}
                          Notas del concesionario
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-1 bg-muted/20">
                        <p className="text-muted-foreground">
                          {vehicle.dealerNotes}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  <AccordionItem value="exterior">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-semibold text-base">
                      <div className="flex items-center">
                        {categoryIcons["exterior"]}
                        Características exteriores
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 bg-muted/20">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vehicle.features.exterior.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 py-1.5 border-b last:border-0"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary/70" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="interior">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-semibold text-base">
                      <div className="flex items-center">
                        {categoryIcons["interior"]}
                        Características interiores
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 bg-muted/20">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vehicle.features.interior.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 py-1.5 border-b last:border-0"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary/70" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="safety">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-semibold text-base">
                      <div className="flex items-center">
                        {categoryIcons["safety"]}
                        Seguridad
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 bg-muted/20">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vehicle.features.safety.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 py-1.5 border-b last:border-0"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary/70" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="multimedia">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-semibold text-base">
                      <div className="flex items-center">
                        {categoryIcons["multimedia"]}
                        Multimedia / Infoentretenimiento
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 bg-muted/20">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vehicle.features.multimedia.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 py-1.5 border-b last:border-0"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary/70" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="engine">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-semibold text-base">
                      <div className="flex items-center">
                        {categoryIcons["engine"]}
                        Motor / Tren motriz
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 bg-muted/20">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vehicle.features.engine.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 py-1.5 border-b last:border-0"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary/70" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="wheels">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-semibold text-base">
                      <div className="flex items-center">
                        {categoryIcons["wheels"]}
                        Ruedas y suspensión
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 bg-muted/20">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vehicle.features.wheels.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 py-1.5 border-b last:border-0"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary/70" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="convenience">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-semibold text-base">
                      <div className="flex items-center">
                        {categoryIcons["convenience"]}
                        Comodidad y conveniencia
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 bg-muted/20">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vehicle.features.convenience.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 py-1.5 border-b last:border-0"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary/70" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  {vehicle.features.packages.length > 0 && (
                    <AccordionItem value="packages">
                      <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 font-semibold text-base">
                        <div className="flex items-center">
                          {categoryIcons["packages"]}
                          Paquetes y equipamiento
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-1 bg-muted/20">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {vehicle.features.packages.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 py-1.5 border-b last:border-0"
                            >
                              <CheckCircle2 className="h-4 w-4 text-primary/70" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </Card>
            </div>

            {/* Call to action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button size="lg" className="gap-2 shadow-sm">
                <ExternalLink className="h-4 w-4" />
                <span>Ver contrato</span>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 shadow-sm">
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al inventario</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 rounded-full z-10"
            onClick={closeLightbox}
          >
            <X className="h-4 w-4" />
          </Button>
          <div
            className="relative w-full max-w-5xl aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={vehicle.images[activeImageIndex] || "/placeholder.svg"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="object-contain animate-in zoom-in-95 duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
              {activeImageIndex + 1} / {vehicle.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
