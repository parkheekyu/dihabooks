import { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import AccountSidebar from "@/components/AccountSidebar";

/** 멤버와 작가는 궁금한 게 다르므로 카테고리와 문항을 역할별로 나눈다. */
const memberCategories = [
  { id: "all", label: "전체" },
  { id: "purchase", label: "구매/결제" },
  { id: "refund", label: "환불/취소" },
  { id: "reader", label: "전자책 열람" },
  { id: "account", label: "계정/회원" },
];

const expertCategories = [
  { id: "all", label: "전체" },
  { id: "register", label: "등록/심사" },
  { id: "settlement", label: "정산/수수료" },
  { id: "copyright", label: "저작권" },
  { id: "account", label: "계정/회원" },
];

type Audience = "member" | "expert" | "both";

const faqData: {
  id: number; category: string; audience: Audience; question: string; answer: string;
}[] = [
  /* ── 멤버 ── */
  {
    id: 1, category: "purchase", audience: "member",
    question: "전자책은 어떻게 구매하나요?",
    answer: "스토어에서 원하는 전자책을 선택한 후 '구매하기' 버튼을 눌러주세요. 카카오페이, 신용카드 등 다양한 결제 수단을 지원합니다. 결제가 완료되면 내서재에서 바로 열람할 수 있습니다.",
  },
  {
    id: 2, category: "purchase", audience: "member",
    question: "결제 수단은 어떤 것이 있나요?",
    answer: "현재 카카오페이, 신용카드, 체크카드, 무통장 입금을 지원하고 있습니다. 추후 더 다양한 결제 수단이 추가될 예정입니다.",
  },
  {
    id: 3, category: "refund", audience: "member",
    question: "환불은 어떻게 하나요?",
    answer: "구매 후 7일 이내, 전자책을 열람하지 않은 경우에 한해 전액 환불이 가능합니다. 마이페이지 > 구매 내역에서 환불 요청을 하시거나, 1:1 문의를 통해 요청해주세요.",
  },
  {
    id: 4, category: "refund", audience: "member",
    question: "부분 환불도 가능한가요?",
    answer: "전자책은 디지털 콘텐츠 특성상 부분 환불은 지원되지 않습니다. 전체 환불만 가능하며, 환불 조건(구매 후 7일 이내, 미열람)을 충족해야 합니다.",
  },
  {
    id: 5, category: "reader", audience: "member",
    question: "전자책은 어디서 읽을 수 있나요?",
    answer: "구매한 전자책은 웹 브라우저에서 제공되는 웹 뷰어를 통해 읽을 수 있습니다. PC, 태블릿, 모바일 등 다양한 기기에서 접속 가능합니다. 별도의 앱 설치 없이 로그인만 하면 내서재에서 바로 열람하실 수 있어요.",
  },
  {
    id: 6, category: "reader", audience: "member",
    question: "전자책을 다운로드할 수 있나요?",
    answer: "저작권 보호를 위해 전자책 다운로드는 지원하지 않습니다. 웹 뷰어를 통해서만 열람이 가능하며, 구매한 전자책은 계정이 유지되는 한 언제든지 다시 읽을 수 있습니다.",
  },
  {
    id: 11, category: "reader", audience: "member",
    question: "뷰어에서 글자 크기를 바꿀 수 있나요?",
    answer: "뷰어 우측 상단의 + / - 버튼으로 본문 글자 크기를 70%에서 200%까지 조절할 수 있습니다. 모바일에서도 동일하게 지원합니다.",
  },
  {
    id: 12, category: "purchase", audience: "member",
    question: "구매한 작가에게 직접 문의할 수 있나요?",
    answer: "마이페이지 > 1:1 문의에서 구매하신 전자책의 작가에게 직접 문의할 수 있습니다. 구매 이력이 있는 전자책의 작가에게만 문의가 가능합니다.",
  },

  /* ── 공통 ── */
  {
    id: 7, category: "account", audience: "both",
    question: "회원가입은 어떻게 하나요?",
    answer: "카카오 계정으로 간편하게 가입할 수 있습니다. 별도의 이메일 인증이나 복잡한 절차 없이, 카카오 로그인 버튼을 누르면 자동으로 회원가입이 완료됩니다.",
  },
  {
    id: 8, category: "account", audience: "both",
    question: "비밀번호를 잊어버렸어요.",
    answer: "디하북스는 카카오 로그인만 지원하므로 별도의 비밀번호가 없습니다. 카카오 계정의 비밀번호를 분실하셨다면 카카오 고객센터를 통해 비밀번호를 재설정해주세요.",
  },

  /* ── 작가 ── */
  {
    id: 20, category: "register", audience: "expert",
    question: "전자책 등록은 어떻게 하나요?",
    answer: "작가 대시보드 > 전자책 등록에서 원고와 표지, 상세 정보를 입력해 제출하시면 됩니다. 제출 후 심사를 거쳐 스토어에 노출됩니다.",
  },
  {
    id: 21, category: "register", audience: "expert",
    question: "심사는 얼마나 걸리나요?",
    answer: "영업일 기준 3~5일이 소요됩니다. 심사 결과는 등록하신 이메일과 작가 대시보드 알림으로 안내드립니다. 보완이 필요한 경우 사유와 함께 반려됩니다.",
  },
  {
    id: 22, category: "register", audience: "expert",
    question: "등록한 전자책의 내용이나 가격을 수정할 수 있나요?",
    answer: "작가 대시보드 > 전자책 수정에서 언제든 변경할 수 있습니다. 다만 본문과 표지 수정은 재심사 대상이며, 가격 변경은 이미 결제된 주문에는 소급되지 않습니다.",
  },
  {
    id: 23, category: "settlement", audience: "expert",
    question: "정산은 어떻게 이루어지나요?",
    answer: "매월 1일~말일까지의 판매 금액이 익월 15일에 등록된 계좌로 정산됩니다. 정산 내역은 작가 대시보드에서 확인할 수 있습니다.",
  },
  {
    id: 24, category: "settlement", audience: "expert",
    question: "수수료는 얼마인가요?",
    answer: "판매가의 20%가 플랫폼 수수료로 부과되며, 결제 대행 수수료가 포함된 금액입니다. 별도로 청구되는 비용은 없습니다.",
  },
  {
    id: 25, category: "settlement", audience: "expert",
    question: "구매자가 환불하면 정산은 어떻게 되나요?",
    answer: "환불이 확정된 주문은 해당 월 정산 금액에서 차감됩니다. 이미 정산이 완료된 건이라면 다음 달 정산에서 조정됩니다.",
  },
  {
    id: 26, category: "settlement", audience: "expert",
    question: "정산 계좌는 어디서 변경하나요?",
    answer: "마이페이지 > 작가 프로필 설정에서 변경할 수 있습니다. 예금주가 작가 본인 명의와 일치해야 정산이 정상 처리됩니다.",
  },
  {
    id: 27, category: "copyright", audience: "expert",
    question: "제 전자책의 저작권은 누구에게 있나요?",
    answer: "저작권은 전적으로 작가에게 있습니다. 디하북스는 판매와 열람에 필요한 범위에서만 콘텐츠를 사용합니다.",
  },
  {
    id: 28, category: "copyright", audience: "expert",
    question: "무단 복제가 의심되면 어떻게 하나요?",
    answer: "마이페이지 > 1:1 문의로 접수해주시면 고객센터에서 확인 후 조치합니다. 전자책은 다운로드가 차단되어 있고 열람 화면에 구매자 정보 워터마크가 표시됩니다.",
  },
  {
    id: 29, category: "register", audience: "expert",
    question: "판매를 중단하고 싶습니다.",
    answer: "작가 대시보드에서 판매 중지로 전환하면 신규 판매가 중단됩니다. 이미 구매한 독자는 계속 열람할 수 있습니다.",
  },
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { role } = useAuth();

  const isExpert = role === "expert";
  const faqCategories = isExpert ? expertCategories : memberCategories;
  const audienceFaqs = faqData.filter(
    (faq) => faq.audience === "both" || faq.audience === (isExpert ? "expert" : "member")
  );

  // 역할이 바뀌면 이전 역할에만 있던 카테고리가 남아 목록이 비어버린다.
  useEffect(() => {
    setActiveCategory("all");
    setOpenId(null);
  }, [isExpert]);

  const filtered = audienceFaqs.filter((faq) => {
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
      <main className="flex-1">
        <div className="container px-4 py-6 tablet:py-10">
          <div className="flex flex-col desktop:flex-row gap-0 desktop:gap-10 max-w-5xl mx-auto">
            <AccountSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold mb-4 desktop:hidden">마이페이지</h1>
              <h2 className="hidden desktop:block text-lg font-bold mb-1">자주 묻는 질문</h2>
              <p className="text-xs text-muted-foreground mb-5 tablet:mb-6">
                {isExpert
                  ? "작가 활동에 자주 나오는 질문을 모았습니다."
                  : "구매와 열람에 대해 자주 나오는 질문을 모았습니다."}
              </p>

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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
