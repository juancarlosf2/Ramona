import type React from "react";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  AlertTriangle,
  RefreshCw,
  Edit,
  Copy,
  X,
  Calendar,
  CreditCardIcon,
  Lock,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useToast } from "~/hooks/use-toast";

// Sample data for the subscription
const subscriptionData = {
  plan: "Plan Profesional",
  price: "RD$2,000",
  cycle: "Facturado mensualmente",
  usedUsers: 5,
  totalUsers: 10,
  status: "active", // active, expiring, canceled
  nextBillingDate: "7 junio 2025",
  paymentMethod: "•••• 4242 – Visa",
  billingId: "FACT-2025-0507",
  company: "Auto Dealer Premium",
  address: "Calle Principal #123, Santo Domingo",
  taxId: "RNC 123456789",
};

// Sample data for invoice history
const invoiceHistory = [
  {
    id: "INV-2025-05",
    date: "7 mayo 2025",
    amount: "RD$2,000.00",
    status: "paid",
  },
  {
    id: "INV-2025-04",
    date: "7 abril 2025",
    amount: "RD$2,000.00",
    status: "paid",
  },
  {
    id: "INV-2025-03",
    date: "7 marzo 2025",
    amount: "RD$2,000.00",
    status: "failed",
  },
];

// More detailed invoice history for the modal
const detailedInvoiceHistory = [
  {
    id: "INV-2025-05",
    date: "7 mayo 2025",
    amount: "RD$2,000.00",
    status: "paid",
  },
  {
    id: "INV-2025-04",
    date: "7 abril 2025",
    amount: "RD$2,000.00",
    status: "paid",
  },
  {
    id: "INV-2025-03",
    date: "7 marzo 2025",
    amount: "RD$2,000.00",
    status: "failed",
  },
  {
    id: "INV-2025-02",
    date: "7 febrero 2025",
    amount: "RD$2,000.00",
    status: "paid",
  },
  {
    id: "INV-2025-01",
    date: "7 enero 2025",
    amount: "RD$2,000.00",
    status: "paid",
  },
];

export function SubscriptionPanel() {
  const [showBillingDetails, setShowBillingDetails] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [showEditBillingInfo, setShowEditBillingInfo] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    company: subscriptionData.company,
    address: subscriptionData.address,
    taxId: subscriptionData.taxId,
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: "¡Copiado!",
      description: "Información copiada al portapapeles.",
      duration: 2000,
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    setIsDownloading(invoiceId);
    setTimeout(() => {
      setIsDownloading(null);
      toast({
        title: "Descarga iniciada",
        description: `La factura ${invoiceId} se está descargando.`,
        duration: 3000,
      });
    }, 1000);
  };

  const handleUpdatePaymentMethod = () => {
    setIsUpdatingPayment(true);
    setTimeout(() => {
      setIsUpdatingPayment(false);
      toast({
        title: "Método de pago actualizado",
        description:
          "Tu información de pago ha sido actualizada correctamente.",
        duration: 3000,
      });
    }, 2000);
  };

  const handleSaveBillingInfo = () => {
    setShowEditBillingInfo(false);
    toast({
      title: "Información actualizada",
      description: "Los datos de facturación han sido actualizados.",
      duration: 3000,
    });
  };

  const handleCancelSubscription = () => {
    setShowCancelDialog(false);
    toast({
      title: "Suscripción cancelada",
      description:
        "Tu suscripción ha sido cancelada. Seguirá activa hasta el final del período de facturación.",
      variant: "destructive",
      duration: 5000,
    });
  };

  const validatePaymentForm = () => {
    const errors = {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    };
    let isValid = true;

    // Validate card number (16 digits, spaces allowed)
    const cardNumberClean = paymentInfo.cardNumber.replace(/\s/g, "");
    if (
      !cardNumberClean ||
      cardNumberClean.length !== 16 ||
      !/^\d+$/.test(cardNumberClean)
    ) {
      errors.cardNumber = "Ingresa un número de tarjeta válido de 16 dígitos";
      isValid = false;
    }

    // Validate card holder
    if (!paymentInfo.cardHolder || paymentInfo.cardHolder.length < 3) {
      errors.cardHolder = "Ingresa el nombre completo del titular";
      isValid = false;
    }

    // Validate expiry date (MM/YY format)
    if (
      !paymentInfo.expiryDate ||
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)
    ) {
      errors.expiryDate = "Usa el formato MM/YY (ej: 05/25)";
      isValid = false;
    } else {
      // Check if the card is not expired
      const [month, year] = paymentInfo.expiryDate.split("/");
      const expiryDate = new Date(
        2000 + Number.parseInt(year),
        Number.parseInt(month) - 1,
        1
      );
      const today = new Date();
      if (expiryDate < today) {
        errors.expiryDate = "La tarjeta ha expirado";
        isValid = false;
      }
    }

    // Validate CVV (3 or 4 digits)
    if (!paymentInfo.cvv || !/^\d{3,4}$/.test(paymentInfo.cvv)) {
      errors.cvv = "Ingresa un código de seguridad válido";
      isValid = false;
    }

    setPaymentErrors(errors);
    return isValid;
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .substring(0, 16)
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setPaymentInfo({ ...paymentInfo, [name]: formattedValue });
    }
    // Format expiry date with slash
    else if (name === "expiryDate") {
      let formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 4);
      }
      setPaymentInfo({ ...paymentInfo, [name]: formattedValue });
    }
    // Limit CVV to 3-4 digits
    else if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").substring(0, 4);
      setPaymentInfo({ ...paymentInfo, [name]: formattedValue });
    } else {
      setPaymentInfo({ ...paymentInfo, [name]: value });
    }
  };

  const handleSubmitPaymentForm = () => {
    if (validatePaymentForm()) {
      setIsSubmittingPayment(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmittingPayment(false);
        setShowPaymentForm(false);

        // Reset form
        setPaymentInfo({
          cardNumber: "",
          cardHolder: "",
          expiryDate: "",
          cvv: "",
        });

        // Show success message
        toast({
          title: "Método de pago actualizado",
          description:
            "Tu información de pago ha sido actualizada correctamente.",
          duration: 3000,
        });
      }, 1500);
    }
  };

  // Redesigned status badge that matches the application's StatusBadge component style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-800 border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Activo
          </span>
        );
      case "expiring":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-100 text-amber-800 border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Expira pronto
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-rose-100 text-rose-800 border-rose-200">
            <X className="h-3.5 w-3.5 mr-1" />
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  // Redesigned invoice status badge that matches the application's StatusBadge component style
  const getInvoiceStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-800 border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Pagado
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pago procesado correctamente</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "failed":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-rose-100 text-rose-800 border-rose-200">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                  Fallido
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>El pago no pudo ser procesado</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Subscription Plan Details */}
        <Card className="border border-border rounded-xl bg-background transition-all duration-200 hover:shadow-sm hover:scale-[1.01]">
          <CardHeader>
            <CardTitle>Tu plan actual</CardTitle>
            <CardDescription>
              Detalles de tu suscripción y facturación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <div className="text-2xl font-bold">{subscriptionData.plan}</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold">
                  {subscriptionData.price}
                </span>
                <span className="text-gray-500">/ mes</span>
              </div>
              <div className="text-sm text-gray-500">
                {subscriptionData.cycle}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Usuarios</span>
                  <span className="text-sm font-medium">
                    {subscriptionData.usedUsers} de{" "}
                    {subscriptionData.totalUsers} disponibles
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(subscriptionData.usedUsers / subscriptionData.totalUsers) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Estado</span>
                {getStatusBadge(subscriptionData.status)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">ID de Facturación</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {subscriptionData.billingId}
                  </span>
                  <TooltipProvider>
                    <Tooltip open={copiedField === "billingId"}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            handleCopyToClipboard(
                              subscriptionData.billingId,
                              "billingId"
                            )
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span className="sr-only">Copiar ID</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>¡Copiado!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Próxima facturación
                </span>
                <span className="text-sm font-medium">
                  {subscriptionData.nextBillingDate}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mt-4"
              onClick={() => setShowBillingDetails(true)}
            >
              <span>Ver detalles de facturación</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Right Column - Billing History and Quick Actions */}
        <div className="space-y-6">
          {/* Billing History */}
          <Card className="border border-border rounded-xl bg-background transition-all duration-200 hover:shadow-sm hover:scale-[1.01]">
            <CardHeader>
              <CardTitle>Historial de pagos</CardTitle>
              <CardDescription>
                Últimas facturas y estado de pagos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">PDF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceHistory.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="hover:bg-accent cursor-pointer transition-colors"
                    >
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        {getInvoiceStatusIcon(invoice.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleDownloadInvoice(invoice.id)
                                }
                                disabled={isDownloading === invoice.id}
                              >
                                {isDownloading === invoice.id ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  Descargar factura
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Descargar factura</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-border rounded-xl bg-background transition-all duration-200 hover:shadow-sm hover:scale-[1.01]">
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
              <CardDescription>Gestiona tu suscripción y pagos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={handleUpdatePaymentMethod}
                disabled={isUpdatingPayment}
              >
                {isUpdatingPayment ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                Actualizar método de pago
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <FileText className="mr-2 h-4 w-4" />
                Descargar recibos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                onClick={() => setShowCancelDialog(true)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar suscripción
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Billing Details Modal */}
      <Dialog open={showBillingDetails} onOpenChange={setShowBillingDetails}>
        <DialogContent className="sm:max-w-2xl animate-in fade-in-50 slide-in-from-right-5 duration-300 max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Detalles de facturación
            </DialogTitle>
            <DialogDescription>
              Información completa sobre tu facturación y pagos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-4 overflow-y-auto pr-4">
            {/* Billing Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resumen de Facturación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-border rounded-lg bg-background">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Nombre del plan:
                    </span>
                    <span className="text-sm font-medium">
                      {subscriptionData.plan}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Ciclo de pago:
                    </span>
                    <span className="text-sm font-medium">Mensual</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Próxima facturación:
                    </span>
                    <span className="text-sm font-medium">
                      {subscriptionData.nextBillingDate}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Monto recurrente:
                    </span>
                    <span className="text-sm font-medium">
                      {subscriptionData.price} / mes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Método de pago actual:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {subscriptionData.paymentMethod}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-primary"
                        onClick={() => setShowPaymentForm(true)}
                      >
                        Actualizar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Update Form */}
              {showPaymentForm && (
                <div className="animate-in slide-in-from-bottom-5 fade-in-50 duration-300 border border-border rounded-lg p-4 bg-background shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" />
                      Actualizar método de pago
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setShowPaymentForm(false)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cerrar</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentInputChange}
                          className={
                            paymentErrors.cardNumber
                              ? "border-rose-500 pr-10"
                              : ""
                          }
                        />
                        <CreditCardIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                      {paymentErrors.cardNumber && (
                        <p className="text-xs text-rose-500 mt-1">
                          {paymentErrors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardHolder">Nombre del titular</Label>
                      <Input
                        id="cardHolder"
                        name="cardHolder"
                        placeholder="Juan Pérez"
                        value={paymentInfo.cardHolder}
                        onChange={handlePaymentInputChange}
                        className={
                          paymentErrors.cardHolder ? "border-rose-500" : ""
                        }
                      />
                      {paymentErrors.cardHolder && (
                        <p className="text-xs text-rose-500 mt-1">
                          {paymentErrors.cardHolder}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Fecha de expiración</Label>
                        <div className="relative">
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentInputChange}
                            className={
                              paymentErrors.expiryDate
                                ? "border-rose-500 pr-10"
                                : ""
                            }
                          />
                          <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        {paymentErrors.expiryDate && (
                          <p className="text-xs text-rose-500 mt-1">
                            {paymentErrors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">Código de seguridad (CVV)</Label>
                        <div className="relative">
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentInputChange}
                            className={
                              paymentErrors.cvv ? "border-rose-500 pr-10" : ""
                            }
                          />
                          <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        {paymentErrors.cvv && (
                          <p className="text-xs text-rose-500 mt-1">
                            {paymentErrors.cvv}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mt-2 mb-2">
                      <Lock className="h-3 w-3 mr-1" />
                      Tus datos están protegidos con encriptación de 256 bits
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPaymentForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSubmitPaymentForm}
                        disabled={isSubmittingPayment}
                      >
                        {isSubmittingPayment ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Actualizando...
                          </>
                        ) : (
                          "Guardar método de pago"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Historial de Facturas</h3>
              <div className="border border-border rounded-lg bg-background p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedInvoiceHistory.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className="hover:bg-accent transition-colors"
                      >
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          {getInvoiceStatusIcon(invoice.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {invoice.status === "failed" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                            >
                              <RefreshCw className="mr-1 h-3 w-3" />
                              Reintentar
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              disabled={isDownloading === invoice.id}
                            >
                              {isDownloading === invoice.id ? (
                                <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <Download className="mr-1 h-3 w-3" />
                              )}
                              PDF
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Dirección de Facturación
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => setShowEditBillingInfo(!showEditBillingInfo)}
                >
                  <Edit className="mr-1 h-3 w-3" />
                  {showEditBillingInfo ? "Cancelar" : "Editar"}
                </Button>
              </div>

              {showEditBillingInfo ? (
                <div className="space-y-4 p-4 border border-border rounded-lg animate-in fade-in-50 slide-in-from-top-5 duration-200 bg-background">
                  <div className="space-y-2">
                    <Label htmlFor="company">Nombre de la empresa</Label>
                    <Input
                      id="company"
                      value={billingInfo.company}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          company: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección fiscal</Label>
                    <Input
                      id="address"
                      value={billingInfo.address}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">RNC / ID tributario</Label>
                    <Input
                      id="taxId"
                      value={billingInfo.taxId}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          taxId: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveBillingInfo}>Guardar</Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-border rounded-lg bg-background">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Empresa:</span>
                      <span className="text-sm font-medium">
                        {billingInfo.company}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Dirección:</span>
                      <span className="text-sm font-medium">
                        {billingInfo.address}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        RNC / ID tributario:
                      </span>
                      <span className="text-sm font-medium">
                        {billingInfo.taxId}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBillingDetails(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md animate-in fade-in-50 zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle className="text-xl">Cancelar suscripción</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar tu suscripción? Perderás
              acceso a todas las funciones premium al final del período de
              facturación actual.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">
                    Importante: Esta acción no puede deshacerse
                  </p>
                  <p className="text-sm">
                    Tu suscripción permanecerá activa hasta el{" "}
                    {subscriptionData.nextBillingDate}, después de esa fecha tu
                    cuenta pasará al plan gratuito con funcionalidades
                    limitadas.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              No, mantener mi plan
            </Button>
            <Button
              variant="destructive"
              className="animate-pulse hover:animate-none"
              onClick={handleCancelSubscription}
            >
              Sí, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
