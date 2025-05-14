import type React from "react";

import { useState } from "react";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  getDay,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  FileText,
  User,
  Shield,
  Car,
  X,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { useToast } from "~/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  EventSummaryPopup,
  type AnyEvent,
} from "~/components/calendar/event-summary-popup";
import { useRouter } from "@tanstack/react-router";

// Event types with color coding
const EVENT_TYPES = {
  CLIENT: {
    label: "Cliente",
    color: "bg-green-100 border-green-300 text-green-700",
  },
  VEHICLE: {
    label: "Vehículo",
    color: "bg-amber-100 border-amber-300 text-amber-700",
  },
  CONTRACT: {
    label: "Contrato",
    color: "bg-blue-100 border-blue-300 text-blue-700",
  },
  VEHICLE_LOT: {
    label: "Lote",
    color: "bg-purple-100 border-purple-300 text-purple-700",
  },
  INSURANCE: {
    label: "Seguro",
    color: "bg-purple-100 border-purple-300 text-purple-700",
  },
  MEETING: {
    label: "Reunión",
    color: "bg-rose-100 border-rose-300 text-rose-700",
  },
  DELIVERY: {
    label: "Entrega",
    color: "bg-emerald-100 border-emerald-300 text-emerald-700",
  },
};

// Sample events data with more detailed information
const SAMPLE_EVENTS: AnyEvent[] = [
  {
    id: "1",
    title: "Firma de contrato - Juan Pérez",
    type: "CONTRACT",
    date: new Date(2025, 4, 6, 10, 0),
    endDate: new Date(2025, 4, 6, 11, 0),
    contract: {
      id: "CTR-2023-1001",
      amount: 950000,
    },
    client: {
      id: "client-1",
      name: "Juan Pérez",
    },
    vehicle: {
      id: "vehicle-1",
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
    },
    status: "pending",
  },
  // {
  //   id: "2",
  //   title: "Entrega de vehículo - María Rodríguez",
  //   type: "DELIVERY",
  //   date: new Date(2025, 4, 6, 14, 0),
  //   endDate: new Date(2025, 4, 6, 15, 30),
  //   client: { id: "client-2", name: "María Rodríguez" },
  //   vehicle: "Honda Civic 2023",
  //   status: "confirmed",
  // },
  // {
  //   id: "3",
  //   title: "Renovación de seguro - Carlos Gómez",
  //   type: "INSURANCE",
  //   date: new Date(2025, 4, 7, 11, 0),
  //   endDate: new Date(2025, 4, 7, 12, 0),
  //   // client: {

  //   //   id: "client-3",
  //   //   name: "Carlos Gómez",
  //   //   cedula: "001-1234567-8",
  //   //   phone: "809-555-1234",
  //   //   email: "ana.martinez@example.com",
  //   // },
  //   vehicle: "Hyundai Tucson 2022",
  //   status: "pending",
  // },
  {
    id: "4",
    title: "Nuevo cliente - Ana Martínez",
    type: "CLIENT",
    date: new Date(2025, 4, 8, 9, 0),
    endDate: new Date(2025, 4, 8, 10, 0),
    client: {
      id: "client-2",
      name: "Ana Martínez",
      cedula: "001-1234567-8",
      phone: "809-555-1234",
      email: "ana.martinez@example.com",
    },
    status: "confirmed",
  },
  {
    id: "5",
    title: "Ingreso de vehículo - Toyota RAV4",
    type: "VEHICLE",
    date: new Date(2025, 4, 9, 13, 0),
    endDate: new Date(2025, 4, 9, 16, 0),
    vehicle: {
      id: "vehicle-2",
      brand: "Toyota",
      model: "RAV4",
      year: 2023,
      price: 1350000,
      status: "Disponible",
    },
    status: "confirmed",
  },
  {
    id: "6",
    title: "Reunión de equipo - Ventas",
    type: "MEETING",
    date: new Date(2025, 4, 10, 15, 0),
    endDate: new Date(2025, 4, 10, 16, 0),
    status: "confirmed",
  },
  {
    id: "7",
    title: "Asignación de vehículo a lote",
    type: "VEHICLE_LOT",
    date: new Date(2025, 4, 11, 10, 0),
    endDate: new Date(2025, 4, 11, 11, 0),
    vehicle: {
      id: "vehicle-3",
      brand: "Honda",
      model: "CR-V",
      year: 2023,
    },
    lot: {
      id: "lot-1",
      name: "Lote Principal",
    },
    status: "confirmed",
  },
];

// Time slots for day view
const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => i + 8); // 8am to 7pm

export function Calendar() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("day");
  const [events, setEvents] = useState<AnyEvent[]>(SAMPLE_EVENTS);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AnyEvent | null>(null);
  const [eventPopupPosition, setEventPopupPosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const router = useRouter();

  // Get current view dates
  const getDaysForView = () => {
    if (view === "day") {
      return [currentDate];
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      // Month view
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
      const firstDayOfMonth = getDay(start);

      // Calculate the start date (may be in the previous month)
      const startDate = subDays(
        start,
        firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
      );

      // Calculate how many days to show (always show 6 weeks = 42 days)
      const daysToShow = 42;

      // Calculate the end date
      const endDate = addDays(startDate, daysToShow - 1);

      return eachDayOfInterval({ start: startDate, end: endDate });
    }
  };

  const daysToShow = getDaysForView();

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());

  const goToPrevious = () => {
    if (view === "day") {
      setCurrentDate(subDays(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subDays(currentDate, 7));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  // Filter events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  // Handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsQuickActionOpen(true);
  };

  // Handle event click
  const handleEventClick = (event: AnyEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);

    // Calculate position for the popup
    // For simplicity, we'll center it on the screen
    setEventPopupPosition(undefined);
  };

  // Handle quick action selection
  const handleQuickAction = (action: string) => {
    // Set the active form based on the selected action
    setActiveForm(action);

    // Navigate to the appropriate form with the selected date
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      switch (action) {
        case "Agregar Contrato":
          router.navigate({
            to: `/contracts/new`,
            search: { date: formattedDate },
          });
          break;
        case "Agregar Cliente":
          router.navigate({
            to: `/clients/new`,
            search: { date: formattedDate },
          });
          break;
        case "Agregar Seguro":
          router.navigate({
            to: `/insurance/new`,
            search: { date: formattedDate },
          });
          break;
        case "Agregar Vehículo":
          router.navigate({
            to: `/vehicles/register`,
            search: { date: formattedDate },
          });
          break;
        default:
          break;
      }
    }

    // Show success toast
    toast({
      title: "✅ Acción iniciada",
      description: `Has seleccionado: ${action}`,
      variant: "success",
    });

    // Close the dialog
    setIsQuickActionOpen(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const quickActionVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium">
            {view === "month"
              ? format(currentDate, "MMMM yyyy", { locale: es })
              : view === "week"
                ? `${format(daysToShow[0], "d MMM", { locale: es })} - ${format(daysToShow[daysToShow.length - 1], "d MMM yyyy", { locale: es })}`
                : format(currentDate, "d MMMM yyyy", { locale: es })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tabs
            defaultValue="day"
            value={view}
            onValueChange={setView}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="day">Día</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" onClick={goToToday}>
            Hoy
          </Button>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {view === "month" && (
            <div className="grid grid-cols-7 border-t">
              {/* Day headers */}
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                (day, i) => (
                  <div
                    key={day}
                    className="py-2 text-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                )
              )}

              {/* Calendar days */}
              {daysToShow.map((day, i) => {
                const dayEvents = getEventsForDay(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentDate);

                return (
                  <div
                    key={i}
                    className={cn(
                      "min-h-[100px] border-t border-r p-1 relative",
                      i % 7 === 6 && "border-r-0", // Remove right border for last column
                      !isCurrentMonth && "bg-muted/30 text-muted-foreground"
                    )}
                    onClick={() => handleDayClick(day)}
                  >
                    <div
                      className={cn(
                        "flex justify-center items-center h-7 w-7 rounded-full text-sm",
                        isToday
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted"
                      )}
                    >
                      {format(day, "d")}
                    </div>

                    <div className="mt-1 space-y-1 max-h-[80px] overflow-hidden">
                      {dayEvents.slice(0, 3).map((event) => (
                        <motion.div
                          key={event.id}
                          whileHover={{ scale: 1.02 }}
                          className={cn(
                            "text-xs px-2 py-1 rounded truncate border cursor-pointer",
                            EVENT_TYPES[event.type as keyof typeof EVENT_TYPES]
                              ?.color ||
                              "bg-gray-100 text-gray-800 border-gray-200"
                          )}
                          onClick={(e) => handleEventClick(event, e)}
                        >
                          {event.title}
                        </motion.div>
                      ))}

                      {dayEvents.length > 3 && (
                        <div className="text-xs text-center text-muted-foreground">
                          +{dayEvents.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === "week" && (
            <div className="flex flex-col">
              {/* Time header */}
              <div className="grid grid-cols-8 border-b">
                <div className="border-r p-2 text-center text-sm font-medium text-muted-foreground">
                  Hora
                </div>
                {daysToShow.map((day, i) => {
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div
                      key={i}
                      className={cn(
                        "p-2 text-center border-r",
                        isToday && "bg-primary/5 font-medium"
                      )}
                    >
                      <div className="text-sm">
                        {format(day, "EEE", { locale: es })}
                      </div>
                      <div
                        className={cn(
                          "inline-flex justify-center items-center h-7 w-7 rounded-full text-sm mt-1",
                          isToday
                            ? "bg-primary text-primary-foreground font-medium"
                            : ""
                        )}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time slots */}
              <div className="overflow-auto max-h-[600px]">
                {TIME_SLOTS.map((hour) => (
                  <div
                    key={hour}
                    className="grid grid-cols-8 border-b min-h-[80px]"
                  >
                    <div className="border-r p-2 text-center text-sm text-muted-foreground">
                      {hour}:00
                    </div>

                    {daysToShow.map((day, dayIndex) => {
                      const hourEvents = events.filter(
                        (event) =>
                          isSameDay(event.date, day) &&
                          event.date.getHours() === hour
                      );

                      return (
                        <div
                          key={dayIndex}
                          className="border-r p-1 relative"
                          onClick={() =>
                            handleDayClick(new Date(day.setHours(hour)))
                          }
                        >
                          {hourEvents.map((event) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileHover={{ scale: 1.02, zIndex: 20 }}
                              className={cn(
                                "absolute inset-x-1 p-2 rounded text-xs border shadow-sm cursor-pointer",
                                EVENT_TYPES[
                                  event.type as keyof typeof EVENT_TYPES
                                ]?.color ||
                                  "bg-gray-100 text-gray-800 border-gray-200",
                                "hover:shadow-md transition-shadow"
                              )}
                              style={{
                                top: "0.25rem",
                                height: "calc(100% - 0.5rem)",
                                zIndex: 10,
                              }}
                              onClick={(e) => handleEventClick(event, e)}
                            >
                              <div className="font-medium truncate">
                                {event.title}
                              </div>
                              <div className="truncate">
                                {event.type === "CLIENT" &&
                                  (event as any).client?.name}
                                {event.type === "VEHICLE" &&
                                  `${(event as any).vehicle?.brand} ${(event as any).vehicle?.model}`}
                                {event.type === "CONTRACT" &&
                                  (event as any).client?.name}
                                {event.type === "VEHICLE_LOT" &&
                                  `${(event as any).vehicle?.brand} ${(event as any).vehicle?.model}`}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "day" && (
            <div className="flex flex-col">
              <div className="text-center p-4 border-b">
                <div className="text-lg font-medium">
                  {format(currentDate, "EEEE d MMMM yyyy", { locale: es })}
                </div>
              </div>

              <div className="overflow-auto max-h-[600px]">
                {TIME_SLOTS.map((hour) => {
                  const hourEvents = events.filter(
                    (event) =>
                      isSameDay(event.date, currentDate) &&
                      event.date.getHours() === hour
                  );

                  return (
                    <div key={hour} className="flex border-b min-h-[80px]">
                      <div className="w-20 flex-shrink-0 border-r p-2 text-center text-sm text-muted-foreground">
                        {hour}:00
                      </div>

                      <div
                        className="flex-grow p-1 relative"
                        onClick={() =>
                          handleDayClick(new Date(currentDate.setHours(hour)))
                        }
                      >
                        {hourEvents.length === 0 ? (
                          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                            <Button variant="ghost" size="sm" className="h-8">
                              <Plus className="h-4 w-4 mr-1" />
                              Agregar
                            </Button>
                          </div>
                        ) : (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="space-y-2"
                          >
                            {hourEvents.map((event) => (
                              <motion.div
                                key={event.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className={cn(
                                  "p-3 rounded border shadow-sm cursor-pointer",
                                  EVENT_TYPES[
                                    event.type as keyof typeof EVENT_TYPES
                                  ]?.color ||
                                    "bg-gray-100 text-gray-800 border-gray-200",
                                  "hover:shadow-md transition-shadow"
                                )}
                                onClick={(e) => handleEventClick(event, e)}
                              >
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm mt-1 flex items-center justify-between">
                                  <span>
                                    {event.type === "CLIENT" &&
                                      (event as any).client?.name}
                                    {event.type === "VEHICLE" &&
                                      `${(event as any).vehicle?.brand} ${(event as any).vehicle?.model}`}
                                    {event.type === "CONTRACT" &&
                                      (event as any).client?.name}
                                    {event.type === "VEHICLE_LOT" &&
                                      `${(event as any).vehicle?.brand} ${(event as any).vehicle?.model}`}
                                  </span>
                                  <span>
                                    {format(event.date, "HH:mm")} -{" "}
                                    {format(event.endDate, "HH:mm")}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Action Dialog */}
      <Dialog open={isQuickActionOpen} onOpenChange={setIsQuickActionOpen}>
        <DialogContent
          className="sm:max-w-xl backdrop-blur-sm"
          showCloseButton={false}
        >
          <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </DialogClose>
          <AnimatePresence mode="wait">
            {/* Quick Action Selection View */}
            <motion.div
              key="quick-action"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl">
                  ¿Qué quieres hacer hoy?
                </DialogTitle>
                <DialogDescription>
                  {selectedDate &&
                    format(selectedDate, "EEEE d MMMM yyyy", { locale: es })}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors ease-in-out duration-200 cursor-pointer"
                  onClick={() => handleQuickAction("Agregar Contrato")}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-base">
                        Agregar Contrato
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Crea un nuevo contrato de venta
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors ease-in-out duration-200 cursor-pointer"
                  onClick={() => handleQuickAction("Agregar Cliente")}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-base">Agregar Cliente</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Registra un nuevo cliente en el sistema
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors ease-in-out duration-200 cursor-pointer"
                  onClick={() => handleQuickAction("Agregar Seguro")}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-base">Agregar Seguro</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Vincula una póliza de seguro al vehículo
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors ease-in-out duration-200 cursor-pointer"
                  onClick={() => handleQuickAction("Agregar Vehículo")}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Car className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-base">
                        Agregar Vehículo
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Añade un nuevo vehículo al inventario
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Event Summary Popup */}
      {selectedEvent && (
        <EventSummaryPopup
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          position={eventPopupPosition}
        />
      )}
    </div>
  );
}
