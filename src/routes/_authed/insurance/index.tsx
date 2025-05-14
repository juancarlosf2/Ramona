import { createFileRoute, Link } from "@tanstack/react-router";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  XIcon,
  DownloadIcon,
  ChevronDownIcon,
  UserIcon,
} from "lucide-react";
import { format, differenceInMonths, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Badge } from "~/components/ui/badge";
import { insurances } from "~/components/insurance/insurance-data";
import { InsuranceSummary } from "~/components/insurance/insurance-summary";
import { InsuranceStatusBadge } from "~/components/insurance/insurance-status-badge";

export const Route = createFileRoute("/_authed/insurance/")({
  component: InsurancePage,
});

export default function InsurancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [sortBy, setSortBy] = useState<"expiryDate" | "creationDate">(
    "expiryDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter insurances to only include those with user-specific information
  const userAssociatedInsurances = insurances.filter(
    (insurance) => insurance.clientName && insurance.clientName.trim() !== ""
  );

  // Filter insurances based on search query and filters
  const filteredInsurances = userAssociatedInsurances.filter((insurance) => {
    const searchString =
      `${insurance.id} ${insurance.vehicleInfo} ${insurance.clientName || ""} ${
        insurance.vin || ""
      }`.toLowerCase();

    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter
      ? insurance.status === statusFilter
      : true;

    // Date range filtering
    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const insuranceDate = new Date(insurance.startDate);
      matchesDateRange =
        insuranceDate >= dateRange.from && insuranceDate <= dateRange.to;
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Sort insurances
  const sortedInsurances = [...filteredInsurances].sort((a, b) => {
    let valueA, valueB;

    if (sortBy === "expiryDate") {
      valueA = new Date(a.expiryDate).getTime();
      valueB = new Date(b.expiryDate).getTime();
    } else {
      valueA = new Date(a.startDate).getTime();
      valueB = new Date(b.startDate).getTime();
    }

    return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Reset filters
  const resetFilters = () => {
    setStatusFilter(null);
    setDateRange({ from: undefined, to: undefined });
    setSearchQuery("");
  };

  // Calculate the count of excluded insurances
  const excludedCount = insurances.length - userAssociatedInsurances.length;

  return (
    <motion.div
      className="flex flex-col gap-6 pb-10"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Seguros</h1>
            <p className="text-muted-foreground">
              Administra pólizas activas, vencidas o futuras.
            </p>
          </div>
          <Link to="/insurance/new">
            <Button
              className="group transition-all duration-300 ease-in-out bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              <PlusIcon className="mr-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              Nuevo Seguro
            </Button>
          </Link>
        </div>
      </div>

      <InsuranceSummary />

      {excludedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
          <UserIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">
              Filtro de usuario aplicado
            </h3>
            <p className="text-sm text-blue-600">
              Mostrando solo seguros asociados a usuarios. {excludedCount}{" "}
              seguros sin usuario asignado han sido filtrados.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-auto">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar seguro..."
            className="pl-8 w-full md:w-[300px] bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-white">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filtros
                {(statusFilter || dateRange.from) && (
                  <Badge
                    variant="secondary"
                    className="ml-2 rounded-sm px-1 font-normal"
                  >
                    {(statusFilter ? 1 : 0) + (dateRange.from ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Estado</h4>
                  <Select
                    value={statusFilter || ""}
                    onValueChange={(value) => setStatusFilter(value || null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="expiring_soon">Por vencer</SelectItem>
                      <SelectItem value="expired">Vencido</SelectItem>
                      <SelectItem value="cancelled">Anulado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    Fecha de creación
                  </h4>
                  <div className="grid gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">
                        Desde
                      </span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`justify-start text-left font-normal ${
                              !dateRange.from && "text-muted-foreground"
                            }`}
                          >
                            {dateRange.from
                              ? format(dateRange.from, "PPP", { locale: es })
                              : "Seleccionar"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) =>
                              setDateRange({ ...dateRange, from: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">
                        Hasta
                      </span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`justify-start text-left font-normal ${
                              !dateRange.to && "text-muted-foreground"
                            }`}
                          >
                            {dateRange.to
                              ? format(dateRange.to, "PPP", { locale: es })
                              : "Seleccionar"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) =>
                              setDateRange({ ...dateRange, to: date })
                            }
                            disabled={(date) =>
                              dateRange.from ? date < dateRange.from : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Ordenar por</h4>
                  <div className="flex items-center gap-2">
                    <Select
                      value={sortBy}
                      onValueChange={(value) =>
                        setSortBy(value as "expiryDate" | "creationDate")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expiryDate">
                          Fecha de vencimiento
                        </SelectItem>
                        <SelectItem value="creationDate">
                          Fecha de creación
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
                      />
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="mt-2"
                >
                  Limpiar filtros
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {statusFilter && (
            <Badge variant="outline" className="rounded-sm px-2 py-1">
              {statusFilter === "active"
                ? "Activo"
                : statusFilter === "expiring_soon"
                  ? "Por vencer"
                  : statusFilter === "expired"
                    ? "Vencido"
                    : "Anulado"}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setStatusFilter(null)}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {dateRange.from && dateRange.to && (
            <Badge variant="outline" className="rounded-sm px-2 py-1">
              {format(dateRange.from, "dd/MM/yy", { locale: es })} -{" "}
              {format(dateRange.to, "dd/MM/yy", { locale: es })}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      </div>

      {sortedInsurances.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <CalendarIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">
            No se encontraron seguros
          </h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
            No hay seguros asociados a usuarios que coincidan con tu búsqueda.
            Intenta con otros términos o crea un nuevo seguro.
          </p>
          <Link to="/insurance/new">
            <Button
              className="group transition-all duration-300 ease-in-out bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              <PlusIcon className="mr-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              Nuevo Seguro
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {sortedInsurances.map((insurance) => {
              const startDate = new Date(insurance.startDate);
              const expiryDate = new Date(insurance.expiryDate);
              const today = new Date();
              const daysUntilExpiry = Math.ceil(
                (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              );
              const validityMonths = differenceInMonths(expiryDate, startDate);
              const remainingDays = differenceInDays(
                expiryDate,
                new Date(
                  startDate.getFullYear(),
                  startDate.getMonth() + validityMonths,
                  startDate.getDate()
                )
              );

              const validityText =
                validityMonths === 12
                  ? "Válido durante 1 año"
                  : validityMonths === 1
                    ? "Válido durante 1 mes"
                    : `Válido durante ${validityMonths} meses${remainingDays > 0 ? ` y ${remainingDays} días` : ""}`;

              return (
                <TooltipProvider key={insurance.id}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Card className="overflow-hidden transition-all duration-150 border-2 border-transparent hover:border-primary/30">
                      <CardHeader className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold mb-2">
                              Seguro #{insurance.id}
                            </CardTitle>
                            <p className="text-sm font-medium mb-1.5">
                              {insurance.vehicleInfo}
                            </p>
                            {insurance.vin && (
                              <p className="text-xs text-muted-foreground">
                                VIN/Placa: {insurance.vin}
                              </p>
                            )}
                          </div>
                          <InsuranceStatusBadge status={insurance.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 py-4">
                        {insurance.clientName && (
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {insurance.clientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .substring(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-0.5">
                                {insurance.clientName}
                              </p>
                              {insurance.clientEmail && (
                                <p className="text-xs text-muted-foreground">
                                  {insurance.clientEmail}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm mt-1 mb-1">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{validityText}</span>
                        </div>

                        {insurance.status === "expiring_soon" &&
                          daysUntilExpiry > 0 && (
                            <motion.div
                              className="mt-4 text-sm"
                              animate={{
                                backgroundColor: [
                                  "#fef3c7",
                                  "#fdba74",
                                  "#fef3c7",
                                ],
                                transition: {
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "reverse",
                                },
                              }}
                            >
                              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                Vence en {daysUntilExpiry} días
                              </span>
                            </motion.div>
                          )}
                      </CardContent>
                      <CardFooter className="p-5 pt-4 flex justify-between bg-muted/20 border-t">
                        <TooltipProvider delayDuration={300}>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  to={`/insurance/$insuranceId`}
                                  params={{ insuranceId: insurance.id }}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="group"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-1 group-hover:scale-110 transition-all" />
                                    <span>Ver</span>
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver detalles del seguro</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="group"
                                >
                                  <DownloadIcon className="h-4 w-4 mr-1 group-hover:scale-110 transition-all" />
                                  <span>PDF</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Descargar seguro en PDF</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>

                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  to={`/insurance/$insuranceId/edit`}
                                  params={{ insuranceId: insurance.id }}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="group"
                                  >
                                    <XIcon className="h-4 w-4 mr-1 group-hover:scale-110 transition-all" />
                                    <span>Editar</span>
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar seguro</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="group"
                                >
                                  <XIcon className="h-4 w-4 mr-1 group-hover:scale-110 transition-all" />
                                  <span>Anular</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Anular seguro</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </TooltipProvider>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
