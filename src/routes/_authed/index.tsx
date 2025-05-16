import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DashboardStats } from "~/components/dashboard/dashboard-stats";
import { RecentSales } from "~/components/dashboard/recent-sales";
import { VehicleStatusGrid } from "~/components/dashboard/vehicle-status-grid";
import { SalesChart } from "~/components/dashboard/sales-chart";
import { UpcomingPayments } from "~/components/dashboard/upcoming-payments";
import { VehicleStatusChart } from "~/components/dashboard/vehicle-status-chart";
import { Button } from "~/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export const Route = createFileRoute("/_authed/")({
  component: Dashboard,
});

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  // Reset loading state when period changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  // Generate dummy data based on selected period
  const getPeriodData = () => {
    switch (selectedPeriod) {
      case "today":
        return {
          salesTotal: "RD$245,890",
          salesChange: "+5.2%",
          vehiclesSold: "3",
          vehiclesChange: "+2%",
          clientsNew: "2",
          clientsChange: "+1%",
          vehiclesInventory: "42",
          inventoryChange: "-1%",
        };
      case "7days":
        return {
          salesTotal: "RD$1,234,567",
          salesChange: "+12.1%",
          vehiclesSold: "12",
          vehiclesChange: "+8%",
          clientsNew: "9",
          clientsChange: "+6%",
          vehiclesInventory: "42",
          inventoryChange: "-3%",
        };
      case "30days":
        return {
          salesTotal: "RD$5,678,901",
          salesChange: "+20.1%",
          vehiclesSold: "34",
          vehiclesChange: "+12%",
          clientsNew: "28",
          clientsChange: "+14%",
          vehiclesInventory: "42",
          inventoryChange: "-8%",
        };
      case "3months":
        return {
          salesTotal: "RD$15,432,100",
          salesChange: "+25.3%",
          vehiclesSold: "87",
          vehiclesChange: "+18%",
          clientsNew: "65",
          clientsChange: "+22%",
          vehiclesInventory: "42",
          inventoryChange: "-12%",
        };
      case "6months":
        return {
          salesTotal: "RD$28,765,432",
          salesChange: "+32.7%",
          vehiclesSold: "156",
          vehiclesChange: "+24%",
          clientsNew: "112",
          clientsChange: "+28%",
          vehiclesInventory: "42",
          inventoryChange: "-15%",
        };
      case "12months":
        return {
          salesTotal: "RD$53,412,202",
          salesChange: "+45.2%",
          vehiclesSold: "312",
          vehiclesChange: "+35%",
          clientsNew: "245",
          clientsChange: "+42%",
          vehiclesInventory: "42",
          inventoryChange: "-18%",
        };
      default:
        return {
          salesTotal: "RD$1,234,567",
          salesChange: "+12.1%",
          vehiclesSold: "12",
          vehiclesChange: "+8%",
          clientsNew: "9",
          clientsChange: "+6%",
          vehiclesInventory: "42",
          inventoryChange: "-3%",
        };
    }
  };

  const periodData = getPeriodData();
  const periodLabels = {
    today: "Hoy",
    "7days": "Últimos 7 días",
    "30days": "30 Días",
    "3months": "3 Meses",
    "6months": "6 Meses",
    "12months": "12 Meses",
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    console.log("Dashboard refreshed");
  };

  // Dashboard skeleton loader
  const DashboardSkeleton = () => (
    <div className="space-y-4">
      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-1/3 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-1/3 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                  <Skeleton className="h-4 w-[60px] ml-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second row of charts skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-1/3 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-1/3 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-4 w-[60px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle grid skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-1/3 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-[120px] w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido de nuevo, aquí está el resumen de tu negocio para{" "}
            <span className="font-medium text-foreground">
              {periodLabels[
                selectedPeriod as keyof typeof periodLabels
              ].toLowerCase()}
            </span>
            .
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={handleRefresh}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>
      <Tabs
        defaultValue="7days"
        value={selectedPeriod}
        onValueChange={setSelectedPeriod}
        className="space-y-4"
      >
        <TabsList className="bg-card border">
          <TabsTrigger
            value="today"
            className="data-[state=active]:bg-background"
          >
            Hoy
          </TabsTrigger>
          <TabsTrigger
            value="7days"
            className="data-[state=active]:bg-background"
          >
            Últimos 7 días
          </TabsTrigger>
          <TabsTrigger
            value="30days"
            className="data-[state=active]:bg-background"
          >
            30 Días
          </TabsTrigger>
          <TabsTrigger
            value="3months"
            className="data-[state=active]:bg-background"
          >
            3 Meses
          </TabsTrigger>
          <TabsTrigger
            value="6months"
            className="data-[state=active]:bg-background"
          >
            6 Meses
          </TabsTrigger>
          <TabsTrigger
            value="12months"
            className="data-[state=active]:bg-background"
          >
            12 Meses
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-4">
            <DashboardStats
              salesTotal={periodData.salesTotal}
              salesChange={periodData.salesChange}
              vehiclesSold={periodData.vehiclesSold}
              vehiclesChange={periodData.vehiclesChange}
              clientsNew={periodData.clientsNew}
              clientsChange={periodData.clientsChange}
              vehiclesInventory={periodData.vehiclesInventory}
              inventoryChange={periodData.inventoryChange}
              period={selectedPeriod}
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 overflow-hidden border transition-all duration-200 hover:shadow-md">
                <CardHeader className="bg-card/50 backdrop-blur-sm border-b">
                  <CardTitle>Ventas por Día</CardTitle>
                  <CardDescription>
                    Ventas totales por día en el período seleccionado
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2 p-6">
                  <SalesChart period={selectedPeriod} />
                </CardContent>
              </Card>
              <Card className="col-span-3 overflow-hidden border transition-all duration-200 hover:shadow-md">
                <CardHeader className="bg-card/50 backdrop-blur-sm border-b">
                  <CardTitle>Rendimiento Global</CardTitle>
                  <CardDescription>
                    Has vendido {periodData.vehiclesSold} vehículos en{" "}
                    {periodLabels[
                      selectedPeriod as keyof typeof periodLabels
                    ].toLowerCase()}
                    .
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <RecentSales period={selectedPeriod} />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 overflow-hidden border transition-all duration-200 hover:shadow-md">
                <CardHeader className="bg-card/50 backdrop-blur-sm border-b">
                  <CardTitle>Estado de Vehículos</CardTitle>
                  <CardDescription>
                    Distribución actual de vehículos por estado
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <VehicleStatusChart period={selectedPeriod} />
                </CardContent>
              </Card>
              <Card className="col-span-3 overflow-hidden border transition-all duration-200 hover:shadow-md">
                <CardHeader className="bg-card/50 backdrop-blur-sm border-b">
                  <CardTitle>Pagos Próximos</CardTitle>
                  <CardDescription>
                    Pagos programados para los próximos días
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <UpcomingPayments period={selectedPeriod} />
                </CardContent>
              </Card>
            </div>
            <Card className="overflow-hidden border transition-all duration-200 hover:shadow-md">
              <CardHeader className="bg-card/50 backdrop-blur-sm border-b">
                <CardTitle>Inventario de Vehículos</CardTitle>
                <CardDescription>
                  Estado actual del inventario de vehículos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <VehicleStatusGrid period={selectedPeriod} />
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
}
