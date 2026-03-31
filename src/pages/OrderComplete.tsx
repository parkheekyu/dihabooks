import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, BookOpen, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OrderComplete = () => {
  const location = useLocation();
  const state = location.state as { orderId?: string; total?: number; itemCount?: number } | null;

  

  const orderId = state?.orderId || "ORD-XXXXXXXX-000";
  const total = state?.total || 0;
  const itemCount = state?.itemCount || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-10 tablet:py-16">
        <div className="w-full max-w-md text-center">
          {/* Success icon */}
          <div className="mx-auto w-16 h-16 tablet:w-20 tablet:h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
            <CheckCircle2 className="h-8 w-8 tablet:h-10 tablet:w-10 text-green-600" />
          </div>

          <h1 className="text-xl tablet:text-2xl font-bold mb-2">결제가 완료되었습니다!</h1>
          <p className="text-sm text-muted-foreground mb-6">
            구매하신 전자책은 내 서재에서 바로 읽으실 수 있습니다.
          </p>

          {/* Order summary card */}
          <div className="rounded-xl border border-border p-4 tablet:p-5 text-left mb-6">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문번호</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문 상품</span>
                <span className="font-medium">{itemCount}건</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between font-bold">
                <span>결제 금액</span>
                <span className="text-primary">{total.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <Link to="/library">
              <Button className="w-full rounded-lg gap-2" size="lg">
                <BookOpen className="h-4 w-4" />
                내 서재로 가기
              </Button>
            </Link>
            <Link to="/store">
              <Button variant="outline" className="w-full rounded-lg gap-2" size="lg">
                <ShoppingBag className="h-4 w-4" />
                스토어 계속 둘러보기
              </Button>
            </Link>
          </div>

          <Link to="/purchases" className="inline-block mt-4 text-xs text-muted-foreground underline hover:text-foreground transition-colors">
            구매 내역 보기
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderComplete;
