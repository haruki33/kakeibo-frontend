export type Signup = {
  name: string;
  email: string;
  password: string;
};

export type SigninType = {
  email: string;
  password: string;
};

export type AuthContextType = {
  token: string;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onLogin: () => void;
  onLogout: () => void;
};

export type AuthProviderType = {
  children: React.ReactNode;
};

export type ProtectedRouteType = {
  children: React.ReactNode;
};
