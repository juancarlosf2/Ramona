import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { formatCurrency } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Eye, FileText, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import { Insurance } from "./insurance-data";

interface InsuranceCardProps {
  insurance: Insurance & {
    name: string;
    description: string;
    category: string;
    price: number;
    id: string;
  };
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ insurance }) => {
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>{insurance.name}</CardTitle>
          <CardDescription>{insurance.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Precio:</p>
              <p className="text-lg font-semibold">
                {formatCurrency(insurance.price)}
              </p>
            </div>
            <div>
              <Badge variant="secondary">{insurance.category}</Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 pb-4 px-6 bg-muted/20 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={`/insurance/$insuranceId`}
                    params={{ insuranceId: insurance.id }}
                  >
                    <Button variant="outline" size="sm" className="group">
                      <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-all" />
                      Ver
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Ver detalles del seguro</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="group">
                    <FileText className="h-4 w-4 mr-2 group-hover:scale-110 transition-all" />
                    PDF
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Descargar PDF</TooltipContent>
              </Tooltip>
            </div>

            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="group">
                    <X className="h-4 w-4 mr-2 group-hover:scale-110 transition-all" />
                    Anular
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Anular seguro</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default InsuranceCard;
