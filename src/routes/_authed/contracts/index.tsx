import { createFileRoute, Link } from "@tanstack/react-router";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Plus, Search, ArrowDownUp, Download } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import type { Contract } from "~/components/contracts/contracts-data";
import { ContractCard } from "~/components/contracts/contract-card";
import { ContractsSummary } from "~/components/contracts/contracts-summary";
import { useToast } from "~/hooks/use-toast";

// Import contracts at the top with other imports
import {
  contracts,
  contractStatusMap,
} from "~/components/contracts/contracts-data";

export const Route = createFileRoute("/_authed/contracts/")({
  component: ContractsPage,
});
export default function ContractsPage() {
  const [filterQuery, setFilterQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  // Filter contracts based on search query and active filters
  useEffect(() => {
    let result = [...contracts];

    // Text search filter
    if (filterQuery) {
      const query = filterQuery.toLowerCase();
      result = result.filter(
        (contract) =>
          contract.clientName.toLowerCase().includes(query) ||
          contract.vehicleInfo.toLowerCase().includes(query) ||
          contract.id.toLowerCase().includes(query)
      );
    }

    // Status filters
    if (activeFilters.length > 0) {
      result = result.filter((contract) =>
        activeFilters.includes(contract.status)
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredContracts(result);
  }, [filterQuery, activeFilters, sortOrder, contracts]);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  // Handle filter toggling
  const toggleFilter = (status: string) => {
    setActiveFilters((prev) => {
      const includesStatus = prev.includes(status);

      // Show toast for filter change
      toast({
        title: includesStatus ? "Filtro eliminado" : "Filtro aplicado",
        description: `${contractStatusMap[status as keyof typeof contractStatusMap].label}`,
        duration: 2000,
      });

      return includesStatus
        ? prev.filter((s) => s !== status)
        : [...prev, status];
    });
  };

  // Handle clear filters
  const clearFilters = () => {
    setActiveFilters([]);
    setFilterQuery("");

    // Show toast for cleared filters
    toast({
      title: "Filtros eliminados",
      description: "Se han eliminado todos los filtros aplicados",
      duration: 2000,
    });
  };

  // Page entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-6 pb-10"
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground mt-1">
            Administra todos los contratos generados, firmados o pendientes
          </p>
        </div>
        <Link to="/contracts/new" search={{ date: new Date().toISOString() }}>
          <Button
            className="group transition-all duration-300 ease-in-out"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            Nuevo Contrato
          </Button>
        </Link>
      </motion.div>

      {/* Summary Section */}
      <motion.div variants={itemVariants}>
        <ContractsSummary contracts={contracts} />
      </motion.div>

      {/* Filter and Search Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, vehículo o número de contrato..."
            className="pl-10 bg-white"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="group bg-white"
          >
            <ArrowDownUp
              className={`mr-2 h-4 w-4 transition-transform duration-200 ${
                sortOrder === "asc" ? "rotate-180" : ""
              } group-hover:scale-110`}
            />
            {sortOrder === "desc" ? "Más recientes" : "Más antiguos"}
          </Button>
        </div>
      </motion.div>

      {/* Cards View (formerly in Tabs) */}
      <motion.div variants={itemVariants} className="mt-4">
        {filteredContracts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <Download className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-xl font-semibold mb-1">
                  No se encontraron contratos
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeFilters.length > 0 || filterQuery
                    ? "Prueba con diferentes filtros o términos de búsqueda"
                    : "Crea tu primer contrato para comenzar"}
                </p>
                {activeFilters.length > 0 || filterQuery ? (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                ) : (
                  <Link
                    to="/contracts/new"
                    search={{ date: new Date().toISOString() }}
                  >
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Contrato
                    </Button>
                  </Link>
                )}
              </motion.div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                className="h-full"
              >
                <ContractCard contract={contract} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
