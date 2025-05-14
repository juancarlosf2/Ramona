import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  Eye,
  Download,
  Printer,
  Edit,
  Car,
  DollarSign,
  User,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatCurrency, formatDate, getInitials } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  contractStatusMap,
  brandColorMap,
  type Contract,
} from "./contracts-data";
import { ContractStatusBadge } from "./contract-status-badge";
import { useToast } from "~/hooks/use-toast";
import { Link } from "@tanstack/react-router";

interface ContractCardProps {
  contract: Contract;
}

export function ContractCard({ contract }: ContractCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  // Get status configuration
  const statusConfig = contractStatusMap[contract.status];
  const brandColor = brandColorMap[contract.vehicleBrand] || "bg-gray-100";

  // Format date and currency
  const formattedDate = formatDate(contract.date);
  const formattedAmount = formatCurrency(contract.amount);

  return (
    <motion.div
      className="h-full"
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      <Card className="overflow-hidden h-full border-muted-foreground/10 shadow-sm transition-[border,shadow] duration-150 ease-in-out hover:border-primary/30 hover:shadow-md">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header section */}
          <div className="p-5 pb-3 border-b">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{contract.id}</h3>
              <ContractStatusBadge status={contract.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Creado el {formattedDate}
            </p>
          </div>

          {/* Content section */}
          <div className="p-5 flex-grow space-y-4 relative">
            {/* Client Info */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10 bg-primary/10 border border-muted">
                  <AvatarFallback className="text-primary font-medium">
                    {getInitials(contract.clientName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium">{contract.clientName}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {contract.clientEmail}
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Avatar className={`h-10 w-10 ${brandColor}`}>
                  <AvatarFallback className="font-medium">
                    {contract.vehicleBrand.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium">{contract.vehicleInfo}</span>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-1.5 mt-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-bold text-base">{formattedAmount}</span>
            </div>

            {/* Signed info if available */}
            {contract.signedDate && (
              <div className="flex items-center text-xs text-muted-foreground gap-1.5 mt-2 p-2 bg-muted/50 rounded-md">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span>
                  Firmado por {contract.signedBy} el{" "}
                  {formatDate(contract.signedDate)}
                </span>
              </div>
            )}

            {/* Pending warning if applicable */}
            {contract.status === "pending" && (
              <div className="flex items-center text-xs text-muted-foreground gap-1.5 mt-2 p-2 bg-amber-50 rounded-md">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Pendiente de firma por el cliente</span>
              </div>
            )}
          </div>

          {/* Footer with actions */}
          <CardFooter className="p-4 pt-2 border-t bg-muted/20 flex justify-between">
            <TooltipProvider delayDuration={300}>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={`/contracts/$contractId`}
                      params={{ contractId: contract.id }}
                    >
                      <Button variant="outline" size="sm" className="group">
                        <Eye className="h-4 w-4 mr-1 group-hover:scale-110 transition-all" />
                        <span>Ver</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver detalles del contrato</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="group">
                      <Download className="h-4 w-4 mr-1 group-hover:scale-110 transition-all" />
                      <span>PDF</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Descargar contrato en PDF</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={`/contracts/$contractId/edit`}
                      params={{ contractId: contract.id }}
                    >
                      <Button variant="outline" size="sm" className="group">
                        <Edit className="h-4 w-4 mr-1 group-hover:scale-110 transition-all" />
                        <span>Editar</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar contrato</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="group"
                      onClick={() => window.print()}
                    >
                      <Printer className="h-4 w-4 mr-1 group-hover:scale-110 transition-all" />
                      <span>Imprimir</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Imprimir contrato</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CardFooter>
        </CardContent>
      </Card>
    </motion.div>
  );
}
