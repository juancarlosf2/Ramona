import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
// import { Login } from "../components/Login";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Car,
  Eye,
  EyeOff,
  Star,
  Loader2,
  CheckCircle2,
  XCircle,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useAuth } from "~/components/auth-provider";
import { useToast } from "~/hooks/use-toast";

export const Route = createFileRoute("/login")({
  component: AuthPage,
});

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showElements, setShowElements] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Form validation states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    capital: false,
    special: false,
  });

  // Refs for focus management
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Single testimonial data
  const testimonial = {
    quote:
      "AutoGestión ha transformado completamente la forma en que administramos nuestro concesionario. La interfaz intuitiva y las potentes funciones han revolucionado nuestra gestión diaria.",
    author: "María Rodríguez",
    role: "Gerente de Ventas",
    company: "AutoPremium",
    image: "/testimonial-1.png",
    query: "professional woman with brown hair in business attire smiling",
  };

  // Staggered animation on page load
  useEffect(() => {
    setShowElements(true);
  }, []);

  // Email validation
  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Password validation
  const validatePassword = (password: string) => {
    setPasswordChecks({
      length: password.length >= 8,
      number: /\d/.test(password),
      capital: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleEmailBlur = () => {
    if (email) {
      setEmailValid(validateEmail(email));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      login(); // This will set isAuthenticated to true and redirect to "/"
    }, 1500);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      setShowConfetti(true);

      toast({
        title: "¡Cuenta creada exitosamente!",
        description:
          "Bienvenido a AutoGestión. Tu prueba de 30 días ha comenzado.",
        variant: "success",
      });

      setTimeout(() => {
        login(); // This will set isAuthenticated to true and redirect to "/"
      }, 2000);
    }, 1500);
  };

  // Focus first input when tab changes
  useEffect(() => {
    if (activeTab === "signin") {
      emailInputRef.current?.focus();
    } else {
      nameInputRef.current?.focus();
    }
  }, [activeTab]);

  return (
    <div className="flex min-h-screen">
      {/* Confetti effect on successful signup */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 confetti-container">
          {/* This would be implemented with a confetti library in a real app */}
          <div className="absolute top-0 left-1/4 animate-fall-slow">
            <div className="h-4 w-4 bg-yellow-400 rotate-45"></div>
          </div>
          <div className="absolute top-0 left-1/3 animate-fall-medium">
            <div className="h-3 w-3 bg-primary rotate-12"></div>
          </div>
          <div className="absolute top-0 left-1/2 animate-fall-fast">
            <div className="h-5 w-5 bg-green-400 rotate-45"></div>
          </div>
          <div className="absolute top-0 left-2/3 animate-fall-slow">
            <div className="h-4 w-4 bg-blue-400 rotate-20"></div>
          </div>
          <div className="absolute top-0 left-3/4 animate-fall-medium">
            <div className="h-3 w-3 bg-red-400 rotate-45"></div>
          </div>
        </div>
      )}

      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div
          className={cn(
            "w-full max-w-md space-y-8 transition-all duration-500",
            showElements
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          <div className="flex items-center gap-2 mb-8">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">AutoGestión</span>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/30 rounded-xl shadow-sm">
              <TabsTrigger
                value="signin"
                className="rounded-lg transition-all ease-in-out duration-300 data-[state=active]:shadow-md data-[state=active]:bg-white hover:bg-gray-100"
              >
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-lg transition-all ease-in-out duration-300 data-[state=active]:shadow-md data-[state=active]:bg-white hover:bg-gray-100"
              >
                Registrarse
              </TabsTrigger>
            </TabsList>

            {/* Sign In Form */}
            <TabsContent
              value="signin"
              className="space-y-6 transition-all duration-300 data-[state=inactive]:translate-x-4 data-[state=inactive]:opacity-0 data-[state=active]:translate-x-0 data-[state=active]:opacity-100"
            >
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Bienvenido de nuevo
                </h1>
                <p className="text-muted-foreground">
                  Ingresa tus credenciales para acceder a tu cuenta
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-6">
                <div
                  className="space-y-4"
                  style={
                    {
                      "--stagger-delay": "100ms",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={cn(
                      "space-y-2 transition-all duration-300 delay-[calc(var(--stagger-delay)*1)]",
                      showElements
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    )}
                  >
                    <Label htmlFor="email" className="text-sm font-medium">
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      required
                      className="h-11 rounded-lg focus:ring-2 focus:ring-primary/30 transition-all"
                      aria-describedby="email-description"
                      ref={emailInputRef}
                    />
                    <span id="email-description" className="sr-only">
                      Ingresa tu correo electrónico
                    </span>
                  </div>

                  <div
                    className={cn(
                      "space-y-2 transition-all duration-300 delay-[calc(var(--stagger-delay)*2)]",
                      showElements
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Contraseña
                      </Label>
                      <Link
                        to="/auth/forgot-password"
                        className="text-sm font-medium text-primary hover:text-purple-600 hover:underline transition-colors ml-1"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        className="h-11 pr-10 rounded-lg focus:ring-2 focus:ring-primary/30 transition-all"
                        aria-describedby="password-description"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <span id="password-description" className="sr-only">
                      Ingresa tu contraseña
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex items-center space-x-2 transition-all duration-300 delay-[calc(var(--stagger-delay)*3)]",
                      showElements
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    )}
                  >
                    <Checkbox
                      id="remember"
                      className="rounded-md data-[state=checked]:animate-[checkbox-pop_0.2s_ease-in-out]"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Recordarme
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn(
                    "w-full h-11 text-base font-medium transition-all duration-300 delay-[calc(var(--stagger-delay)*4)] rounded-lg",
                    "bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary hover:shadow-lg hover:brightness-105",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    showElements
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Iniciar sesión
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div
                  className={cn(
                    "relative my-6 transition-all duration-300 delay-[calc(var(--stagger-delay)*5)]",
                    showElements
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                >
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      O continúa con
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full h-11 text-base font-normal transition-all duration-300 delay-[calc(var(--stagger-delay)*6)] rounded-lg",
                    "hover:bg-gray-100/50 hover:shadow-md group",
                    showElements
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                >
                  <svg
                    className="mr-2 h-5 w-5 transition-transform group-hover:scale-110 duration-300"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Ingresa con Google
                </Button>
              </form>

              <div
                className={cn(
                  "text-center text-sm transition-all duration-300 delay-[calc(var(--stagger-delay)*7)]",
                  showElements
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                ¿No tienes una cuenta?{" "}
                <button
                  className="font-medium text-primary hover:text-purple-600 hover:underline transition-colors"
                  onClick={() => setActiveTab("signup")}
                >
                  Regístrate
                </button>
              </div>
            </TabsContent>

            {/* Sign Up Form - Enhanced with UX improvements */}
            <TabsContent
              value="signup"
              className="space-y-6 transition-all duration-300 data-[state=inactive]:translate-x-[-1rem] data-[state=inactive]:opacity-0 data-[state=active]:translate-x-0 data-[state=active]:opacity-100"
            >
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Crea tu cuenta
                </h1>
                <p className="text-muted-foreground">
                  Comienza tu prueba gratuita de 30 días{" "}
                  <span className="text-xs font-medium">
                    • Sin tarjeta de crédito
                  </span>
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-4">
                  {/* Name field with hint */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nombre completo
                    </Label>
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                      required
                      className="h-11 rounded-lg focus:ring-2 focus:ring-primary/30 transition-all"
                      aria-describedby="name-description"
                      ref={nameInputRef}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Ej: Juan Pérez
                    </p>
                  </div>

                  {/* Email field with validation */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email-signup"
                      className="text-sm font-medium"
                    >
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        required
                        className={cn(
                          "h-11 rounded-lg transition-all pr-10",
                          emailValid === true &&
                            "border-green-500 focus:ring-green-300/30",
                          emailValid === false &&
                            "border-red-500 focus:ring-red-300/30",
                          emailValid === null &&
                            "focus:ring-2 focus:ring-primary/30"
                        )}
                        aria-describedby="email-signup-description"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                      />
                      {emailValid !== null && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {emailValid ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {emailValid === false && (
                      <p className="text-xs text-red-500 mt-1">
                        Este correo electrónico parece incorrecto
                      </p>
                    )}
                    {emailValid === true && (
                      <p className="text-xs text-green-500 mt-1">
                        Correo electrónico válido
                      </p>
                    )}
                  </div>

                  {/* Password field with real-time validation */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password-signup"
                      className="text-sm font-medium"
                    >
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="password-signup"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        className="h-11 pr-10 rounded-lg focus:ring-2 focus:ring-primary/30 transition-all"
                        aria-describedby="password-signup-description"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* Password validation checklist */}
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "transition-colors",
                            passwordChecks.length
                              ? "text-green-500"
                              : "text-gray-400"
                          )}
                        >
                          {passwordChecks.length ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-400" />
                          )}
                        </div>
                        <span
                          className={
                            passwordChecks.length
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          Mínimo 8 caracteres
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "transition-colors",
                            passwordChecks.number
                              ? "text-green-500"
                              : "text-gray-400"
                          )}
                        >
                          {passwordChecks.number ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-400" />
                          )}
                        </div>
                        <span
                          className={
                            passwordChecks.number
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          Al menos un número
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "transition-colors",
                            passwordChecks.capital
                              ? "text-green-500"
                              : "text-gray-400"
                          )}
                        >
                          {passwordChecks.capital ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-400" />
                          )}
                        </div>
                        <span
                          className={
                            passwordChecks.capital
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          Al menos una letra mayúscula
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "transition-colors",
                            passwordChecks.special
                              ? "text-green-500"
                              : "text-gray-400"
                          )}
                        >
                          {passwordChecks.special ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-400" />
                          )}
                        </div>
                        <span
                          className={
                            passwordChecks.special
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          Al menos un carácter especial
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium transition-all duration-300 rounded-lg bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary hover:shadow-lg hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Comenzar ahora
                      <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      O continúa con
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 text-base font-normal transition-all duration-300 rounded-lg hover:bg-gray-100/50 hover:shadow-md group"
                >
                  <svg
                    className="mr-2 h-5 w-5 transition-transform group-hover:scale-110 duration-300"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Ingresa con Google
                </Button>

                <div className="text-center text-sm mt-8">
                  ¿Ya tienes una cuenta?{" "}
                  <button
                    className="font-medium text-primary hover:text-purple-600 hover:underline transition-colors inline-flex items-center"
                    onClick={() => setActiveTab("signin")}
                  >
                    Inicia sesión
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel - Single Testimonial with new design */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center h-full w-full"
          style={{
            backgroundImage: `url(${testimonial.image || `/placeholder.svg?height=1080&width=720&query=${encodeURIComponent(testimonial.query || "")}`})`,
          }}
        />

        {/* Frosted Glass Testimonial Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 text-white">
            <p className="text-lg leading-tight mb-4">"{testimonial.quote}"</p>

            <div>
              <p className="font-semibold">{testimonial.author}</p>
              <p className="text-white/80 text-sm">
                {testimonial.role}, {testimonial.company}
              </p>

              {/* Star Rating */}
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-current text-yellow-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// function LoginComp() {
//   return <Login />
// }
