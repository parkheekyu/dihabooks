import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

interface CartItem {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
}

const initialCart: CartItem[] = [
  { id: "1", title: "유튜브 알고리즘 마스터: 구독자 0에서 10만까지", author: "크리에이터 김", price: 19000, image: hero1 },
  { id: "3", title: "ChatGPT와 자동화로 월 300만원 파이프라인 구축", author: "AI 전문가", price: 39000, image: hero3 },
  { id: "5", title: "퇴사 후 한 달 만에 월 수익 300만원 달성한 비결", author: "프리랜서 후기", price: 25000, image: hero2 },
];

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>(initialCart);

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-4 tablet:py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/store" className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl tablet:text-2xl font-bold">장바구니</h1>
          <span className="text-sm text-muted-foreground">({items.length})</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium">장바구니가 비어있습니다</p>
            <Link to="/store">
              <Button variant="outline" className="mt-4 rounded-full gap-2">
                스토어 둘러보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col desktop:flex-row gap-6">
            {/* Items */}
            <div className="flex-1 space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 tablet:gap-4 rounded-xl border border-border bg-background p-3 tablet:p-4">
                  <img src={item.image} alt="" className="w-16 h-22 tablet:w-20 tablet:h-28 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.author}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm tablet:text-base font-bold text-primary">₩{item.price.toLocaleString()}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="desktop:w-80 shrink-0">
              <div className="rounded-xl border border-border bg-background p-5 sticky top-24">
                <h3 className="font-bold text-sm mb-4">결제 요약</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">상품 금액</span>
                    <span>₩{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">할인</span>
                    <span className="text-green-600">-₩0</span>
                  </div>
                  <div className="h-px bg-border my-3" />
                  <div className="flex justify-between font-bold">
                    <span>총 결제 금액</span>
                    <span className="text-primary text-lg">₩{total.toLocaleString()}</span>
                  </div>
                </div>
                <Button className="w-full rounded-full" size="lg">
                  결제하기
                </Button>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  결제 시 이용약관에 동의하는 것으로 간주됩니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile fixed bottom bar */}
        {items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 desktop:hidden border-t border-border bg-background p-4 safe-bottom z-40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">총 {items.length}건</span>
              <span className="font-bold text-primary">₩{total.toLocaleString()}</span>
            </div>
            <Button className="w-full rounded-full" size="lg">
              결제하기
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
