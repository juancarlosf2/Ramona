import { Check } from "lucide-react";
import { contractStatusMap } from "./contracts-data";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";

interface ContractStatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ContractStatusSelector({
  value,
  onChange,
}: ContractStatusSelectorProps) {
  const statuses = ["pending", "active", "completed"] as const;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        Estado del Contrato<span className="text-destructive ml-1">*</span>
      </label>
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => {
          const isSelected = value === status;
          const statusConfig = contractStatusMap[status];

          return (
            <motion.button
              key={status}
              type="button"
              onClick={() => onChange(status)}
              className={cn(
                "relative flex items-center px-3 py-2 rounded-md border text-sm",
                statusConfig.className,
                isSelected && "ring-2 ring-primary ring-offset-1"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-1">{statusConfig.label}</span>
              {isSelected && (
                <span className="ml-1.5">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
