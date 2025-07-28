import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "@tanstack/react-router";

// Instead of importing server functions directly, we'll use dynamic imports
// This prevents server-side code from being bundled with the client

export const QUERY_KEYS = {
  vehicles: ["vehicles"] as const,
  vehicle: (id: string) => ["vehicles", id] as const,
  clients: ["clients"] as const,
  contracts: ["contracts"] as const,
  dealers: ["dealers"] as const,
  concesionarios: ["concesionarios"] as const,
  concesionario: (id: string) => ["concesionarios", id] as const,
  profile: ["profile"] as const,
} as const;

// Query options for TanStack Router
export const vehiclesQueryOptions = () => ({
  queryKey: QUERY_KEYS.vehicles,
  queryFn: async () => {
    const { fetchVehicles } = await import("~/server/vehicles");
    return fetchVehicles();
  },
});

export const concesionariosQueryOptions = () => ({
  queryKey: QUERY_KEYS.concesionarios,
  queryFn: async () => {
    const { fetchConcesionarios } = await import("~/server/concesionarios");
    return fetchConcesionarios();
  },
});

export const vehicleByIdQueryOptions = (vehicleId: string) => ({
  queryKey: QUERY_KEYS.vehicle(vehicleId),
  queryFn: async () => {
    const { fetchVehicleById } = await import("~/server/vehicles");
    return fetchVehicleById({ data: { vehicleId } });
  },
});

export const concesionarioByIdQueryOptions = (concesionarioId: string) => ({
  queryKey: QUERY_KEYS.concesionario(concesionarioId),
  queryFn: async () => {
    const { fetchConcesionarioById } = await import("~/server/concesionarios");
    return fetchConcesionarioById({ data: { concesionarioId } });
  },
});

// Error handling utility
export const getErrorMessage = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Ocurrió un error inesperado";
};

// Query hooks with proper server function integration
export const useVehicleById = (vehicleId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.vehicle(vehicleId),
    queryFn: async () => {
      const { fetchVehicleById } = await import("~/server/vehicles");
      return fetchVehicleById({ data: { vehicleId } });
    },
    enabled: !!vehicleId,
  });
};

export const useConcesionarioById = (concesionarioId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.concesionario(concesionarioId),
    queryFn: async () => {
      const { fetchConcesionarioById } = await import("~/server/concesionarios");
      return fetchConcesionarioById({ data: { concesionarioId } });
    },
    enabled: !!concesionarioId,
  });
};

export const useVehicles = () => {
  return useQuery({
    queryKey: QUERY_KEYS.vehicles,
    queryFn: async () => {
      const { fetchVehicles } = await import("~/server/vehicles");
      return fetchVehicles();
    },
  });
};

export const useConcesionarios = () => {
  return useQuery({
    queryKey: QUERY_KEYS.concesionarios,
    queryFn: async () => {
      const { fetchConcesionarios } = await import("~/server/concesionarios");
      return fetchConcesionarios();
    },
  });
};

export const useClients = () => {
  return useQuery({
    queryKey: QUERY_KEYS.clients,
    queryFn: async () => {
      const { fetchClients } = await import("~/server/clients");
      return fetchClients();
    },
  });
};

export const useVehiclesSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.vehicles,
    queryFn: async () => {
      const { fetchVehicles } = await import("~/server/vehicles");
      return fetchVehicles();
    },
  });
};

// Alias for backward compatibility
export const useSuspenseVehicles = useVehiclesSuspense;

export const useClientsSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.clients,
    queryFn: async () => {
      const { fetchClients } = await import("~/server/clients");
      return fetchClients();
    },
  });
};

export const useContractsSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.contracts,
    queryFn: async () => {
      const { fetchContracts } = await import("~/server/contracts");
      return fetchContracts();
    },
  });
};

export const useDealerInfoSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.dealers,
    queryFn: async () => {
      const { fetchDealerInfo } = await import("~/server/dealers");
      return fetchDealerInfo();
    },
  });
};

export const useConcesionariosSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.concesionarios,
    queryFn: async () => {
      const { fetchConcesionarios } = await import("~/server/concesionarios");
      return fetchConcesionarios();
    },
  });
};

// Alias for backward compatibility
export const useSuspenseConcesionarios = useConcesionariosSuspense;

export const useMyProfileSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: async () => {
      const { fetchMyProfile } = await import("~/server/auth");
      return fetchMyProfile();
    },
  });
};

// Individual vehicle suspense hook
export const useVehicleSuspense = (vehicleId: string) => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.vehicle(vehicleId),
    queryFn: async () => {
      const { fetchVehicleById } = await import("~/server/vehicles");
      return fetchVehicleById({ data: { vehicleId } });
    },
  });
};

// Alias for backward compatibility
export const useSuspenseVehicle = useVehicleSuspense;

// Individual concesionario suspense hook
export const useConcesionarioSuspense = (concesionarioId: string) => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.concesionario(concesionarioId),
    queryFn: async () => {
      const { fetchConcesionarioById } = await import("~/server/concesionarios");
      return fetchConcesionarioById({ data: { concesionarioId } });
    },
  });
};

// Alias for backward compatibility
export const useSuspenseConcesionario = useConcesionarioSuspense;

// Mutation hooks with proper server function integration
export const useCreateClient = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { createClientServer } = await import("~/server/clients");
      return createClientServer({ data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
      toast({
        title: "Cliente creado exitosamente",
        description: "El cliente ha sido agregado al sistema",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear cliente",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useCreateContract = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { createContractServer } = await import("~/server/contracts");
      return createContractServer({ data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contracts });
      toast({
        title: "Contrato creado exitosamente",
        description: "El contrato ha sido agregado al sistema",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear contrato",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useCreateInsurance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { createInsuranceServer } = await import("~/server/insurance");
      return createInsuranceServer({ data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contracts });
      toast({
        title: "Seguro creado exitosamente",
        description: "El seguro ha sido agregado al sistema",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear seguro",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useCreateVehicle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { createVehicleServer } = await import("~/server/vehicles");
      return createVehicleServer({ data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
      toast({
        title: "Vehículo creado exitosamente",
        description: "El vehículo ha sido agregado al inventario",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear vehículo",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useCreateConcesionario = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { createConcesionarioServer } = await import("~/server/concesionarios");
      return createConcesionarioServer({ data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.concesionarios });
      toast({
        title: "Concesionario creado exitosamente",
        description: "El concesionario ha sido agregado al sistema",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear concesionario",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateVehicle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { updateVehicleServer } = await import("~/server/vehicles");
      return updateVehicleServer({ data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
      toast({
        title: "Vehículo actualizado exitosamente",
        description: "Los cambios han sido guardados",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar vehículo",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
  });
};

// Helper functions and additional hooks
export const useIsAdmin = () => {
  // This would need to be implemented based on your auth system
  // For now, returning false as a safe default
  return false;
};

export const useVehiclesByClientId = (clientId: string) => {
  // This would need a specific server function
  // For now, returning empty array
  return [];
};

export const useContractsByClientId = (clientId: string) => {
  // This would need a specific server function
  // For now, returning empty array
  return [];
};

export const useAvailableVehicles = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.vehicles, 'available'],
    queryFn: async () => {
      const { fetchVehicles } = await import("~/server/vehicles");
      const vehicles = await fetchVehicles();
      return vehicles.filter((vehicle: any) => vehicle.status === 'available');
    },
  });
};
