import { refreshAccessToken } from "@/api/auth";
import { setStoredAccessToken } from "@/lib/authToken";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  user: { id: string; email: string; name: string } | null;
  setUser: (user: AuthContextType["user"]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);

  useEffect(function () {
    const loadAuth = async () => {
      try {
        const { accessToken: newToken, user } = await refreshAccessToken();
        setAccessToken(newToken);
        setUser(user);
        setStoredAccessToken(newToken);
      } catch (err: any) {
        console.log(err);
      }
    };
    loadAuth();
  }, []);

  useEffect(
    function () {
      setStoredAccessToken(accessToken);
    },
    [accessToken],
  );

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
