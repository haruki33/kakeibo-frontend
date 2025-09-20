import { createContext } from "react";
import type { AuthContextType } from "../types/login";

export const AuthContext = createContext<AuthContextType>({
  token: "",
  email: "",
  password: "",
  setEmail: () => {},
  setPassword: () => {},
  onLogin: () => {},
  onLogout: () => {},
});
