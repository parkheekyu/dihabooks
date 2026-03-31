import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, CreditCard, Smartphone, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

interface OrderItem {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
}

const mockOrderItems: OrderItem[] = [
  { id: "1", title: "유튜브 알고리즘 마스터: 구독자 0에서 10만까지", author: "크리에이터 김", price: 19000, image: hero1 },
  { id: "3", title: "ChatGPT와 자동화로 월 300만원 파이프라인 구축", author: "AI 전문가", price: 39000, image: hero3 },
  { id: "5", title: "퇴사 후 한 달 만에 월 수익 300만원 달성한 비결", author: "프리랜서 후기", price: 25000, image: hero2 },
];

const paymentMethods = [
  { id: "card", label: "신용/체크카드", icon: CreditCard },
  { id: "kakao", label: "카카오페이", icon: Smartphone },
  { id: "bank", label: "무통장입금", icon: Building2 },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeRefund, setAgreeRefund] = useState(false);
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  

  const items = mockOrderItems;
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const discount = 0;
  const total = subtotal - discount;

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeRefund(checked);
  };

  const allAgreed = agreeTerms && agreePrivacy && agreeRefund;

  const handlePayment = () => {
    if (!allAgreed) return;
    setIsProcessing(true);
    setTimeout(() => {
      navigate("/order-complete", { state: { orderId: "ORD-20260331-001", total, itemCount: items.length } });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-4 tablet:py-8 pb-32 tablet:pb-8">
        {/* Title */}
        <div className="flex items-center gap-2 mb-5 tablet:mb-6">
          <Link to="/cart" className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg tablet:text-2xl font-bold">주문서</h1>
        </div>

        <div className="flex flex-col desktop:flex-row gap-5 desktop:gap-8 max-w-5xl mx-auto">
          {/* Left: Order details */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Buyer info */}
            <section className="rounded-xl border border-border p-4 tablet:p-5">
              <h2 className="text-sm font-bold mb-3">구매자 정보</h2>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">이름</Label>
                  <Input value={user?.name || ""} disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">이메일</Label>
                  <Input value={user?.email || ""} disabled className="mt-1" />
                  <p className="text-[10px] text-muted-foreground mt-1">구매 완료 후 이 이메일로 영수증이 발송됩니다.</p>
                </div>
              </div>
            </section>

            {/* Order items */}
            <section className="rounded-xl border border-border p-4 tablet:p-5">
              <h2 className="text-sm font-bold mb-3">주문 상품 <span className="text-muted-foreground font-normal">({items.length})</span></h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-[72px] tablet:w-16 tablet:h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-medium line-clamp-2 leading-snug">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.author}</p>
                      <p className="text-sm font-bold mt-1">{item.price.toLocaleString()}원</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Coupon */}
            <section className="rounded-xl border border-border p-4 tablet:p-5">
              <h2 className="text-sm font-bold mb-3">쿠폰 / 할인</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="쿠폰 코드를 입력하세요"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="default" className="shrink-0 rounded-lg text-sm">
                  적용
                </Button>
              </div>
            </section>

            {/* Payment method */}
            <section className="rounded-xl border border-border p-4 tablet:p-5">
              <h2 className="text-sm font-bold mb-3">결제 수단</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 tablet:grid-cols-3 gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <RadioGroupItem value={method.id} className="sr-only" />
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm ${isSelected ? "font-semibold" : ""}`}>{method.label}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
                    </label>
                  );
                })}
              </RadioGroup>
            </section>

            {/* Agreements */}
            <section className="rounded-xl border border-border p-4 tablet:p-5">
              <h2 className="text-sm font-bold mb-3">약관 동의</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                  <Checkbox
                    id="agree-all"
                    checked={agreeAll}
                    onCheckedChange={(checked) => handleAgreeAll(checked as boolean)}
                  />
                  <label htmlFor="agree-all" className="text-sm font-semibold cursor-pointer">전체 동의</label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="agree-terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => { setAgreeTerms(checked as boolean); if (!checked) setAgreeAll(false); }}
                    />
                    <label htmlFor="agree-terms" className="text-xs cursor-pointer">[필수] 이용약관 동의</label>
                  </div>
                  <Link to="/terms" className="text-[10px] text-muted-foreground underline">보기</Link>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="agree-privacy"
                      checked={agreePrivacy}
                      onCheckedChange={(checked) => { setAgreePrivacy(checked as boolean); if (!checked) setAgreeAll(false); }}
                    />
                    <label htmlFor="agree-privacy" className="text-xs cursor-pointer">[필수] 개인정보 수집·이용 동의</label>
                  </div>
                  <Link to="/privacy" className="text-[10px] text-muted-foreground underline">보기</Link>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="agree-refund"
                      checked={agreeRefund}
                      onCheckedChange={(checked) => { setAgreeRefund(checked as boolean); if (!checked) setAgreeAll(false); }}
                    />
                    <label htmlFor="agree-refund" className="text-xs cursor-pointer">[필수] 디지털 콘텐츠 환불 정책 동의</label>
                  </div>
                  <Link to="/refund" className="text-[10px] text-muted-foreground underline">보기</Link>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Payment summary (desktop) */}
          <div className="hidden desktop:block w-80 shrink-0">
            <div className="rounded-xl border border-border p-5 sticky top-24">
              <h3 className="font-bold text-sm mb-4">결제 요약</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span>{subtotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">할인</span>
                  <span className="text-green-600">-{discount.toLocaleString()}원</span>
                </div>
                <div className="h-px bg-border my-3" />
                <div className="flex justify-between font-bold text-base">
                  <span>총 결제 금액</span>
                  <span className="text-primary text-lg">{total.toLocaleString()}원</span>
                </div>
              </div>

              <Button
                className="w-full mt-5 rounded-lg bg-foreground text-background hover:bg-foreground/90"
                size="lg"
                disabled={!allAgreed || isProcessing}
                onClick={handlePayment}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    처리 중...
                  </span>
                ) : (
                  `${total.toLocaleString()}원 결제하기`
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3" />
                안전한 결제가 보장됩니다
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 desktop:hidden border-t border-border bg-background p-4 safe-bottom z-40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">총 {items.length}건</span>
          <span className="font-bold text-primary">{total.toLocaleString()}원</span>
        </div>
        <Button
          className="w-full rounded-lg bg-foreground text-background hover:bg-foreground/90"
          size="lg"
          disabled={!allAgreed || isProcessing}
          onClick={handlePayment}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              처리 중...
            </span>
          ) : (
            `${total.toLocaleString()}원 결제하기`
          )}
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
