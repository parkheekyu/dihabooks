import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, Mail, Shield, LayoutDashboard, LogOut, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { icon: User, label: "프로필 수정", desc: "이름, 소개 등 기본 정보 변경", path: "#" },
    { icon: BookOpen, label: "내 서재", desc: "구매한 전자책 목록", path: "/library" },
    { icon: LayoutDashboard, label: "판매자 대시보드", desc: "전자책 판매 및 수익 관리", path: "/instructor" },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-14 tablet:h-16 items-center gap-3 px-4">
          <Link to="/" className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <span className="font-bold text-sm tablet:text-base">내 정보</span>
        </div>
      </header>

      <main className="container px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Profile Card */}
        <div className="rounded-xl border border-border bg-background p-6 flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
            {user?.avatar}
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
            일반 회원
          </span>
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
      </main>
    </div>
  );
};

export default Profile;
