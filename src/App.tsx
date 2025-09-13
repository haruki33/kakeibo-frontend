import { Routes, Route } from "react-router";

import { AuthContext } from "./AuthContext";
import { useAuth } from "./utils/useAuth";

import LoginLayout from "./LoginLayout";
import Signin from "./Signin";
import Signup from "./Signup";

import MainLayout from "./MainLayout";
import MyRegister from "./MyRegister";
import MyTable from "./MyTable";
import MySetting from "./MySetting";
import NoMatch from "./NoMatch";

import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import type {
  SigninType,
  AuthProviderType,
  ProtectedRouteType,
} from "./components/types/login";

const AuthProvider = ({ children }: AuthProviderType) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const signin: SigninType = {
      email,
      password,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signin),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Response status:", res.status);
        console.error("Response body:", errorText);
        throw new Error(
          `Failed to create transaction: ${res.status} - ${errorText}`
        );
      }
      const createdSignin = await res.json();
      localStorage.setItem("accessToken", createdSignin.token);
      setToken(createdSignin.token);
    } catch (error) {
      console.error("Error creating signin:", error);
    } finally {
      setEmail("");
      setPassword("");
      navigate("/MyRegister");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setToken("");
  };

  const value = {
    token,
    email,
    password,
    setEmail,
    setPassword,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const ProtectedRoute = ({ children }: ProtectedRouteType) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ログイン状態に基づいてリダイレクトするコンポーネント
const RedirectBasedOnAuth = () => {
  const { token } = useAuth();
  return token ? <Navigate to="/MyRegister" replace /> : <Signin />;
};

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route element={<LoginLayout />}>
            <Route index element={<RedirectBasedOnAuth />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route
              path="MyRegister"
              element={
                <ProtectedRoute>
                  <MyRegister />
                </ProtectedRoute>
              }
            />
            <Route
              path="MyTable"
              element={
                <ProtectedRoute>
                  <MyTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="MySetting"
              element={
                <ProtectedRoute>
                  <MySetting />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
