"use client";

import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { insuranceStatusMap } from "./insurance-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { motion } from "framer-motion";

interface InsuranceStatusBadgeProps {
  status: "active" | "expiring_soon" | "expired" | "cancelled";
  showLabel?: boolean;
  className?: string;
}

export function InsuranceStatusBadge({
  status,
  showLabel = true,
  className,
}: InsuranceStatusBadgeProps) {
  const statusInfo = insuranceStatusMap[status];

  // Map status to icon component
  const IconComponent =
    {
      CheckCircle,
      Clock,
      AlertCircle,
      XCircle,
    }[statusInfo.icon] || AlertCircle; // Default to AlertCircle if icon not found

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
              statusInfo.className,
              className
            )}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.15, ease: "easeInOut" },
            }}
            initial={{ scale: 1 }}
          >
            <IconComponent className="h-3.5 w-3.5 mr-1" />
            {showLabel && statusInfo.label}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="text-xs"
          sideOffset={5}
        >
          {statusInfo.description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
