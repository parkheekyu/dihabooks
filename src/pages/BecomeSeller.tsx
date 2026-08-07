import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, BookOpen, DollarSign, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const stats = [
  { label: "상위 10% 월 평균 수익", value: "320만 원" },
  { label: "누적 회원 수", value: "1.2만 명" },
  { label: "등록 후 첫 판매까지", value: "2주 이내" },
];

const sellers = [
  {
    name: "노마드킹",
    image: hero1,
    category: "유튜브 마케팅",
    stat: "누적 판매 수익 3,200만 원",
    detail: "재구매율 75%",
  },
  {
    name: "디지털노마드",
    image: hero2,
    category: "제휴마케팅",
    stat: "최근 6개월 판매 수익 1,800만 원",
    detail: "기업 회원 전문 작가",
  },
  {
    name: "AI마스터",
    image: hero3,
    category: "AI/자동화",
    stat: "꾸준한 소통으로 누적 수익 2,500만 원",
    detail: "월 50건 이상 판매",
  },
];

const benefits = [
  {
    icon: Users,
    title: "1.2만 회원과의\n다양한 거래 기회",
    desc: "디하북스의 검증된 회원들에게 전자책을 판매할 수 있어요.",
  },
  {
    icon: DollarSign,
    title: "투명한 정산과\n안전한 거래 시스템",
    desc: "작가의 안정적인 수익 활동을 위해 안전결제 시스템을 제공합니다.",
  },
  {
    icon: Zap,
    title: "복잡한 준비 없이\n간편하게 판매 시작",
    desc: "전문 지식이 있다면 누구나 작가로 활동할 수 있어요. 지금 바로 시작하세요.",
  },
];

const steps = [
  { step: "Step 1", title: "카카오 로그인으로\n작가 등록", desc: "간편하게 작가로 등록하세요." },
  { step: "Step 2", title: "판매하고자 하는\n전자책을 등록", desc: "PDF 전자책을 업로드하고 상품 정보를 입력하세요." },
  { step: "Step 3", title: "회원들이 구매하면\n수익이 발생", desc: "별도 마케팅 없이도 플랫폼 내에서 노출됩니다." },
  { step: "Step 4", title: "수익금은\n빠르게 정산", desc: "구매 확정 후 2일 이내 수익금이 정산됩니다." },
];

const BecomeSeller = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative py-20 tablet:py-32 text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl tablet:text-5xl font-black leading-tight">
            당신의 전문 지식이
            <br />
            <span className="text-primary">수익</span>이 됩니다
          </h1>
          <p className="mt-4 text-muted-foreground tablet:text-lg">
            전자책을 찾고 있는 회원들이 기다리고 있어요
          </p>
          <Link to="/signup">
            <Button size="lg" className="mt-8 rounded-full px-10 text-base">
              작가 등록하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container px-4 py-10 tablet:py-14">
          <div className="grid grid-cols-1 tablet:grid-cols-3 divide-y tablet:divide-y-0 tablet:divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="text-center py-6 tablet:py-0">
                <p className="text-xs tablet:text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl tablet:text-3xl font-black mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Showcase */}
      <section className="container px-4 py-16 tablet:py-24">
        <h2 className="text-2xl tablet:text-3xl font-black text-center leading-tight">
          다양한 분야에서
          <br />
          나만의 전자책을 판매해 보세요
        </h2>
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 mt-10 tablet:mt-14">
          {sellers.map((seller) => (
            <div key={seller.name} className="rounded-xl border border-border bg-background overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={seller.image}
                  alt={seller.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-muted-foreground">{seller.category}</p>
                <p className="font-bold mt-1">{seller.name}</p>
                <p className="text-sm text-primary font-semibold mt-2">{seller.stat}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{seller.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/signup">
            <Button size="lg" className="rounded-full px-10">
              작가 등록하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-secondary/30 py-16 tablet:py-24">
        <div className="container px-4">
          <h2 className="text-2xl tablet:text-3xl font-black text-center leading-tight">
            작가의 더 나은 성장을 위해
            <br />
            디하북스가 함께 하고 있어요
          </h2>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 mt-10 tablet:mt-14">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-xl border border-border bg-background p-6 tablet:p-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <b.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg whitespace-pre-line leading-snug">{b.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="container px-4 py-16 tablet:py-24">
        <h2 className="text-2xl tablet:text-3xl font-black text-center">
          작가, 이렇게 시작하면 돼요
        </h2>
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6 mt-10 tablet:mt-14">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              <div className="rounded-xl border border-border bg-background p-6">
                <span className="text-xs font-bold text-primary">{s.step}</span>
                <h3 className="font-bold mt-2 whitespace-pre-line leading-snug">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden desktop:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="h-5 w-5 text-muted-foreground/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary text-primary-foreground py-16 tablet:py-20 text-center px-4">
        <h2 className="text-2xl tablet:text-3xl font-black">
          이제, 작가 등록을 시작해 볼까요?
        </h2>
        <p className="text-sm tablet:text-base mt-3 opacity-80">
          전문 지식을 전자책으로 만들어 수익을 창출하세요
        </p>
        <Link to="/signup">
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 rounded-full px-10 text-base font-bold"
          >
            작가 등록하기
          </Button>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default BecomeSeller;
