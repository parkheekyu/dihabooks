import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "member" | "expert";

interface User {
  name: string;
  email: string;
  avatar: string;
  profileImage: string;
}

// Shown verbatim in the 작가 소개 block at the bottom of every product page.
interface SellerProfile {
  nickname: string;
  intro: string;
  profileImage: string;
  /** 1:1 문의 링크. Empty hides the contact button. */
  contactUrl: string;
  /** 정산 계좌. 예금주는 작가 본인 명의여야 정산이 처리된다. */
  bankName: string;
  accountNumber: string;
  accountHolder: string;
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
  authOpen: boolean;
  authMode: "login" | "signup";
  openAuth: (mode?: "login" | "signup") => void;
  closeAuth: () => void;
}

const defaultSellerProfile: SellerProfile = {
  nickname: "크리에이터 김",
  intro: "작가에 대한 소개글. 안녕하세요.\n저는 누구누구입니다. 만나서 반갑습니다.",
  profileImage: "",
  contactUrl: "https://open.kakao.com/",
  bankName: "",
  accountNumber: "",
  accountHolder: "",
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
  authOpen: false,
  authMode: "login",
  openAuth: () => {},
  closeAuth: () => {},
});

export const useAuth = () => useContext(AuthContext);

const mockUser: User = {
  name: "김샘플",
  email: "sample@dihabooks.com",
  avatar: "김",
  profileImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&h=100&fit=crop&crop=center",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser); // 기본 로그인(멤버) 상태
  const [role, setRole] = useState<UserRole>("member");
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(defaultSellerProfile);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const login = () => { setUser(mockUser); setAuthOpen(false); };
  const logout = () => { setUser(null); setRole("member"); };
  const toggleRole = () => setRole(r => r === "member" ? "expert" : "member");
  const updateSellerProfile = (profile: Partial<SellerProfile>) =>
    setSellerProfile(prev => ({ ...prev, ...profile }));
  const openAuth = (mode: "login" | "signup" = "login") => { setAuthMode(mode); setAuthOpen(true); };
  const closeAuth = () => setAuthOpen(false);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, role, sellerProfile, updateSellerProfile, login, logout, toggleRole, authOpen, authMode, openAuth, closeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
