import { createFileRoute } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { UserTable } from "~/components/settings/user-table";
import { SubscriptionPanel } from "~/components/settings/subscription-panel";
import { useState, useEffect } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export const Route = createFileRoute("/_authed/settings")({
  component: SettingsPage,
});

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dealer");

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Reset loading state when tab changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeTab]);

  // Settings skeleton loaders for each tab
  const DealerInfoSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );

  const UsersSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table header */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Table */}
          <div className="border rounded-md">
            {/* Header row */}
            <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted/40">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>

            {/* Data rows */}
            {[...Array(5)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-5 gap-4 p-4 border-b"
              >
                {[...Array(5)].map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SubscriptionSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          <div className="pt-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
      </div>
      <Tabs
        defaultValue="dealer"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="dealer">Información del Dealer</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="subscription">Suscripción</TabsTrigger>
        </TabsList>

        <TabsContent value="dealer" className="space-y-4">
          {isLoading ? (
            <DealerInfoSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Información del Dealer</CardTitle>
                <CardDescription>
                  Actualiza la información de tu concesionario.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dealer-name">Nombre del Dealer</Label>
                    <Input
                      id="dealer-name"
                      placeholder="Nombre del concesionario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dealer-id">RNC/Cédula</Label>
                    <Input id="dealer-id" placeholder="RNC o Cédula" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealer-address">Dirección</Label>
                  <Textarea
                    id="dealer-address"
                    placeholder="Dirección completa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dealer-phone">Teléfono</Label>
                    <Input
                      id="dealer-phone"
                      placeholder="Teléfono de contacto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dealer-email">Email</Label>
                    <Input
                      id="dealer-email"
                      type="email"
                      placeholder="Email de contacto"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Guardar Cambios</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {isLoading ? (
            <UsersSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Usuarios del Sistema</CardTitle>
                <CardDescription>
                  Administra los usuarios que tienen acceso al sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent
          value="subscription"
          className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-5 duration-300"
        >
          {isLoading ? <SubscriptionSkeleton /> : <SubscriptionPanel />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
