import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { Card, CardContent } from "~/components/ui/card";

const data = [
  { name: "Disponible", value: 25, color: "#FACC15" },
  { name: "Reservado", value: 8, color: "#3B82F6" },
  { name: "En proceso de venta", value: 5, color: "#F97316" },
  { name: "Vendido", value: 34, color: "#22C55E" },
  { name: "En mantenimiento", value: 4, color: "#EF4444" },
];

export function VehicleStatusChart({ period = "30days" }: { period?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Animation effect
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        setActiveIndex(currentIndex);
        currentIndex++;
        if (currentIndex >= data.length) {
          clearInterval(interval);
          setTimeout(() => setActiveIndex(null), 500);
        }
      }, 300);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  if (!mounted) return null;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart className="animate-in fade-in duration-1000">
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          animationDuration={1000}
          animationBegin={200}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke={activeIndex === index ? "#fff" : "transparent"}
              strokeWidth={2}
              className="transition-all duration-200"
              style={{
                filter:
                  activeIndex === index
                    ? "drop-shadow(0 0 8px rgba(0,0,0,0.2))"
                    : "none",
                transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                transformOrigin: "center",
                transition: "transform 0.3s ease, filter 0.3s ease",
              }}
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="border shadow-lg animate-in zoom-in-95 duration-100">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Estado
                        </span>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor: payload[0].payload.color,
                            }}
                          />
                          <span className="font-bold text-foreground">
                            {payload[0].name}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Cantidad
                        </span>
                        <span className="font-bold">{payload[0].value}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
