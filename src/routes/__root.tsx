import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import * as React from "react";
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary";
import appCss from "../styles/app.css?url";
import { seo } from "../utils/seo";
import { NotFound } from "~/components/NotFound";

import { ThemeProvider } from "~/components/theme-provider";
import { cn } from "~/lib/utils";
import { AuthProvider } from "~/components/auth-provider";
import { Toaster } from "~/components/ui/toaster";
import { getUser } from "~/server/auth";

const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getUser();
  if (!user?.email) {
    return null;
  }

  // Safely access username with fallbacks
  const username =
    user.user_metadata?.username ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Usuario";

  return {
    email: user.email,
    username: username,
  };
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Car Dealership Management System",
        description: `Manage your dealership with ease.`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  beforeLoad: async () => {
    const user = await fetchUser();

    return {
      user,
    };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useRouteContext();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className={cn("min-h-dvh")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider user={user}>{children}</AuthProvider>
        </ThemeProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
