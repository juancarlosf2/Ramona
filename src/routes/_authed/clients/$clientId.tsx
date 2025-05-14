import { createFileRoute, useRouter } from "@tanstack/react-router";

import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Save, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getInitials } from "~/lib/utils";
import { ClientTimeline } from "~/components/clients/client-timeline";
import { ClientVehicles } from "~/components/clients/client-vehicles";
import { ClientContracts } from "~/components/clients/client-contracts";
import { ClientFinancials } from "~/components/clients/client-financials";
import { ClientContactCard } from "~/components/clients/client-contact-card";
import { ClientEditForm } from "~/components/clients/client-edit-form";
import { Toaster } from "~/components/toaster";

// Mock client data - in a real app, this would come from an API
const clientData = {
  id: "1",
  name: "Juan Pérez",
  email: "juan.perez@example.com",
  phone: "809-555-1234",
  cedula: "001-1234567-8",
  address: "Calle Principal #123, Santo Domingo",
  status: "active",
  lastContact: "2023-11-15",
  notes: "Interesado en sedanes de gama media",
};

export const Route = createFileRoute("/_authed/clients/$clientId")({
  component: ClientDetailsPage,
});

export default function ClientDetailsPage() {
  const router = useRouter();
  const params = Route.useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("timeline");
  const [isEditing, setIsEditing] = useState(false);
  const [client, setClient] = useState(clientData);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle save changes
  const handleSaveChanges = (updatedClient: any) => {
    setClient(updatedClient);
    setIsEditing(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="container py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumbs and header */}
      <div className="flex flex-col space-y-1.5 mb-6">
        <div className="flex items-center text-sm text-muted-foreground mb-1">
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
            onClick={() => router.navigate({ to: "/clients" })}
          >
            Clientes
          </span>
          <span className="mx-2">/</span>
          <span>{client.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handleEditToggle}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Editar</span>
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleCancelEdit}
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancelar</span>
              </Button>
              <Button
                type="submit"
                form="client-edit-form"
                size="sm"
                className="gap-1"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Guardar cambios</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-1 space-y-6">
          {/* Client profile card */}
          <Card className="overflow-hidden border-none shadow-md animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
            <CardHeader className="bg-primary/5 pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {!isEditing && (
                    <>
                      <Avatar className="h-16 w-16 border-4 border-background bg-primary/10">
                        <AvatarFallback className="text-xl font-semibold text-primary">
                          {getInitials(client.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{client.name}</CardTitle>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isEditing ? (
                <ClientEditForm
                  client={client}
                  onSave={handleSaveChanges}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <ClientContactCard client={client} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-6">
          {/* Tabs for different sections */}
          <Tabs
            defaultValue="timeline"
            value={activeTab}
            onValueChange={setActiveTab}
            className="animate-in fade-in slide-in-from-right-4 duration-500 delay-150"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Actividad
              </TabsTrigger>
              <TabsTrigger
                value="vehicles"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Vehículos
              </TabsTrigger>
              <TabsTrigger
                value="contracts"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Contratos
              </TabsTrigger>
              <TabsTrigger
                value="financials"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Finanzas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-0 space-y-4">
              <ClientTimeline
                clientId={params.clientId}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="vehicles" className="mt-0 space-y-4">
              <ClientVehicles
                clientId={params.clientId}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="contracts" className="mt-0 space-y-4">
              <ClientContracts
                clientId={params.clientId}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="financials" className="mt-0 space-y-4">
              <ClientFinancials
                clientId={params.clientId}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
