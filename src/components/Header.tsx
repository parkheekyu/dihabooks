import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, LogOut, User, Heart, BookOpen, LayoutDashboard, ArrowRightLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "전자책 스토어", path: "/store" },
  { label: "커뮤니티", path: "https://cafe.naver.com/dinohighclass", external: true },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, role, logout, toggleRole, openAuth } = useAuth();
  const { wishCount } = useWishlist();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleLabel = role === "member" ? "멤버" : "판매자";
  const roleStyles = role === "member"
    ? "bg-secondary text-muted-foreground"
    : "bg-primary/10 text-primary";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/brand/dihabooks-logo-kr.png"
            alt="디하북스"
            className="h-5 tablet:h-6 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden tablet:flex items-center gap-7 tablet:ml-4">
          {navItems.map((item) =>
            (item as any).external ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold tracking-tight text-foreground/70 hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-base font-bold tracking-tight transition-colors hover:text-foreground ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground/70"
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute -right-2.5 top-0 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          )}
        </nav>

        {/* Search */}
        <div className="hidden tablet:flex items-center max-w-[200px] ml-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="검색"
              className="pl-9 h-9 rounded-full bg-secondary border-0 text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="hidden tablet:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* Username */}
              <span className="text-sm font-medium">{user?.name}</span>

              {/* Role Tag (clickable toggle) */}
              <button
                onClick={toggleRole}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${roleStyles}`}
              >
                {roleLabel}
              </button>

              {/* Notifications */}
              <NotificationDropdown />

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 rounded-lg transition-colors">
                <Heart className="h-5 w-5 text-foreground" />
                {wishCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold flex items-center justify-center">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Profile photo dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 rounded-full hover:opacity-80 transition-opacity">
                    <img
                      src={user?.profileImage}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover border-2 border-border"
                    />
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="gap-2" onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4" /> 내 정보
                  </DropdownMenuItem>
                  {role === "member" ? (
                    <>
                      <DropdownMenuItem className="gap-2" onClick={() => navigate("/library")}>
                        <BookOpen className="h-4 w-4" /> 내 서재
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2" onClick={() => { toggleRole(); }}>
                        <ArrowRightLeft className="h-4 w-4" /> 판매자로 전환
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="gap-2" onClick={() => navigate("/library")}>
                        <BookOpen className="h-4 w-4" /> 내 서재
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => navigate("/instructor")}>
                        <LayoutDashboard className="h-4 w-4" /> 판매자 대시보드
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2" onClick={() => { toggleRole(); }}>
                        <ArrowRightLeft className="h-4 w-4" /> 멤버로 전환
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" /> 로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-5" onClick={() => openAuth("login")}>
                로그인
              </Button>
            </div>
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
            {navItems.map((item) =>
              (item as any).external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
          {isLoggedIn ? (
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {user?.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <button
                      onClick={toggleRole}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${roleStyles}`}
                    >
                      {roleLabel}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Link to="/profile" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full gap-2" size="sm"><User className="h-3.5 w-3.5" /> 내 정보</Button>
              </Link>
              {role === "member" ? (
                <>
                  <Link to="/library" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full gap-2" size="sm"><BookOpen className="h-3.5 w-3.5" /> 내 서재</Button>
                  </Link>
                  <Button variant="outline" className="w-full gap-2" size="sm" onClick={() => { toggleRole(); }}>
                    <ArrowRightLeft className="h-3.5 w-3.5" /> 판매자로 전환
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/library" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full gap-2" size="sm"><BookOpen className="h-3.5 w-3.5" /> 내 서재</Button>
                  </Link>
                  <Link to="/instructor" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full gap-2" size="sm"><LayoutDashboard className="h-3.5 w-3.5" /> 판매자 대시보드</Button>
                  </Link>
                  <Button variant="outline" className="w-full gap-2" size="sm" onClick={() => { toggleRole(); }}>
                    <ArrowRightLeft className="h-3.5 w-3.5" /> 멤버로 전환
                  </Button>
                </>
              )}
              <Button variant="ghost" className="w-full text-destructive" size="sm" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Button className="w-full bg-foreground text-background" size="sm" onClick={() => { setMobileOpen(false); openAuth("login"); }}>로그인</Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
