import {
  Calendar,
  Car,
  FileText,
  Home,
  Settings,
  Users,
  Shield,
  LogOut,
} from "lucide-react";
import { cn, generateAvatarColor, getInitials } from "~/lib/utils";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import { useAuth } from "~/components/auth-provider";
import { Link, useRouter } from "@tanstack/react-router";

export default function Sidebar({
  user: userData,
}: {
  user: { email: string; username: string };
}) {
  const router = useRouter();

  const pathname = router.state.location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mock user data - in a real app, this would come from authentication context
  const user = {
    name: userData.username,
    email: userData.email,
    role: "Administrador",
  };

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Define categories and their routes
  const categories = [
    {
      id: "overview",
      label: "Vista general",
      routes: [
        {
          label: "Inicio",
          icon: Home,
          href: "/",
        },
      ],
    },
    {
      id: "business",
      label: "Negocio",
      routes: [
        {
          label: "Clientes",
          icon: Users,
          href: "/clients",
          badge: "6",
        },
        {
          label: "Vehículos",
          icon: Car,
          href: "/vehicles",
        },
        {
          label: "Contratos",
          icon: FileText,
          href: "/contracts",
        },
        {
          label: "Seguros",
          icon: Shield,
          href: "/insurance",
        },
      ],
    },
    {
      id: "tools",
      label: "Herramientas",
      routes: [
        {
          label: "Calendario",
          icon: Calendar,
          href: "/calendar",
        },
      ],
    },
    {
      id: "system",
      label: "Sistema",
      routes: [
        {
          label: "Configuración",
          icon: Settings,
          href: "/settings",
        },
      ],
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="px-3 py-2 flex-1 overflow-y-auto">
        {/* Categorized Navigation */}
        <nav className="space-y-6 mt-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold font-jakarta text-lg"
          >
            <Car className="h-6 w-6" />
            <span className={cn(isCollapsed && "hidden")}>AutoGestión</span>
          </Link>
          {categories.map((category) => (
            <div key={category.id} className="space-y-1">
              {/* Category Header - No chevron, always visible */}
              {!isCollapsed && (
                <div>
                  <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {category.label}
                  </div>
                  <div className="mt-1 space-y-1">
                    {category.routes.map((route) => (
                      <Link
                        key={route.href}
                        to={route.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium font-jakarta transition-all hover:text-primary",
                          pathname === route.href
                            ? "bg-accent text-accent-foreground"
                            : "transparent"
                        )}
                      >
                        <route.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{route.label}</span>
                        {route.badge && (
                          <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-gray-600">
                            {route.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Collapsed View (Icons Only) */}
              {isCollapsed && (
                <div className="space-y-1 pt-1">
                  {category.id !== "overview" && (
                    <div className="mx-2 my-3 border-t border-gray-100"></div>
                  )}
                  {category.routes.map((route) => (
                    <Link
                      key={route.href}
                      to={route.href}
                      className={cn(
                        "flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md",
                        pathname === route.href
                          ? "bg-gray-50 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <route.icon className="h-5 w-5 flex-shrink-0" />
                      {route.badge && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-600">
                          {route.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Card */}
      <div className={cn("mt-auto border-t", isCollapsed ? "p-2" : "p-3")}>
        {!isCollapsed ? (
          <div className="rounded-lg border bg-card shadow-sm p-3">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback
                  style={{ backgroundColor: generateAvatarColor(user.name) }}
                  className="text-white text-sm font-medium"
                >
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
            <Link
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                class:
                  "w-full justify-start text-muted-foreground hover:text-foreground",
              })}
              to="/logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Avatar className="h-9 w-9 mb-2">
              <AvatarFallback
                style={{ backgroundColor: generateAvatarColor(user.name) }}
                className="text-white text-sm font-medium"
              >
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <Link
              to="/logout"
              className={buttonVariants({
                class: "h-8 w-8",
                variant: "ghost",
                size: "icon",
              })}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Cerrar sesión</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
