import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { sampleBooks } from "@/data/mockData";
import AccountSidebar from "@/components/AccountSidebar";

const mockPurchases = [
  {
    id: "ORD-20260315-001",
    bookId: "1",
    date: "2026.03.15 14:32",
    status: "confirmed" as const,
    price: 19000,
    hasReview: false,
  },
  {
    id: "ORD-20260310-002",
    bookId: "3",
    date: "2026.03.10 09:15",
    status: "confirmed" as const,
    price: 39000,
    hasReview: true,
  },
  {
    id: "ORD-20260301-003",
    bookId: "5",
    date: "2026.03.01 18:44",
    status: "confirmed" as const,
    price: 25000,
    hasReview: false,
  },
];

type StatusType = "confirmed" | "cancelled";

const statusConfig: Record<StatusType, { label: string; icon: typeof CheckCircle2; color: string }> = {
  confirmed: { label: "구매 확정", icon: CheckCircle2, color: "text-emerald-500" },
  cancelled: { label: "주문 취소", icon: AlertCircle, color: "text-destructive" },
};

const PurchaseHistory = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "confirmed" | "cancelled">("all");

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const filtered = filter === "all"
    ? mockPurchases
    : mockPurchases.filter((p) => p.status === filter);

  const confirmedCount = mockPurchases.filter((p) => p.status === "confirmed").length;
  const reviewableCount = mockPurchases.filter((p) => p.status === "confirmed" && !p.hasReview).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-6 tablet:py-10">
          <div className="flex flex-col desktop:flex-row gap-0 desktop:gap-10 max-w-5xl mx-auto">
            <AccountSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold mb-4 desktop:hidden">계정 설정</h1>
              <h2 className="hidden desktop:block text-lg font-bold mb-6">구매 내역</h2>

              {/* Status Summary */}
              <div className="grid grid-cols-3 gap-2 tablet:gap-3 mb-5 tablet:mb-6">
                <div className="rounded-lg bg-secondary/50 p-3 tablet:p-4 text-center">
                  <CheckCircle2 className="h-4 w-4 tablet:h-5 tablet:w-5 mx-auto mb-1.5 text-emerald-500" />
                  <p className="text-[10px] tablet:text-xs text-muted-foreground">구매 확정</p>
                  <p className="text-xl tablet:text-2xl font-black mt-0.5">{confirmedCount}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 tablet:p-4 text-center">
                  <Star className="h-4 w-4 tablet:h-5 tablet:w-5 mx-auto mb-1.5 text-star" />
                  <p className="text-[10px] tablet:text-xs text-muted-foreground">작성 가능 리뷰</p>
                  <p className="text-xl tablet:text-2xl font-black mt-0.5">{reviewableCount}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 tablet:p-4 text-center">
                  <AlertCircle className="h-4 w-4 tablet:h-5 tablet:w-5 mx-auto mb-1.5 text-destructive" />
                  <p className="text-[10px] tablet:text-xs text-muted-foreground">주문 취소</p>
                  <p className="text-xl tablet:text-2xl font-black mt-0.5">0</p>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2 mb-5">
                {([
                  { key: "all", label: "전체" },
                  { key: "confirmed", label: "구매 확정" },
                  { key: "cancelled", label: "주문 취소" },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                      filter === tab.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Purchase List */}
              <div className="space-y-3">
                {filtered.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">해당 내역이 없습니다.</p>
                  </div>
                ) : (
                  filtered.map((purchase) => {
                    const book = sampleBooks.find((b) => b.id === purchase.bookId);
                    if (!book) return null;
                    const config = statusConfig[purchase.status];
                    const StatusIcon = config.icon;

                    return (
                      <div key={purchase.id} className="py-4 border-b border-border last:border-0">
                        {/* Status & Date */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <StatusIcon className={`h-4 w-4 ${config.color}`} />
                            <span className="text-xs font-semibold">{config.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{purchase.date}</span>
                        </div>

                        {/* Book info */}
                        <div className="flex gap-3 tablet:gap-4">
                          <Link to={`/book/${book.id}`} className="shrink-0">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="h-20 w-28 tablet:h-24 tablet:w-32 rounded-lg object-cover bg-secondary"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">#{purchase.id}</p>
                            <Link to={`/book/${book.id}`} className="hover:underline">
                              <p className="text-sm font-bold leading-snug line-clamp-2">{book.title}</p>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                            <p className="text-sm font-black mt-1.5">{purchase.price.toLocaleString()}원</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-full h-8 gap-1"
                            onClick={() => navigate(`/reader/${book.id}`)}
                          >
                            바로 읽기
                          </Button>

                          {purchase.status === "confirmed" && !purchase.hasReview && (
                            <Button
                              size="sm"
                              className="text-xs rounded-full h-8 gap-1"
                              onClick={() => navigate(`/book/${book.id}`)}
                            >
                              <Star className="h-3 w-3" />
                              후기 남기러 가기
                            </Button>
                          )}

                          {purchase.hasReview && (
                            <span className="text-xs text-muted-foreground">리뷰 작성 완료</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PurchaseHistory;
