import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";

// Full dataset of upcoming payments
const allPaymentsData = [
  {
    id: 1,
    clientName: "Juan Pérez",
    amount: 15000,
    installment: 2,
    dueDate: new Date(Date.now() + 86400000), // tomorrow
    status: "urgent",
    avatar: "JP",
  },
  {
    id: 2,
    clientName: "María Rodríguez",
    amount: 12500,
    installment: 3,
    dueDate: new Date(Date.now() + 86400000 * 3), // in 3 days
    status: "upcoming",
    avatar: "MR",
  },
  {
    id: 3,
    clientName: "Carlos Gómez",
    amount: 18200,
    installment: 2,
    dueDate: new Date(Date.now() + 86400000 * 5), // in 5 days
    status: "upcoming",
    avatar: "CG",
  },
  {
    id: 4,
    clientName: "Laura Sánchez",
    amount: 20000,
    installment: 4,
    dueDate: new Date(Date.now() - 86400000), // yesterday (completed)
    status: "completed",
    avatar: "LS",
  },
  {
    id: 5,
    clientName: "Roberto Méndez",
    amount: 22500,
    installment: 1,
    dueDate: new Date(Date.now() + 86400000 * 10), // in 10 days
    status: "upcoming",
    avatar: "RM",
  },
  {
    id: 6,
    clientName: "Ana Martínez",
    amount: 17800,
    installment: 3,
    dueDate: new Date(Date.now() + 86400000 * 15), // in 15 days
    status: "upcoming",
    avatar: "AM",
  },
  {
    id: 7,
    clientName: "Pedro Fernández",
    amount: 19500,
    installment: 2,
    dueDate: new Date(Date.now() + 86400000 * 20), // in 20 days
    status: "upcoming",
    avatar: "PF",
  },
  {
    id: 8,
    clientName: "Sofía Ramírez",
    amount: 14200,
    installment: 5,
    dueDate: new Date(Date.now() + 86400000 * 25), // in 25 days
    status: "upcoming",
    avatar: "SR",
  },
  {
    id: 9,
    clientName: "Miguel Torres",
    amount: 16800,
    installment: 4,
    dueDate: new Date(Date.now() + 86400000 * 30), // in 30 days
    status: "upcoming",
    avatar: "MT",
  },
  {
    id: 10,
    clientName: "Carmen Díaz",
    amount: 21000,
    installment: 2,
    dueDate: new Date(Date.now() + 86400000 * 45), // in 45 days
    status: "upcoming",
    avatar: "CD",
  },
  {
    id: 11,
    clientName: "José Morales",
    amount: 18500,
    installment: 3,
    dueDate: new Date(Date.now() + 86400000 * 60), // in 60 days
    status: "upcoming",
    avatar: "JM",
  },
  {
    id: 12,
    clientName: "Luisa Herrera",
    amount: 15700,
    installment: 4,
    dueDate: new Date(Date.now() + 86400000 * 90), // in 90 days
    status: "upcoming",
    avatar: "LH",
  },
];

interface UpcomingPaymentsProps {
  period?: string;
}

export function UpcomingPayments({ period = "30days" }: UpcomingPaymentsProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [upcomingPaymentsData, setUpcomingPaymentsData] = useState<
    typeof allPaymentsData
  >([]);

  useEffect(() => {
    // Filter payments based on period
    let maxDays = 30;
    switch (period) {
      case "today":
        maxDays = 1;
        break;
      case "7days":
        maxDays = 7;
        break;
      case "30days":
        maxDays = 30;
        break;
      case "3months":
        maxDays = 90;
        break;
      case "6months":
        maxDays = 180;
        break;
      case "12months":
        maxDays = 365;
        break;
      default:
        maxDays = 30;
    }

    // Filter payments due within the period
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + maxDays);

    const filteredPayments = allPaymentsData.filter((payment) => {
      const dueDate = new Date(payment.dueDate);
      return dueDate >= now && dueDate <= futureDate;
    });

    // Take only the first 4 payments
    const limitedPayments = filteredPayments.slice(0, 4);
    setUpcomingPaymentsData(limitedPayments);

    // Reset animations
    setVisibleItems([]);

    const interval = setInterval(() => {
      setVisibleItems((prev) => {
        const nextIndex = prev.length;
        if (nextIndex >= limitedPayments.length) {
          clearInterval(interval);
          return prev;
        }
        return [...prev, nextIndex];
      });
    }, 200);

    return () => clearInterval(interval);
  }, [period]);

  // Function to get days until due date
  const getDaysUntil = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Function to get appropriate time badge text
  const getTimeBadgeText = (date: Date) => {
    const days = getDaysUntil(date);

    if (days < 0) return "Completado";
    if (days === 0) return "Hoy";
    if (days === 1) return "Mañana";
    return `En ${days} días`;
  };

  // Function to get status icon
  const getStatusIcon = (status: string, days: number) => {
    if (status === "completed") return "✅";
    if (days <= 1) return "⏳";
    return "💸";
  };

  // Function to get badge color class
  const getBadgeColorClass = (status: string, days: number) => {
    if (status === "completed")
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (days <= 1)
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse";
    if (days <= 3)
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  };

  return (
    <div className="space-y-3">
      {upcomingPaymentsData.length > 0 ? (
        upcomingPaymentsData.map((payment, index) => {
          const daysUntil = getDaysUntil(payment.dueDate);
          const timeBadgeText = getTimeBadgeText(payment.dueDate);
          const statusIcon = getStatusIcon(payment.status, daysUntil);
          const badgeColorClass = getBadgeColorClass(payment.status, daysUntil);

          return (
            <div
              key={payment.id}
              className={cn(
                "flex items-center p-3 rounded-lg border bg-card transition-all duration-300 transform hover:shadow-md hover:-translate-y-0.5",
                visibleItems.includes(index)
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4"
              )}
            >
              {/* Left: Status Icon */}
              <div
                className={cn(
                  "flex items-center justify-center h-9 w-9 rounded-full text-lg",
                  payment.status === "completed"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : daysUntil <= 1
                      ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                )}
              >
                {statusIcon}
              </div>

              {/* Center: Info */}
              <div className="ml-4 flex-grow">
                <p className="text-sm font-medium">{payment.clientName}</p>
                <p className="text-xs text-muted-foreground">
                  Cuota #{payment.installment} –{" "}
                  {new Intl.NumberFormat("es-DO", {
                    style: "currency",
                    currency: "DOP",
                  }).format(payment.amount)}
                </p>
              </div>

              {/* Right: Time Badge */}
              <div className="ml-auto">
                <span
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all",
                    badgeColorClass
                  )}
                >
                  {timeBadgeText}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-6 text-center text-muted-foreground">
          No hay pagos programados para este período
        </div>
      )}
    </div>
  );
}
