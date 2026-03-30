import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "member" | "expert";

interface User {
  name: string;
  email: string;
  avatar: string;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  role: UserRole;
  login: () => void;
  logout: () => void;
  toggleRole: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  role: "member",
  login: () => {},
  logout: () => {},
  toggleRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

const mockUser: User = {
  name: "디하북스 회원",
  email: "user@dihabooks.com",
  avatar: "디",
  profileImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&h=100&fit=crop&crop=center",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("member");

  const login = () => setUser(mockUser);
  const logout = () => { setUser(null); setRole("member"); };
  const toggleRole = () => setRole(r => r === "member" ? "expert" : "member");

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, role, login, logout, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
};
