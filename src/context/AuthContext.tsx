import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type User = {
  departamento: string;
  rol: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (departamento: string, rol: User["rol"]) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Recuperar sesión guardada al abrir la app
  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem("@session");
        if (stored) setUser(JSON.parse(stored));
      } catch {
        // sesión inválida, ignorar
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (departamento: string, rol: User["rol"]) => {
    const u: User = { departamento, rol };
    setUser(u);
    await AsyncStorage.setItem("@session", JSON.stringify(u));
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await AsyncStorage.removeItem("@session");
  };

  const isAdmin = () => user?.rol === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);