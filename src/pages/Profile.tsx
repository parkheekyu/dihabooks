import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, User, LogOut, BookOpen, Settings, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const { user, isLoggedIn, role, logout, toggleRole } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const memberMenu = [
    { icon: User, label: "프로필 수정", desc: "이름, 소개 등 기본 정보 변경", path: "#" },
    { icon: BookOpen, label: "내 서재", desc: "구매한 전자책 목록", path: "/library" },
    { icon: ShoppingBag, label: "구매 내역", desc: "주문 내역 및 리뷰 관리", path: "/purchases" },
  ];

  const sellerMenu = [
    { icon: User, label: "프로필 수정", desc: "이름, 소개 등 기본 정보 변경", path: "#" },
    { icon: Settings, label: "판매자 프로필 설정", desc: "소개, 경력, 보유 기술 등 설정", path: "/seller-profile" },
    { icon: BookOpen, label: "내 서재", desc: "구매한 전자책 목록", path: "/library" },
    { icon: ShoppingBag, label: "구매 내역", desc: "주문 내역 및 리뷰 관리", path: "/purchases" },
  ];

  const menuItems = role === "expert" ? sellerMenu : memberMenu;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container px-4 py-6 max-w-lg mx-auto space-y-6">
          {/* Profile Card */}
          <div className="rounded-xl border border-border bg-background p-6 flex flex-col items-center gap-3">
            <img
              src={user?.profileImage}
              alt=""
              className="h-16 w-16 rounded-full object-cover border-2 border-border"
            />
            <div className="text-center">
              <p className="font-bold text-lg">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <button
              onClick={toggleRole}
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                role === "member" ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary"
              }`}
            >
              {role === "member" ? "멤버" : "판매자"}
            </button>
          </div>

          {/* Menu */}
          <div className="rounded-xl border border-border bg-background overflow-hidden divide-y divide-border">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center gap-3 px-4 py-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
