import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "전자책 스토어", path: "/store" },
  { label: "내 서재", path: "/library" },
  { label: "커뮤니티", path: "/community" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            D
          </div>
          <span className="text-lg font-bold tracking-tight">
            디하<span className="text-gradient-primary">북스</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden tablet:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="hidden tablet:flex items-center flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="무엇을 배우고 싶으신가요?"
              className="pl-9 h-10 rounded-full bg-secondary border-0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="hidden tablet:flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors">
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {user?.avatar}
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2" onClick={() => navigate("/profile")}>
                  <User className="h-4 w-4" /> 내 정보
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={() => navigate("/library")}>
                  <User className="h-4 w-4" /> 내 서재
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={() => navigate("/instructor")}>
                  <LayoutDashboard className="h-4 w-4" /> 판매자 대시보드
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> 로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  로그인
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  작가 신청
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="tablet:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="tablet:hidden border-t border-border bg-background p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="무엇을 배우고 싶으신가요?"
              className="pl-9 rounded-full bg-secondary border-0"
            />
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {isLoggedIn ? (
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {user?.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Link to="/library" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" size="sm">내 서재</Button>
              </Link>
              <Link to="/instructor" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" size="sm">판매자 대시보드</Button>
              </Link>
              <Button variant="ghost" className="w-full text-destructive" size="sm" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full" size="sm">로그인</Button>
              </Link>
              <Link to="/signup" className="flex-1">
                <Button className="w-full bg-primary text-primary-foreground" size="sm">작가 신청</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
