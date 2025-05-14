"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function InsuranceSummary() {
  // Calculate summary metrics
  const activeCount = 18; // Fixed value as per requirements
  const expiringCount = 4; // Fixed value as per requirements
  const expiredCount = 6; // Fixed value as per requirements
  const withContractCount = 12; // Fixed value as per requirements

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
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount} pólizas</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (activeCount / (activeCount + expiringCount + expiredCount)) *
                  100
              )}
              % del total
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
              Por vencer pronto
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringCount}</div>
            <p className="text-xs text-muted-foreground">
              Vencen en próximos 30 días
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
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredCount} pólizas</div>
            <p className="text-xs text-muted-foreground">
              Requieren renovación
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
              Asociados a contratos
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withContractCount}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (withContractCount /
                  (activeCount + expiringCount + expiredCount)) *
                  100
              )}
              % del total
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
