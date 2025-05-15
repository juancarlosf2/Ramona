import { useRouter } from "@tanstack/react-router";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Sidebar from "~/components/sidebar";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (in a real app, this would check tokens/session)
    const checkAuth = () => {
      // For demo purposes, we'll consider any path that's not in the auth directory as requiring authentication
      const isAuthPath = pathname.startsWith("/auth/");

      // If we're on a non-auth page, we'll assume the user should be authenticated
      // In a real app, this would check for a valid token/session
      const shouldBeAuthenticated = !isAuthPath;

      // If we're on a protected page but not authenticated, redirect to login
      if (shouldBeAuthenticated && !isAuthenticated && !isAuthPath) {
        // Only redirect if we're not already on an auth page
        if (!pathname.startsWith("/auth/")) {
          router.navigate({ to: "/login" });
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, isAuthenticated, router]);

  const login = () => {
    setIsAuthenticated(true);
    // In a real app, you would store tokens/session here
    router.navigate({ to: "/" });
  };

  const logout = () => {
    setIsAuthenticated(false);
    // In a real app, you would clear tokens/session here
    router.navigate({ to: "/signup" });
  };

  // Determine if we should show the auth layout or the app layout
  const isAuthPage = pathname.startsWith("/auth/");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {isAuthPage ? (
        // Auth pages (login, register, etc.) don't have the sidebar
        <>{children}</>
      ) : (
        // App pages have the sidebar when authenticated
        <div className="flex h-screen">
          {isAuthenticated && <Sidebar />}
          <main className="flex-1 overflow-auto p-6 bg-background">
            {children}
          </main>
        </div>
      )}
    </AuthContext.Provider>
  );
}
