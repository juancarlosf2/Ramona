import type React from "react";

import { useState } from "react";
import {
  FileText,
  Car,
  Phone,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

interface TimelineEvent {
  id: string;
  type: "contract" | "test-drive" | "call" | "meeting" | "payment" | "service";
  title: string;
  description: string;
  date: string;
  time: string;
  staff: {
    name: string;
    initials: string;
  };
  metadata?: Record<string, any>;
}

// Mock timeline data
const timelineData: Record<string, TimelineEvent[]> = {
  "Noviembre 2023": [
    {
      id: "1",
      type: "contract",
      title: "Contrato firmado",
      description: "Contrato de compra para Toyota Corolla 2023",
      date: "15 Nov 2023",
      time: "14:30",
      staff: {
        name: "Carlos Mendez",
        initials: "CM",
      },
      metadata: {
        contractId: "CTR-2023-1234",
        amount: "$32,500.00",
      },
    },
    {
      id: "2",
      type: "test-drive",
      title: "Test drive realizado",
      description: "Test drive de Toyota Corolla 2023",
      date: "10 Nov 2023",
      time: "11:15",
      staff: {
        name: "Ana Martinez",
        initials: "AM",
      },
      metadata: {
        vehicle: "Toyota Corolla 2023",
        duration: "45 minutos",
      },
    },
  ],
  "Octubre 2023": [
    {
      id: "3",
      type: "call",
      title: "Llamada de seguimiento",
      description: "Discusión sobre opciones de financiamiento",
      date: "25 Oct 2023",
      time: "09:45",
      staff: {
        name: "Maria Rodriguez",
        initials: "MR",
      },
    },
    {
      id: "4",
      type: "meeting",
      title: "Reunión inicial",
      description: "Presentación de modelos y opciones",
      date: "15 Oct 2023",
      time: "16:00",
      staff: {
        name: "Juan Perez",
        initials: "JP",
      },
    },
  ],
};

// Icon mapping for event types
const eventIcons: Record<string, React.ReactNode> = {
  contract: <FileText className="h-4 w-4" />,
  "test-drive": <Car className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  meeting: <Calendar className="h-4 w-4" />,
  payment: <DollarSign className="h-4 w-4" />,
  service: <Settings className="h-4 w-4" />,
};

// Background color mapping for event types
const eventColors: Record<string, string> = {
  contract: "bg-blue-500",
  "test-drive": "bg-amber-500",
  call: "bg-green-500",
  meeting: "bg-purple-500",
  payment: "bg-emerald-500",
  service: "bg-orange-500",
};

interface ClientTimelineProps {
  clientId: string;
  isLoading: boolean;
}

export function ClientTimeline({ clientId, isLoading }: ClientTimelineProps) {
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>(
    {
      "Noviembre 2023": true,
      "Octubre 2023": true,
    }
  );

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="space-y-4">
              {[1, 2].map((j) => (
                <Card key={j} className="overflow-hidden">
                  <CardHeader className="p-4 pb-3">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-3 w-full mt-2" />
                    <Skeleton className="h-3 w-3/4 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(timelineData).map(([month, events]) => (
        <div
          key={month}
          className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{month}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => toggleMonth(month)}
            >
              {expandedMonths[month] ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {expandedMonths[month] && (
            <div className="space-y-4">
              {events.map((event, index) => (
                <Card
                  key={event.id}
                  className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-muted">
                          <AvatarFallback className="text-xs">
                            {event.staff.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.date}, {event.time} • {event.staff.name}
                          </CardDescription>
                        </div>
                      </div>

                      {event.type === "contract" && (
                        <Badge variant="outline" className="text-xs">
                          {event.metadata?.contractId}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>

                    {event.metadata && (
                      <div className="mt-2 pt-2 border-t flex flex-wrap gap-2">
                        {Object.entries(event.metadata).map(
                          ([key, value]) =>
                            key !== "contractId" && (
                              <Badge
                                key={key}
                                variant="secondary"
                                className="text-xs"
                              >
                                {typeof value === "string"
                                  ? value
                                  : JSON.stringify(value)}
                              </Badge>
                            )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
