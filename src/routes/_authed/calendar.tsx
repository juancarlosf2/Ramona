import { createFileRoute } from "@tanstack/react-router";

import { Calendar } from "~/components/calendar/calendar";
import { useState, useEffect } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export const Route = createFileRoute("/_authed/calendar")({
  component: CalendarPage,
});

export default function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Calendar skeleton loader
  const CalendarSkeleton = () => (
    <div className="space-y-6">
      {/* Month navigation skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Calendar grid skeleton */}
      <div className="space-y-2">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>

        {/* Calendar days */}
        {[...Array(5)].map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {[...Array(7)].map((_, dayIndex) => (
              <Skeleton key={dayIndex} className="h-28 w-full rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Calendario de actividades
        </h1>
      </div>

      {isLoading ? <CalendarSkeleton /> : <Calendar />}
    </div>
  );
}
