import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "member" | "expert";

interface User {
  name: string;
  email: string;
  avatar: string;
  profileImage: string;
}

interface SellerProfile {
  intro: string;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  role: UserRole;
  sellerProfile: SellerProfile;
  updateSellerProfile: (profile: Partial<SellerProfile>) => void;
  login: () => void;
  logout: () => void;
  toggleRole: () => void;
}

const defaultSellerProfile: SellerProfile = {
  intro: "마케팅, 디자인하는 디하북스 판매자입니다.",
  profileImage: "",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  role: "member",
  sellerProfile: defaultSellerProfile,
  updateSellerProfile: () => {},
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
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(defaultSellerProfile);

  const login = () => setUser(mockUser);
  const logout = () => { setUser(null); setRole("member"); };
  const toggleRole = () => setRole(r => r === "member" ? "expert" : "member");
  const updateSellerProfile = (profile: Partial<SellerProfile>) =>
    setSellerProfile(prev => ({ ...prev, ...profile }));

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, role, sellerProfile, updateSellerProfile, login, logout, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
};
