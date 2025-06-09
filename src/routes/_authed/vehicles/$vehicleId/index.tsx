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
import { cn, formatCurrency } from "~/lib/utils";
import { vehicleStatusMap } from "~/lib/vehicle-status-config";
import {
  translateTransmission,
  translateFuelType,
  translateCondition,
} from "~/lib/vehicle-translations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toast } from "~/hooks/use-toast";
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import type { VehicleById, VehicleStatus } from "~/types/vehicle";
import {
  vehicleByIdQueryOptions,
  useSuspenseVehicle,
} from "~/hooks/useSupabaseData";

// Extended vehicle type for mock data (includes additional fields not in database)
type ExtendedVehicle = VehicleById & {
  // TODO: These fields don't exist in the actual database schema yet
  // Temporarily commented out until database is updated
  purchasedBy?: {
    id: string;
    name: string;
    amount: number;
    contractDate: string;
    cedula?: string;
    email?: string;
  };
  performance?: {
    acceleration: string;
    topSpeed: string;
    emissions: string;
    fuelEfficiency: string;
  };
  features?: {
    exterior: string[];
    interior: string[];
    safety: string[];
    multimedia: string[];
    engine: string[];
    wheels: string[];
    convenience: string[];
    packages: string[];
  };
  // Note: dealerNotes field doesn't exist in database yet - using description field instead
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

// TODO: Mock data removed - now using real data from database via useSuspenseVehicle hook

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
  loader: async ({ context, params: { vehicleId } }) => {
    // Skip data loading if this is the "new" route
    if (vehicleId === "new") {
      throw redirect({ to: "/vehicles/register", replace: true });
    }

    // Use queryClient.ensureQueryData to prefetch vehicle data on the server
    // The queryClient is available through the router context via routerWithQueryClient
    const queryClient = (context as any).queryClient;
    if (queryClient) {
      await queryClient.ensureQueryData(vehicleByIdQueryOptions(vehicleId));
    }
  },
  component: VehicleDetailPage,
});

export default function VehicleDetailPage() {
  const router = useRouter();
  const { vehicleId: id } = Route.useParams();

  // Use suspense query to get vehicle data
  const { data: vehicle } = useSuspenseVehicle(id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // State for redirection check
  const [shouldRedirect, setShouldRedirect] = useState(false);

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
    if (!vehicle?.images || vehicle.images.length === 0) return;
    setActiveImageIndex((prev) => (prev + 1) % (vehicle.images?.length || 1));
  };

  const prevImage = () => {
    if (!vehicle?.images || vehicle.images.length === 0) return;
    setActiveImageIndex(
      (prev) =>
        (prev - 1 + (vehicle.images?.length || 1)) %
        (vehicle.images?.length || 1)
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

  const statusConfig = vehicleStatusMap[vehicle.status];
  // Use actual condition field instead of mileage-based logic
  const isNew = vehicle.condition === "new";

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
              {formatCurrency(Number(vehicle.price))}
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
            {(vehicle.images || []).map((image, index) => (
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
                src={
                  (vehicle.images && vehicle.images[activeImageIndex]) ||
                  "/placeholder.svg"
                }
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
                {activeImageIndex + 1} / {vehicle.images?.length || 0}
              </div>
            </div>

            {/* Mobile thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
              {(vehicle.images || []).map((image, index) => (
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
                  {vehicle.trim || "N/A"}
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
                    {translateCondition(vehicle.condition)}
                  </Badge>
                </div>
              </div>

              {/* Price section with animated counter */}
              <div className="pt-2 border-t">
                <h2 className="text-3xl font-bold text-primary">
                  <AnimatedCounter
                    value={Number.parseFloat(vehicle.price)}
                    prefix="$"
                    duration={1500}
                  />
                </h2>
              </div>
            </div>

            {/* TODO: Purchase attribution banner - purchasedBy field doesn't exist in database yet */}
            {/*
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
            */}

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
                          <p className="font-medium">
                            {vehicle.plate || "N/A"}
                          </p>
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
                                vehicle.plate || "",
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
                {vehicle.mileage !== null && vehicle.mileage !== undefined && (
                  <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
                    <CardContent className="flex items-center gap-3 p-4">
                      {keyDetailIcons["mileage"]}
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Kilometraje
                        </p>
                        <p className="font-medium">
                          {vehicle.mileage?.toLocaleString()} km
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
                      <p className="font-medium">
                        {translateFuelType(vehicle.fuelType)}
                      </p>
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
                      <p className="font-medium">
                        {translateTransmission(vehicle.transmission)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Engine Size Card */}
                <Card className="bg-muted/30 hover:bg-muted/40 transition-colors duration-200">
                  <CardContent className="flex items-center gap-3 p-4">
                    {keyDetailIcons["engineSize"]}
                    <div>
                      <p className="text-sm text-muted-foreground">Motor</p>
                      <p className="font-medium">
                        {vehicle.engineSize || "N/A"}
                      </p>
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
                        {vehicle.doors || "N/A"} puertas /{" "}
                        {vehicle.seats || "N/A"} asientos
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

            {/* TODO: Performance section commented out - performance field doesn't exist in database yet */}
            {/*
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
                              Emisiones CO₂
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
                              Eficiencia
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
            */}

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

            {/* Features and Equipment */}
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-350">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Características
              </h3>

              {/* Show description if available */}
              {vehicle.description ? (
                <Card className="border shadow-sm">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Notas del concesionario
                    </h4>
                    <p className="text-muted-foreground">
                      {vehicle.description}
                    </p>
                  </CardContent>
                </Card>
              ) : null}

              {/* TODO: Features section commented out - features field doesn't exist in database yet */}
              {/*
              {vehicle.features && (
                <Accordion type="multiple" className="w-full space-y-2">
                  {Object.entries(vehicle.features).map(([category, items]) => {
                    if (!items || items.length === 0) return null;
                    
                    const categoryName = {
                      exterior: "Características exteriores",
                      interior: "Características interiores", 
                      safety: "Sistemas de seguridad",
                      multimedia: "Multimedia y conectividad",
                      engine: "Especificaciones del motor",
                      wheels: "Llantas y neumáticos",
                      convenience: "Comodidad y conveniencia",
                      packages: "Paquetes de equipamiento"
                    }[category] || category;

                    return (
                      <AccordionItem
                        key={category}
                        value={category}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-2 font-medium">
                            {categoryIcons[category] || <CheckCircle2 className="h-4 w-4 mr-2" />}
                            <span>{categoryName}</span>
                            <Badge variant="secondary" className="ml-auto">
                              {items.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {items.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
              */}
            </div>

            {/* Call to action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button size="lg" className="gap-2 shadow-sm">
                <FileCheck className="h-4 w-4" />
                <span>Ver contrato</span>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 shadow-sm">
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al inventario</span>
              </Button>
              <Button variant="secondary" size="lg" className="gap-2 shadow-sm">
                <Briefcase className="h-4 w-4" />
                <span>Generar reporte</span>
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
              src={
                (vehicle.images && vehicle.images[activeImageIndex]) ||
                "/placeholder.svg"
              }
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
              {activeImageIndex + 1} / {vehicle.images?.length || 0}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
