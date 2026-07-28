import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronDown, Search, HelpCircle, MessageSquare, BookOpenCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supportMenu = [
  { label: "자주 묻는 질문", path: "/faq", icon: HelpCircle },
  { label: "1:1 문의하기", path: "/contact", icon: MessageSquare },
  { label: "작가 등록 가이드", path: "/author-guide", icon: BookOpenCheck },
];

const faqCategories = [
  { id: "all", label: "전체" },
  { id: "purchase", label: "구매/결제" },
  { id: "refund", label: "환불/취소" },
  { id: "reader", label: "전자책 열람" },
  { id: "account", label: "계정/회원" },
  { id: "seller", label: "판매/정산" },
];

const faqData = [
  {
    id: 1, category: "purchase",
    question: "전자책은 어떻게 구매하나요?",
    answer: "스토어에서 원하는 전자책을 선택한 후 '구매하기' 버튼을 눌러주세요. 카카오페이, 신용카드 등 다양한 결제 수단을 지원합니다. 결제가 완료되면 내서재에서 바로 열람할 수 있습니다.",
  },
  {
    id: 2, category: "purchase",
    question: "결제 수단은 어떤 것이 있나요?",
    answer: "현재 카카오페이, 신용카드, 체크카드, 무통장 입금을 지원하고 있습니다. 추후 더 다양한 결제 수단이 추가될 예정입니다.",
  },
  {
    id: 3, category: "refund",
    question: "환불은 어떻게 하나요?",
    answer: "구매 후 7일 이내, 전자책을 열람하지 않은 경우에 한해 전액 환불이 가능합니다. 내 정보 > 구매 내역에서 환불 요청을 하시거나, 1:1 문의를 통해 요청해주세요.",
  },
  {
    id: 4, category: "refund",
    question: "부분 환불도 가능한가요?",
    answer: "전자책은 디지털 콘텐츠 특성상 부분 환불은 지원되지 않습니다. 전체 환불만 가능하며, 환불 조건(구매 후 7일 이내, 미열람)을 충족해야 합니다.",
  },
  {
    id: 5, category: "reader",
    question: "전자책은 어디서 읽을 수 있나요?",
    answer: "구매한 전자책은 웹 브라우저에서 제공되는 웹 뷰어를 통해 읽을 수 있습니다. PC, 태블릿, 모바일 등 다양한 기기에서 접속 가능합니다. 별도의 앱 설치 없이 로그인만 하면 내서재에서 바로 열람하실 수 있어요.",
  },
  {
    id: 6, category: "reader",
    question: "전자책을 다운로드할 수 있나요?",
    answer: "저작권 보호를 위해 전자책 다운로드는 지원하지 않습니다. 웹 뷰어를 통해서만 열람이 가능하며, 구매한 전자책은 계정이 유지되는 한 언제든지 다시 읽을 수 있습니다.",
  },
  {
    id: 7, category: "account",
    question: "회원가입은 어떻게 하나요?",
    answer: "카카오 계정으로 간편하게 가입할 수 있습니다. 별도의 이메일 인증이나 복잡한 절차 없이, 카카오 로그인 버튼을 누르면 자동으로 회원가입이 완료됩니다.",
  },
  {
    id: 8, category: "account",
    question: "비밀번호를 잊어버렸어요.",
    answer: "디하북스는 카카오 로그인만 지원하므로 별도의 비밀번호가 없습니다. 카카오 계정의 비밀번호를 분실하셨다면 카카오 고객센터를 통해 비밀번호를 재설정해주세요.",
  },
  {
    id: 9, category: "seller",
    question: "전자책을 판매하고 싶은데 어떻게 하나요?",
    answer: "내 정보 > 전문가 전환을 통해 판매자 등록을 할 수 있습니다. 판매자 등록 후 전자책을 업로드하면 심사를 거쳐 스토어에 등록됩니다.",
  },
  {
    id: 10, category: "seller",
    question: "정산은 어떻게 이루어지나요?",
    answer: "매월 1일~말일까지의 판매 금액이 익월 15일에 등록된 계좌로 정산됩니다. 수수료는 판매가의 20%이며, 정산 내역은 전문가 대시보드에서 확인할 수 있습니다.",
  },
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const filtered = faqData.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container px-4 py-6 tablet:py-10 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">고객센터</h1>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden desktop:block w-52 shrink-0">
              <div className="sticky top-24 rounded-2xl border border-border bg-background p-5 space-y-1">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                  Support
                </h3>
                <ul className="space-y-1">
                  {supportMenu.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            active
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary text-foreground"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile support tabs */}
              <div className="desktop:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-4 px-4">
                {supportMenu.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="궁금한 내용을 검색해보세요"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide -mx-4 px-4 desktop:mx-0 desktop:px-0">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <div className="rounded-xl border border-border bg-background p-10 text-center">
                    <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
                  </div>
                ) : (
                  filtered.map((faq) => {
                    const isOpen = openId === faq.id;
                    const catLabel = faqCategories.find((c) => c.id === faq.category)?.label;
                    return (
                      <div key={faq.id} className="rounded-xl border border-border bg-background overflow-hidden">
                        <button
                          onClick={() => setOpenId(isOpen ? null : faq.id)}
                          className="w-full flex items-center gap-3 p-4 tablet:p-5 text-left hover:bg-secondary/40 transition-colors"
                        >
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">Q</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] text-muted-foreground">{catLabel}</span>
                            <p className="text-sm font-semibold leading-snug">{faq.question}</p>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="px-4 tablet:px-5 pb-4 tablet:pb-5">
                            <div className="flex gap-3 pt-3 border-t border-border">
                              <span className="text-xs font-bold text-foreground bg-secondary px-2 py-0.5 rounded-full shrink-0 h-fit">A</span>
                              <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Contact CTA */}
              <div className="mt-8 rounded-xl border border-border bg-background p-5 tablet:p-6 text-center">
                <p className="text-sm font-bold mb-1">원하는 답변을 찾지 못하셨나요?</p>
                <p className="text-xs text-muted-foreground mb-3">1:1 문의를 통해 궁금한 점을 물어보세요.</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  1:1 문의하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
