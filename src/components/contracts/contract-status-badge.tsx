import { motion } from "framer-motion";
import { contractStatusMap } from "./contracts-data";

interface ContractStatusBadgeProps {
  status: "active" | "pending" | "completed" | "cancelled";
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const statusConfig = contractStatusMap[status];

  return (
    <motion.div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {statusConfig.label}
    </motion.div>
  );
}
