import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "~/utils/supabase";

export const signupSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "La contraseña debe contener al menos un carácter especial"
    ),
  redirectUrl: z.string().optional(),
});

export type SignupSchemaTypes = z.infer<typeof signupSchema>;

export const signupFn = createServerFn({ method: "POST" })
  .validator(signupSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error, data: userData } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.name,
        },
      },
    });
    if (error) {
      let message = error.message;
      // You might need to inspect the `error` object further or refer to Supabase documentation
      // for specific error codes or more reliable ways to distinguish error types.
      switch (true) {
        case error.message.includes("User already registered"):
          message =
            "Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza un correo diferente.";
          break;
        case error.message.includes("Email rate limit exceeded"):
          message =
            "Se han enviado demasiadas solicitudes de registro para este correo. Por favor, inténtalo de nuevo más tarde.";
          break;
        case error.message.includes("Password should be at least"):
          // This might be duplicative if your Zod schema is already catching it,
          // but can be a fallback.
          message =
            "La contraseña no cumple con los requisitos de seguridad. Asegúrate de que tenga la longitud y caracteres requeridos.";
          break;
        // Add more specific error checks here as needed
        default:
          // Keep the original Supabase error message if no specific case matches
          break;
      }

      throw {
        error: true,
        message, // Use the potentially more specific message
      };
    }

    return {
      message: "Registro exitoso. Por favor, verifica tu correo electrónico.",
    };
    // Redirect to the prev page stored in the "redirect" search param
    // throw redirect({
    //   href: data.redirectUrl || "/",
    // });
  });
