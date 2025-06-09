import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";

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
import testimonialImage from "../public/testimonial-1.png";
import { cn } from "~/lib/utils";
import { useAuth } from "~/components/auth-provider";
import { useToast } from "~/hooks/use-toast";

// React Hook Form imports
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  component: AuthPage,
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/" });
    }
  },
});
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { signupSchema, SignupSchemaTypes } from "~/services/auth/signup";
import { loginFn } from "./_authed";
import { signupFn } from "./signup";

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es requerida"),
  remember: z.boolean().optional(),
});

// Types
type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showElements, setShowElements] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // React Hook Form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const signupForm = useForm<SignupSchemaTypes>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Track password validation state
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    capital: false,
    special: false,
  });

  // Watch password field to update validation checks
  const watchedPassword = signupForm.watch("password");
  useEffect(() => {
    if (watchedPassword) {
      setPasswordChecks({
        length: watchedPassword.length >= 8,
        number: /\d/.test(watchedPassword),
        capital: /[A-Z]/.test(watchedPassword),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(watchedPassword),
      });
    }
  }, [watchedPassword]);

  const loginMutation = useMutation({
    mutationFn: useServerFn(loginFn),
    onSuccess: async (ctx) => {
      await router.invalidate();
      router.navigate({ to: "/" });
      toast({
        title: "¡Bienvenido de nuevo!",
        description: "Has iniciado sesión exitosamente.",
        variant: "success",
      });
      return;
    },
  });

  const signupMutation = useMutation({
    mutationFn: signupFn,
  });

  // Refs for focus management
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Single testimonial data
  const testimonial = {
    quote:
      "AutoGestión ha transformado completamente la forma en que administramos nuestro concesionario. La interfaz intuitiva y las potentes funciones han revolucionado nuestra gestión diaria.",
    author: "María Rodríguez",
    role: "Gerente de Ventas",
    company: "AutoPremium",
    image: testimonialImage,
    query: "professional woman with brown hair in business attire smiling",
  };

  // Staggered animation on page load
  useEffect(() => {
    setShowElements(true);
  }, []);

  // Focus first input when tab changes
  useEffect(() => {
    if (activeTab === "signin") {
      emailInputRef.current?.focus();
    } else {
      nameInputRef.current?.focus();
    }
  }, [activeTab]);

  // Form submission handlers
  const handleSignIn = async (data: LoginFormValues) => {
    try {
      // Use the existing loginMutation with React Hook Form data
      await loginMutation.mutateAsync({
        data,
      });

      // If needed, handle the remember me option
      if (data.remember) {
        // Store in localStorage or implement remember me logic
        localStorage.setItem("rememberEmail", data.email);
      }

      // Existing success code will be executed in loginMutation.onSuccess
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: "Por favor verifica tus credenciales e intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleSignUp: SubmitHandler<SignupSchemaTypes> = async (
    data: SignupSchemaTypes
  ) => {
    // Use the existing signupMutation with React Hook Form data
    signupMutation.mutate(
      {
        // TODO!: Add redirect URL to an email confirmation page
        data: { email: data.email, password: data.password, name: data.name },
      },
      {
        onError: (error) => {
          console.log(error);
          toast({
            title: "Error al crear la cuenta",
            description: error.message,
            variant: "destructive",
          });
        },
        onSuccess: () => {
          setShowConfetti(true);
          toast({
            title: "¡Cuenta creada exitosamente!",
            description:
              "Revisa tu correo electrónico para confirmar tu cuenta.",
            variant: "success",
          });
        },
      }
    );
  };

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

            {/* Sign In Form with React Hook Form */}
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

              <form
                onSubmit={loginForm.handleSubmit(handleSignIn)}
                className="space-y-6"
              >
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
                      className={cn(
                        "h-11 rounded-lg focus:ring-2 focus:ring-primary/30 transition-all",
                        loginForm.formState.errors.email &&
                          "border-red-500 focus:ring-red-300/30"
                      )}
                      aria-describedby="email-description"
                      {...loginForm.register("email")}
                      ref={(e) => {
                        // This handles both the RHF registration and our focus ref
                        loginForm.register("email").ref(e);
                        emailInputRef.current = e;
                      }}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
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
                        className={cn(
                          "h-11 pr-10 rounded-lg focus:ring-2 focus:ring-primary/30 transition-all",
                          loginForm.formState.errors.password &&
                            "border-red-500 focus:ring-red-300/30"
                        )}
                        aria-describedby="password-description"
                        {...loginForm.register("password")}
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
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
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
                      {...loginForm.register("remember")}
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
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
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

            {/* Sign Up Form with React Hook Form */}
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

              <form
                onSubmit={signupForm.handleSubmit(handleSignUp)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {/* Name field with hint */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nombre completo
                    </Label>
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                      className={cn(
                        "h-11 rounded-lg focus:ring-2 focus:ring-primary/30 transition-all",
                        signupForm.formState.errors.name &&
                          "border-red-500 focus:ring-red-300/30"
                      )}
                      aria-describedby="name-description"
                      {...signupForm.register("name")}
                      ref={(e) => {
                        // This handles both the RHF registration and our focus ref
                        signupForm.register("name").ref(e);
                        nameInputRef.current = e;
                      }}
                    />
                    {signupForm.formState.errors.name ? (
                      <p className="text-xs text-red-500 mt-1">
                        {signupForm.formState.errors.name.message}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        Ej: Juan Pérez
                      </p>
                    )}
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
                        className={cn(
                          "h-11 rounded-lg transition-all pr-10",
                          signupForm.formState.errors.email &&
                            "border-red-500 focus:ring-red-300/30",
                          !signupForm.formState.errors.email &&
                            signupForm.formState.dirtyFields.email &&
                            "border-green-500 focus:ring-green-300/30"
                        )}
                        aria-describedby="email-signup-description"
                        {...signupForm.register("email")}
                      />
                      {signupForm.formState.dirtyFields.email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {signupForm.formState.errors.email ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {signupForm.formState.errors.email ? (
                      <p className="text-xs text-red-500 mt-1">
                        {signupForm.formState.errors.email.message}
                      </p>
                    ) : signupForm.formState.dirtyFields.email ? (
                      <p className="text-xs text-green-500 mt-1">
                        Correo electrónico válido
                      </p>
                    ) : null}
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
                        className={cn(
                          "h-11 pr-10 rounded-lg transition-all",
                          signupForm.formState.errors.password
                            ? "border-destructive focus-visible:ring-destructive/20"
                            : "focus-visible:ring-primary/20"
                        )}
                        aria-describedby="password-signup-description"
                        {...signupForm.register("password")}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                              ? "text-success"
                              : "text-muted-foreground/70"
                          )}
                        >
                          {passwordChecks.length ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/40" />
                          )}
                        </div>
                        <span
                          className={
                            passwordChecks.length
                              ? "text-success font-medium"
                              : "text-muted-foreground"
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
                              ? "text-success"
                              : "text-muted-foreground/70"
                          )}
                        >
                          {passwordChecks.number ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/40" />
                          )}
                        </div>
                        <span
                          className={
                            passwordChecks.number
                              ? "text-success font-medium"
                              : "text-muted-foreground"
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
                              ? "text-success"
                              : "text-muted-foreground/70"
                          )}
                        >
                          {passwordChecks.capital ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/40" />
                          )}
                        </div>
                        <span
                          className={
                            passwordChecks.capital
                              ? "text-success font-medium"
                              : "text-muted-foreground"
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
                              ? "text-success"
                              : "text-muted-foreground/70"
                          )}
                        >
                          {passwordChecks.special ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/40" />
                          )}
                        </div>
                        <span
                          className={
                            passwordChecks.special
                              ? "text-success font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          Al menos un carácter especial
                        </span>
                      </div>
                    </div>

                    {signupForm.formState.errors.password && (
                      <p className="text-xs text-destructive mt-1">
                        {signupForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium transition-all duration-300 rounded-lg bg-primary hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 group"
                  disabled={
                    signupMutation.isPending || !signupForm.formState.isValid
                  }
                >
                  {signupMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Comenzar ahora
                      <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel - Single Testimonial with new design */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <img
          className="absolute inset-0 h-full w-full object-cover object-center min-w-full"
          alt=""
          src={
            testimonial.image ||
            `../assets/placeholder.svg?height=1080&width=720&query=${encodeURIComponent(
              testimonial.query || ""
            )}`
          }
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
