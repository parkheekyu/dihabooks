import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "member" | "expert";
export type Gender = "male" | "female" | "";

interface User {
  /** 실명. 정산·본인확인용이며 화면에는 노출하지 않는다. */
  name: string;
  /** 화면에 보이는 이름. 디하클 카페 닉네임과 일치시키도록 안내한다. */
  nickname: string;
  email: string;
  avatar: string;
  profileImage: string;
  gender: Gender;
  ageGroup: string;
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

/** 첫 소셜 로그인 직후 반드시 받아야 하는 값. */
export interface OnboardingInput {
  nickname: string;
  gender: Gender;
  ageGroup: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  role: UserRole;
  sellerProfile: SellerProfile;
  updateSellerProfile: (profile: Partial<SellerProfile>) => void;
  updateUser: (patch: Partial<User>) => void;
  login: () => void;
  logout: () => void;
  toggleRole: () => void;
  authOpen: boolean;
  authMode: "login" | "signup";
  openAuth: (mode?: "login" | "signup") => void;
  closeAuth: () => void;
  /** 첫 로그인이라 닉네임·성별·나이를 아직 못 받은 상태. */
  needsOnboarding: boolean;
  completeOnboarding: (input: OnboardingInput) => void;
}

const defaultSellerProfile: SellerProfile = {
  nickname: "크리에이터 김",
  intro: "작가에 대한 소개글. 안녕하세요.\n저는 누구누구입니다. 만나서 반갑습니다.",
  profileImage: "",
  // 작가가 직접 설정하는 오픈채팅 주소. 플랫폼 고객센터 채널과는 별개다.
  contactUrl: "https://open.kakao.com/o/sample-author",
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
  updateUser: () => {},
  login: () => {},
  logout: () => {},
  toggleRole: () => {},
  authOpen: false,
  authMode: "login",
  openAuth: () => {},
  closeAuth: () => {},
  needsOnboarding: false,
  completeOnboarding: () => {},
});

export const useAuth = () => useContext(AuthContext);

const mockUser: User = {
  name: "김샘플",
  nickname: "샘플러",
  email: "sample@dihabooks.com",
  avatar: "김",
  profileImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&h=100&fit=crop&crop=center",
  gender: "male",
  ageGroup: "30대",
};

/** 카카오에서 막 넘어온 상태. 닉네임·성별·나이가 비어 있다. */
const freshKakaoUser: User = {
  name: "",
  nickname: "",
  email: "sample@dihabooks.com",
  avatar: "디",
  profileImage: "",
  gender: "",
  ageGroup: "",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser); // 기본 로그인(멤버) 상태
  const [role, setRole] = useState<UserRole>("member");
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(defaultSellerProfile);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // 카카오 로그인 성공 직후. 데모에서는 항상 첫 로그인으로 보고 추가 정보를 받는다.
  const login = () => {
    setUser(freshKakaoUser);
    setNeedsOnboarding(true);
  };

  const completeOnboarding = ({ nickname, gender, ageGroup }: OnboardingInput) => {
    setUser((prev) =>
      prev ? { ...prev, nickname, gender, ageGroup, avatar: nickname.slice(0, 1) } : prev
    );
    setNeedsOnboarding(false);
    setAuthOpen(false);
  };

  const logout = () => { setUser(null); setRole("member"); setNeedsOnboarding(false); };
  const toggleRole = () => setRole((r) => (r === "member" ? "expert" : "member"));
  const updateSellerProfile = (profile: Partial<SellerProfile>) =>
    setSellerProfile((prev) => ({ ...prev, ...profile }));
  const updateUser = (patch: Partial<User>) =>
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  const openAuth = (mode: "login" | "signup" = "login") => { setAuthMode(mode); setAuthOpen(true); };
  const closeAuth = () => setAuthOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user, isLoggedIn: !!user, role, sellerProfile, updateSellerProfile, updateUser,
        login, logout, toggleRole, authOpen, authMode, openAuth, closeAuth,
        needsOnboarding, completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
