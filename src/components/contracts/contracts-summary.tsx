import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Contract } from "./contracts-data";
import { CheckCircle, Clock, FileCheck, BarChart } from "lucide-react";

interface ContractsSummaryProps {
  contracts: Contract[];
}

export function ContractsSummary({ contracts }: ContractsSummaryProps) {
  const [summaryData, setSummaryData] = useState({
    active: 0,
    pending: 0,
    completed: 0,
    total: 0,
  });

  // Calculate summary data
  useEffect(() => {
    const active = contracts.filter((c) => c.status === "active").length;
    const pending = contracts.filter((c) => c.status === "pending").length;
    const completed = contracts.filter((c) => c.status === "completed").length;

    setSummaryData({
      active,
      pending,
      completed,
      total: contracts.length,
    });
  }, [contracts]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={itemVariants}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contratos Activos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.active}</div>
            <p className="text-xs text-muted-foreground">+2 en el último mes</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendientes de Firma
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.pending}</div>
            <p className="text-xs text-muted-foreground">
              4 requieren atención
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.completed}</div>
            <p className="text-xs text-muted-foreground">
              +5 desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Contratos
            </CardTitle>
            <BarChart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.total}</div>
            <p className="text-xs text-muted-foreground">
              9 contratos este año
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
