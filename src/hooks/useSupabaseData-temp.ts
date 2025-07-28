import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "@tanstack/react-router";

// TEMPORARY: Minimal working version to fix Buffer error
// The original imports were causing server-side code to be bundled with client

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

// Temporary stub hooks - these will need proper server function integration
export const useVehicleById = (vehicleId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.vehicle(vehicleId),
    queryFn: () => Promise.resolve(null),
    enabled: false, // Disabled until proper server function integration
  });
};

export const useConcesionarioById = (concesionarioId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.concesionario(concesionarioId),
    queryFn: () => Promise.resolve(null),
    enabled: false,
  });
};

export const useVehicles = () => {
  return useQuery({
    queryKey: QUERY_KEYS.vehicles,
    queryFn: () => Promise.resolve([]),
    enabled: false,
  });
};

export const useConcesionarios = () => {
  return useQuery({
    queryKey: QUERY_KEYS.concesionarios,
    queryFn: () => Promise.resolve([]),
    enabled: false,
  });
};

export const useVehiclesSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.vehicles,
    queryFn: () => Promise.resolve([]),
  });
};

export const useClientsSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.clients,
    queryFn: () => Promise.resolve([]),
  });
};

export const useContractsSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.contracts,
    queryFn: () => Promise.resolve([]),
  });
};

export const useDealerInfoSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.dealers,
    queryFn: () => Promise.resolve(null),
  });
};

export const useConcesionariosSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.concesionarios,
    queryFn: () => Promise.resolve([]),
  });
};

export const useMyProfileSuspense = () => {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => Promise.resolve(null),
  });
};

export const useCreateClient = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => Promise.resolve(null),
    onError: () => {
      toast({
        title: "Funcionalidad temporalmente deshabilitada",
        description: "Los hooks están siendo reparados",
        variant: "destructive",
      });
    },
  });
};

export const useCreateContract = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => Promise.resolve(null),
    onError: () => {
      toast({
        title: "Funcionalidad temporalmente deshabilitada",
        description: "Los hooks están siendo reparados",
        variant: "destructive",
      });
    },
  });
};

export const useCreateInsurance = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => Promise.resolve(null),
    onError: () => {
      toast({
        title: "Funcionalidad temporalmente deshabilitada",
        description: "Los hooks están siendo reparados",
        variant: "destructive",
      });
    },
  });
};

export const useCreateVehicle = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => Promise.resolve(null),
    onError: () => {
      toast({
        title: "Funcionalidad temporalmente deshabilitada",
        description: "Los hooks están siendo reparados",
        variant: "destructive",
      });
    },
  });
};

export const useCreateConcesionario = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => Promise.resolve(null),
    onError: () => {
      toast({
        title: "Funcionalidad temporalmente deshabilitada",
        description: "Los hooks están siendo reparados",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateVehicle = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => Promise.resolve(null),
    onError: () => {
      toast({
        title: "Funcionalidad temporalmente deshabilitada",
        description: "Los hooks están siendo reparados",
        variant: "destructive",
      });
    },
  });
};

export const useIsAdmin = () => {
  return false; // Temporary stub
};

export const useVehiclesByClientId = (clientId: string) => {
  return []; // Temporary stub
};

export const useContractsByClientId = (clientId: string) => {
  return []; // Temporary stub
};

export const useAvailableVehicles = () => {
  return []; // Temporary stub
};
