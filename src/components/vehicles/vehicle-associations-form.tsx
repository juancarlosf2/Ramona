import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { VehicleFormValues } from "~/routes/vehicles/new/page";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Check, Info, Save, User } from "lucide-react";
import { Switch } from "~/components/ui/switch";

interface VehicleAssociationsFormProps {
  form: UseFormReturn<VehicleFormValues>;
  onAddAnother: (value: boolean) => void;
  addAnother: boolean;
}

export function VehicleAssociationsForm({
  form,
  onAddAnother,
  addAnother,
}: VehicleAssociationsFormProps) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);

  // Mock client search
  const handleClientSearch = (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API call delay
    setTimeout(() => {
      const mockResults = [
        {
          id: "client1",
          name: "Juan Pérez",
          email: "juan@example.com",
          cedula: "001-1234567-8",
          avatar: "/diverse-avatars.png",
        },
        {
          id: "client2",
          name: "María Rodríguez",
          email: "maria@example.com",
          cedula: "002-7654321-9",
          avatar: "/diverse-avatars.png",
        },
        {
          id: "client3",
          name: "Carlos Méndez",
          email: "carlos@example.com",
          cedula: "003-9876543-0",
          avatar: "/diverse-avatars.png",
        },
      ].filter(
        (client) =>
          client.name.toLowerCase().includes(query.toLowerCase()) ||
          client.cedula.includes(query) ||
          client.email.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  // Handle client selection
  const handleClientSelect = (client: any) => {
    form.setValue("clientId", client.id);
    form.setValue("clientName", client.name);
    setSearchResults([]);

    // Load contracts for this client
    setTimeout(() => {
      setContracts([
        {
          id: "contract1",
          number: "CTR-2023-1234",
          description: "Financiamiento Toyota Corolla",
        },
        {
          id: "contract2",
          number: "CTR-2023-5678",
          description: "Leasing Honda Civic",
        },
      ]);
    }, 300);
  };

  // Clear client selection
  const handleClearClient = () => {
    form.setValue("clientId", "");
    form.setValue("clientName", "");
    form.setValue("contractId", "");
    setContracts([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asociar a cliente existente</FormLabel>
              {!field.value ? (
                <div className="space-y-2">
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Buscar por nombre, cédula o email"
                        className="transition-all duration-150 pr-10"
                        onChange={(e) => handleClientSearch(e.target.value)}
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                        </div>
                      )}
                    </div>
                  </FormControl>

                  {searchResults.length > 0 && (
                    <div className="border rounded-md shadow-sm overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-200">
                      <ul className="divide-y">
                        {searchResults.map((client, index) => (
                          <li
                            key={client.id}
                            className="p-2 hover:bg-accent cursor-pointer transition-colors flex items-center gap-3"
                            onClick={() => handleClientSelect(client)}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={client.avatar || "/placeholder.svg"}
                                alt={client.name}
                              />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {client.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {client.cedula} • {client.email}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 border rounded-md animate-in fade-in-50 slide-in-from-top-2 duration-300">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="/diverse-avatars.png"
                      alt={form.watch("clientName")}
                    />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{form.watch("clientName")}</p>
                    <p className="text-sm text-muted-foreground">
                      Cliente seleccionado
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearClient}
                  >
                    Cambiar
                  </Button>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("clientId") && contracts.length > 0 && (
          <FormField
            control={form.control}
            name="contractId"
            render={({ field }) => (
              <FormItem className="animate-in fade-in-50 slide-in-from-top-5 duration-300">
                <FormLabel>Asociar a contrato generado</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="transition-all duration-150">
                      <SelectValue placeholder="Seleccionar contrato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contracts.map((contract, index) => (
                      <SelectItem
                        key={contract.id}
                        value={contract.id}
                        className="animate-in fade-in-50 slide-in-from-top-2"
                        style={{ animationDelay: `${index * 20}ms` }}
                      >
                        {contract.number} - {contract.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("clientId") && (
          <Alert className="animate-in fade-in-50 slide-in-from-top-5 duration-300 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Este vehículo será visible en el perfil de{" "}
              <span className="font-medium">{form.watch("clientName")}</span>
              {form.watch("contractId") &&
                " y podrá usarse en el contrato CTR-2023-1234"}
              .
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="pt-4 border-t">
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar y agregar otro vehículo
            </FormLabel>
            <p className="text-sm text-muted-foreground">
              Activa esta opción para agregar otro vehículo después de guardar
            </p>
          </div>
          <FormControl>
            <Switch
              checked={addAnother}
              onCheckedChange={onAddAnother}
              className="transition-all duration-200 data-[state=checked]:animate-pulse"
            />
          </FormControl>
        </FormItem>
      </div>
    </div>
  );
}
