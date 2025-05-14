import {
  DollarSign,
  CreditCard,
  Calendar,
  ArrowUpRight,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Progress } from "~/components/ui/progress";

// Mock financial data
const financialData = {
  totalSpent: "$62,300.00",
  outstandingBalance: "$24,800.00",
  paymentProgress: 60,
  lastPayment: {
    amount: "$1,250.00",
    date: "05 Nov 2023",
    method: "Tarjeta de crédito",
  },
  nextPayment: {
    amount: "$1,250.00",
    dueDate: "05 Dic 2023",
  },
  paymentMethods: [
    {
      type: "Financiamiento",
      details: "Banco Popular",
      percentage: 80,
    },
    {
      type: "Efectivo",
      details: "Pago inicial",
      percentage: 20,
    },
  ],
  recentTransactions: [
    {
      id: "TRX-2023-1234",
      description: "Pago mensual",
      amount: "$1,250.00",
      date: "05 Nov 2023",
      status: "Completado",
    },
    {
      id: "TRX-2023-1233",
      description: "Pago mensual",
      amount: "$1,250.00",
      date: "05 Oct 2023",
      status: "Completado",
    },
    {
      id: "TRX-2023-1232",
      description: "Pago inicial",
      amount: "$6,500.00",
      date: "15 Sep 2023",
      status: "Completado",
    },
  ],
};

interface ClientFinancialsProps {
  clientId: string;
  isLoading: boolean;
}

export function ClientFinancials({
  clientId,
  isLoading,
}: ClientFinancialsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              Total gastado
            </CardDescription>
            <CardTitle className="text-2xl">
              {financialData.totalSpent}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Incluye todos los vehículos y servicios
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              Balance pendiente
            </CardDescription>
            <CardTitle className="text-2xl">
              {financialData.outstandingBalance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progreso de pago</span>
                <span className="font-medium">
                  {financialData.paymentProgress}%
                </span>
              </div>
              <Progress
                value={financialData.paymentProgress}
                className="h-1.5"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Próximo pago
            </CardDescription>
            <CardTitle className="text-2xl">
              {financialData.nextPayment.amount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Fecha límite: {financialData.nextPayment.dueDate}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card className="border-none shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Transacciones recientes
          </CardTitle>
          <CardDescription>
            Historial de pagos y transacciones del cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {financialData.recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <div className="font-medium">{transaction.description}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {transaction.date}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{transaction.amount}</div>
                <Badge
                  variant="outline"
                  className="text-xs bg-success/10 text-success border-success/20"
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full gap-1">
            Ver todas las transacciones
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>

      {/* Payment methods */}
      <Card className="border-none shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Métodos de pago
          </CardTitle>
          <CardDescription>
            Distribución de los métodos de pago utilizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {financialData.paymentMethods.map((method, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <div className="font-medium">{method.type}</div>
                <div className="text-sm">{method.percentage}%</div>
              </div>
              <div className="text-xs text-muted-foreground">
                {method.details}
              </div>
              <Progress value={method.percentage} className="h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
