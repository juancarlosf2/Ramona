import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  fetchVehicles,
  fetchVehicleById,
  fetchClients,
  fetchContracts,
  fetchDealerInfo,
  fetchConcesionarios,
  fetchConcesionarioById,
  createClientServer,
  createConcesionarioServer,
  createContractServer,
  createInsuranceServer,
  createVehicleServer,
  updateVehicleServer,
  fetchMyProfile,
} from "../server/api";
import type {
  CreateClientInput,
  CreateConcesionarioInput,
  CreateContractInput,
  CreateInsuranceInput,
  CreateVehicleFormInput,
  UpdateVehicleInput,
  ConcesionarioById,
} from "../server/api";

// Query Keys
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

// ===== QUERY OPTIONS =====

/**
 * Query options for vehicle by ID - used for server prefetching and client queries
 */
export const vehicleByIdQueryOptions = (vehicleId: string) => ({
  queryKey: QUERY_KEYS.vehicle(vehicleId),
  queryFn: () => fetchVehicleById({ data: { vehicleId } }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

/**
 * Query options for concesionario by ID - used for server prefetching and client queries
 */
export const concesionarioByIdQueryOptions = (concesionarioId: string) => ({
  queryKey: QUERY_KEYS.concesionario(concesionarioId),
  queryFn: () => fetchConcesionarioById({ data: { concesionarioId } }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

/**
 * Query options for all vehicles - used for server prefetching and client queries
 */
export const vehiclesQueryOptions = () => ({
  queryKey: QUERY_KEYS.vehicles,
  queryFn: fetchVehicles,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

/**
 * Query options for all concesionarios - used for server prefetching and client queries
 */
export const concesionariosQueryOptions = () => ({
  queryKey: QUERY_KEYS.concesionarios,
  queryFn: fetchConcesionarios,
  staleTime: 10 * 60 * 1000, // 10 minutes
});

// ===== QUERY HOOKS =====

/**
 * Fetch single vehicle by ID with purchasedBy information (suspense version for loaders)
 */
export function useSuspenseVehicle(vehicleId: string) {
  return useSuspenseQuery(vehicleByIdQueryOptions(vehicleId));
}

/**
 * Fetch single concesionario by ID with assigned vehicles (suspense version for loaders)
 */
export function useSuspenseConcesionario(concesionarioId: string) {
  return useSuspenseQuery(concesionarioByIdQueryOptions(concesionarioId));
}

/**
 * Fetch all vehicles with their related data (suspense version for loaders)
 */
export function useSuspenseVehicles() {
  return useSuspenseQuery(vehiclesQueryOptions());
}

/**
 * Fetch all concesionarios (suspense version for loaders)
 */
export function useSuspenseConcesionarios() {
  return useSuspenseQuery(concesionariosQueryOptions());
}

/**
 * Fetch all vehicles with their related data
 */
export function useVehicles() {
  return useQuery({
    queryKey: QUERY_KEYS.vehicles,
    queryFn: fetchVehicles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch all clients
 */
export function useClients() {
  return useQuery({
    queryKey: QUERY_KEYS.clients,
    queryFn: fetchClients,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch all contracts with their related data
 */
export function useContracts() {
  return useQuery({
    queryKey: QUERY_KEYS.contracts,
    queryFn: fetchContracts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch dealer information
 */
export function useDealerInfo() {
  return useQuery({
    queryKey: QUERY_KEYS.dealers,
    queryFn: fetchDealerInfo,
    staleTime: 30 * 60 * 1000, // 30 minutes (dealer info changes infrequently)
  });
}

/**
 * Fetch all concesionarios (consignment dealers)
 */
export function useConcesionarios() {
  return useQuery({
    queryKey: QUERY_KEYS.concesionarios,
    queryFn: fetchConcesionarios,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch current user's profile
 */
export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: fetchMyProfile,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      // Don't retry if user is not authenticated
      if (error instanceof Error && error.message.includes("authenticated")) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// ===== MUTATION HOOKS =====

/**
 * Create a new client
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientInput) => createClientServer({ data }),
    onSuccess: () => {
      // Invalidate and refetch clients list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
    },
    onError: (error) => {
      console.error("Error creating client:", error);
    },
  });
}

/**
 * Create a new contract
 */
export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContractInput) => createContractServer({ data }),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contracts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
    },
    onError: (error) => {
      console.error("Error creating contract:", error);
    },
  });
}

/**
 * Create a new insurance policy
 */
export function useCreateInsurance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInsuranceInput) => createInsuranceServer({ data }),
    onSuccess: () => {
      // Invalidate vehicles query since insurance is related to vehicles
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
    },
    onError: (error) => {
      console.error("Error creating insurance:", error);
    },
  });
}

/**
 * Create a new vehicle
 */
export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVehicleFormInput) => {
      // Convert File objects to base64 strings for JSON serialization
      const convertedImages = await Promise.all(
        (data.images || []).map(async (file) => {
          if (!(file instanceof File)) {
            throw new Error("Invalid file object");
          }

          return new Promise<{
            data: string;
            name: string;
            type: string;
            size: number;
          }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                resolve({
                  data: reader.result, // This includes the data URL prefix
                  name: file.name,
                  type: file.type,
                  size: file.size,
                });
              } else {
                reject(new Error("Failed to read file"));
              }
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
          });
        })
      );

      // Create data object with converted images
      const dataWithBase64Images = {
        ...data,
        images: convertedImages,
      };

      return createVehicleServer({ data: dataWithBase64Images });
    },
    onSuccess: () => {
      // Invalidate and refetch vehicles list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
    },
    onError: (error) => {
      console.error("Error creating vehicle:", error);
    },
  });
}

/**
 * Create a new concesionario
 */
export function useCreateConcesionario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConcesionarioInput) =>
      createConcesionarioServer({ data }),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.concesionarios });
    },
    onError: (error) => {
      console.error("Error creating concesionario:", error);
    },
  });
}

/**
 * Update vehicle information
 */
export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      updateData,
    }: {
      vehicleId: string;
      updateData: UpdateVehicleInput;
    }) => updateVehicleServer({ data: { vehicleId, updateData } }),
    onSuccess: () => {
      // Invalidate vehicles and contracts since they're related
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contracts });
    },
    onError: (error) => {
      console.error("Error updating vehicle:", error);
    },
  });
}

// ===== UTILITY HOOKS =====

/**
 * Check if current user is an administrator
 */
export function useIsAdmin() {
  const { data: profile } = useProfile();
  return profile?.role === "admin";
}

/**
 * Get vehicles for a specific client
 */
export function useClientVehicles(clientId?: string) {
  const { data: vehicles, ...query } = useVehicles();

  const clientVehicles =
    vehicles?.filter((vehicle) =>
      vehicle.contracts?.some((contract) => contract.clientId === clientId)
    ) || [];

  return {
    ...query,
    data: clientVehicles,
  };
}

/**
 * Get contracts for a specific client
 */
export function useClientContracts(clientId?: string) {
  const { data: contracts, ...query } = useContracts();

  const clientContracts =
    contracts?.filter((contract) => contract.clientId === clientId) || [];

  return {
    ...query,
    data: clientContracts,
  };
}

/**
 * Get available vehicles (vehicles with "available" status)
 */
export function useAvailableVehicles() {
  const { data: vehicles, ...query } = useVehicles();

  const availableVehicles =
    vehicles?.filter((vehicle) => vehicle.status === "available") || [];

  return {
    ...query,
    data: availableVehicles,
  };
}

/**
 * Prefetch related data for forms
 */
export function usePrefetchFormData() {
  const queryClient = useQueryClient();

  const prefetchAll = () => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.vehicles,
      queryFn: fetchVehicles,
      staleTime: 5 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.clients,
      queryFn: fetchClients,
      staleTime: 5 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.dealers,
      queryFn: fetchDealerInfo,
      staleTime: 30 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.concesionarios,
      queryFn: fetchConcesionarios,
      staleTime: 10 * 60 * 1000,
    });
  };

  return { prefetchAll };
}

// ===== ERROR BOUNDARIES =====

/**
 * Custom error handling for authentication errors
 */
export function isAuthError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("authenticated") ||
      error.message.includes("authorized") ||
      error.message.includes("Unauthorized"))
  );
}

/**
 * Custom error handling for validation errors
 */
export function isValidationError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("validation");
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (isAuthError(error)) {
      return "You need to be logged in to perform this action.";
    }
    if (isValidationError(error)) {
      return "Please check your input and try again.";
    }
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}
