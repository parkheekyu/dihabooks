import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, ArrowLeft, Share2, BookOpen, Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const tableOfContents = [
  {
    chapter: "프롤로그",
    title: "왜 지금 이 기술이 필요한가",
    subtopics: [
      { title: "변화하는 디지털 경제 환경", preview: true },
      { title: "이 책을 읽어야 하는 이유", preview: false },
      { title: "성공 사례 미리보기", preview: true },
    ],
  },
  {
    chapter: "Chapter 1",
    title: "마인드셋과 도구 준비하기",
    subtopics: [
      { title: "성장형 사고방식 만들기", preview: true },
      { title: "필수 도구 세팅 가이드", preview: false },
      { title: "효율적인 워크플로우 구축", preview: false },
    ],
  },
  {
    chapter: "Chapter 2",
    title: "0원에서 100만원을 만드는 핵심 알고리즘",
    subtopics: [
      { title: "수익화 구조 이해하기", preview: false },
      { title: "트래픽을 수익으로 전환하는 법", preview: false },
      { title: "실전 A/B 테스트 전략", preview: false },
      { title: "자동 수익 파이프라인 설계", preview: false },
    ],
  },
  {
    chapter: "Chapter 3",
    title: "지속 가능한 수익을 위한 자동화 시스템",
    subtopics: [
      { title: "자동화 툴 비교 분석", preview: false },
      { title: "노코드로 시스템 구축하기", preview: false },
      { title: "유지보수 최소화 전략", preview: false },
    ],
  },
  {
    chapter: "에필로그",
    title: "당신의 항해를 응원하며",
    subtopics: [
      { title: "앞으로의 로드맵", preview: false },
      { title: "커뮤니티 활용법", preview: false },
    ],
  },
];

const bookReviews = [
  { name: "노마드팀", rating: 5, date: "2026.03.15", content: "진짜 실전에서 바로 쓸 수 있는 꿀팁만 모아놓셨네요. 문의 전혀 아깝지 않습니다! 이 가격에 이 정도 퀄리티면 정말 대만족이에요." },
  { name: "디지털리버", rating: 5, date: "2026.03.10", content: "내용이 아주 알찹니다. 특히 자동화 시스템 구축 부분이 인상 깊었어요. 실제로 적용해보니 효과가 바로 나타나더라구요." },
  { name: "성장하는개발자", rating: 5, date: "2026.03.08", content: "비전공자인데도 이해하기 쉽게 설명되어 있어서 좋았습니다. 강추입니다. 주변에도 많이 추천하고 있어요." },
  { name: "마케터박", rating: 5, date: "2026.03.05", content: "마케팅 실무에서 바로 써먹을 수 있는 내용이 가득합니다. 특히 채널별 전략 부분이 정말 유용했어요." },
  { name: "프리랜서후기", rating: 4, date: "2026.03.02", content: "전체적으로 만족스러운 내용이었습니다. 다만 좀 더 심화 내용이 있었으면 하는 아쉬움이 있네요." },
  { name: "초보창업자", rating: 5, date: "2026.02.28", content: "창업 준비하면서 읽었는데 정말 도움이 많이 됐어요. 실전 경험에서 나온 팁들이라 신뢰가 갑니다." },
  { name: "직장인탈출", rating: 5, date: "2026.02.25", content: "퇴사 준비하면서 이 책 덕분에 자신감이 생겼습니다. 단계별로 따라하기 쉽게 설명되어 있어요." },
  { name: "수익화마스터", rating: 5, date: "2026.02.20", content: "수익화에 대한 체계적인 로드맵을 제시해줘서 좋았습니다. 이미 첫 수익을 만들었어요!" },
  { name: "콘텐츠크리에이터", rating: 4, date: "2026.02.15", content: "콘텐츠 제작 관련 팁이 특히 유용했습니다. 실제 사례가 많아서 이해하기 쉬웠어요." },
  { name: "디지털노마드", rating: 5, date: "2026.02.10", content: "해외에서 원격으로 일하면서 이 책의 방법론을 적용하고 있습니다. 정말 감사합니다." },
  { name: "투잡러", rating: 5, date: "2026.02.05", content: "본업 외에 부수입을 만들고 싶어서 읽었는데, 실행 가능한 방법들이 많아서 좋았습니다." },
];

/* ── Option card with discount support ── */
const OptionCard = ({
  label, description, price, originalPrice, selected, onClick,
}: {
  label: string; description: string; price: number; originalPrice?: number;
  selected: boolean; onClick: () => void;
}) => {
  const discountPercent = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : null;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
        selected ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
      }`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {discountPercent && (
            <span className="text-xs font-bold text-destructive">{discountPercent}% 할인</span>
          )}
          <p className="text-sm font-bold leading-snug">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="text-right shrink-0">
          {originalPrice && (
            <p className="text-xs text-muted-foreground line-through">{originalPrice.toLocaleString()}원</p>
          )}
          <p className="text-sm font-black">{price.toLocaleString()}원</p>
        </div>
      </div>
    </div>
  );
};

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sellerProfile } = useAuth();
  const book = sampleBooks.find((b) => b.id === id) || sampleBooks[0];
  const [isPurchased, setIsPurchased] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState(3);

  // Build purchase options from book data
  const purchaseOptions = [
    {
      label: "전자책 (웹 뷰어)",
      description: "구매 즉시 웹 뷰어로 읽기",
      price: book.price,
      originalPrice: book.originalPrice,
    },
  ];

  const currentOption = purchaseOptions[selectedOption];
  const discount = currentOption.originalPrice
    ? Math.round((1 - currentOption.price / currentOption.originalPrice) * 100)
    : null;

  const handlePurchase = () => setIsPurchased(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-4 tablet:py-6 pb-28 desktop:pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 tablet:mb-6">
          <Link to="/store" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> 뒤로가기
          </Link>
          <button className="ml-auto p-2 text-muted-foreground hover:text-foreground">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* ═══ Hero: Image left + Info sidebar right (desktop) ═══ */}
        <div className="grid grid-cols-1 desktop:grid-cols-[1fr_380px] gap-6 desktop:gap-10 items-start">
          {/* Left: Hero image */}
          <div>
            <div className="rounded-xl tablet:rounded-2xl overflow-hidden aspect-video bg-secondary">
              <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right: Info sidebar (desktop) */}
          <div className="hidden desktop:block">
            <div className="sticky top-24 space-y-5">
              {/* Author & Title */}
              <div>
                <p className="text-sm text-primary font-medium mb-1">{book.author}</p>
                <h1 className="text-2xl font-black leading-tight">{book.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(book.rating) ? "fill-star text-star" : "text-border"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{book.rating}</span>
                  <span className="text-xs text-muted-foreground">구매 {book.reviewCount}명</span>
                </div>
                {book.badge && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-xs font-bold bg-primary/10 text-primary">
                    {book.badge === "BEST" ? "베스트셀러" : book.badge === "NEW" ? "신규" : "인기"}
                  </span>
                )}
              </div>

              {isPurchased ? (
                /* ── Purchased state ── */
                <div className="rounded-2xl border border-border p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold">구매 완료된 전자책입니다</p>
                    <p className="text-xs text-muted-foreground">웹 뷰어에서 바로 읽을 수 있어요</p>
                  </div>
                  <Button
                    className="w-full h-12 rounded-xl text-base font-bold"
                    onClick={() => navigate(`/reader/${book.id}`)}
                  >
                    지금 바로 읽기
                  </Button>
                </div>
              ) : (
                /* ── Purchase card ── */
                <div className="rounded-2xl border border-border p-6 space-y-5">
                  {/* Price */}
                  <div>
                    {discount && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-destructive">{discount}%</span>
                        <span className="text-sm text-muted-foreground line-through">
                          {currentOption.originalPrice?.toLocaleString()}원
                        </span>
                      </div>
                    )}
                    <div className="text-3xl font-black">{currentOption.price.toLocaleString()}원</div>
                  </div>

                  {/* Options */}
                  <div>
                    <p className="text-sm font-bold mb-3">구매 옵션</p>
                    <div className="space-y-2">
                      {purchaseOptions.map((opt, i) => (
                        <OptionCard
                          key={i}
                          label={opt.label}
                          description={opt.description}
                          price={opt.price}
                          originalPrice={opt.originalPrice}
                          selected={selectedOption === i}
                          onClick={() => setSelectedOption(i)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-sm font-bold">상품 금액</span>
                    <span className="text-xl font-black">{currentOption.price.toLocaleString()}원</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-border hover:bg-secondary transition-colors shrink-0">
                      <Heart className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground mt-0.5">{book.reviewCount}</span>
                    </button>
                    <Button className="flex-1 h-12 rounded-xl text-base font-bold" onClick={handlePurchase}>
                      지금 바로 구매하기
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ Mobile: Title + Price below hero ═══ */}
        <div className="desktop:hidden mt-5 space-y-5">
          {/* Title info */}
          <div>
            <p className="text-sm text-primary font-medium mb-1">{book.author}</p>
            <h1 className="text-xl tablet:text-2xl font-black leading-tight">{book.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(book.rating) ? "fill-star text-star" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm font-medium">{book.rating}</span>
              <span className="text-xs text-muted-foreground">구매 {book.reviewCount}명</span>
            </div>
            {book.badge && (
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-xs font-bold bg-primary/10 text-primary">
                {book.badge === "BEST" ? "베스트셀러" : book.badge === "NEW" ? "신규" : "인기"}
              </span>
            )}
          </div>

          {/* Price & Options (mobile) */}
          {!isPurchased && (
            <div className="space-y-4">
              <div>
                {discount && (
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base font-bold text-destructive">{discount}%</span>
                    <span className="text-xs text-muted-foreground line-through">
                      {currentOption.originalPrice?.toLocaleString()}원
                    </span>
                  </div>
                )}
                <div className="text-2xl font-black">{currentOption.price.toLocaleString()}원</div>
              </div>
              <div>
                <p className="text-sm font-bold mb-3">구매 옵션</p>
                <div className="space-y-2">
                  {purchaseOptions.map((opt, i) => (
                    <OptionCard
                      key={i}
                      label={opt.label}
                      description={opt.description}
                      price={opt.price}
                      originalPrice={opt.originalPrice}
                      selected={selectedOption === i}
                      onClick={() => setSelectedOption(i)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-sm font-bold">상품 금액</span>
                <span className="text-xl font-black">{currentOption.price.toLocaleString()}원</span>
              </div>
            </div>
          )}

          {isPurchased && (
            <div className="rounded-xl border border-border p-5 text-center space-y-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-bold">구매 완료된 전자책입니다</p>
            </div>
          )}
        </div>

        {/* ═══ Content sections ═══ */}
        <div className="mt-8 tablet:mt-10 max-w-3xl space-y-8 tablet:space-y-10">
          {/* Reviews — TOP */}
          <div>
            <h2 className="text-base tablet:text-lg font-bold flex items-center gap-2 mb-4 tablet:mb-5">
              <span className="w-1 h-5 tablet:h-6 bg-primary rounded-full" />
              실시간 베스트 후기
            </h2>

            <div className="relative">
              <div className="space-y-3">
                {bookReviews.slice(0, visibleReviews).map((review, i) => {
                  const isLast = i === visibleReviews - 1 && visibleReviews < bookReviews.length;
                  return (
                    <div
                      key={i}
                      className={`rounded-xl bg-secondary/60 p-4 tablet:p-5 ${isLast ? "relative" : ""}`}
                    >
                      {isLast && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none z-10" />
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold">{review.name}</span>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="h-3.5 w-3.5 fill-star text-star" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
                    </div>
                  );
                })}
              </div>

              {visibleReviews < bookReviews.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setVisibleReviews((v) => Math.min(v + 4, bookReviews.length))}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    후기 더보기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-base tablet:text-lg font-bold flex items-center gap-2 mb-3 tablet:mb-4">
              <span className="w-1 h-5 tablet:h-6 bg-primary rounded-full" />
              상세 설명
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">(상세설명)</p>
          </div>

          {/* Author */}
          <div>
            <h2 className="text-base tablet:text-lg font-bold flex items-center gap-2 mb-3 tablet:mb-4">
              <span className="w-1 h-5 tablet:h-6 bg-primary rounded-full" />
              작가 소개
            </h2>
            <div className="flex items-start gap-3">
              {sellerProfile.profileImage && (
                <img
                  src={sellerProfile.profileImage}
                  alt={book.author}
                  className="h-12 w-12 rounded-full object-cover border border-border shrink-0"
                />
              )}
              <div>
                <p className="text-sm font-semibold mb-1">{book.author}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{sellerProfile.intro}</p>
              </div>
            </div>
          </div>

          {/* TOC */}
          <div>
            <h2 className="text-base tablet:text-lg font-bold flex items-center gap-2 mb-5 tablet:mb-6">
              <span className="w-1 h-5 tablet:h-6 bg-primary rounded-full" />
              전체목차
            </h2>
            <div className="space-y-8">
              {tableOfContents.map((section, si) => (
                <div key={si}>
                  {/* Chapter heading */}
                  <h3 className="text-lg tablet:text-xl font-black mb-4">{section.chapter}. {section.title}</h3>
                  {/* Subtopics */}
                  <div className="space-y-0 divide-y divide-border">
                    {section.subtopics.map((sub, j) => (
                      <div key={j} className="flex items-center gap-3 py-3.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm font-bold shrink-0">
                          {j + 1}
                        </span>
                        <span className="text-sm flex-1">{sub.title}</span>
                        {sub.preview && (
                          <button
                            onClick={() => navigate(`/reader/${book.id}?preview=true`)}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
                          >
                            미리보기
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile fixed bottom CTA */}
      <div className="desktop:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 z-40 safe-bottom">
        {isPurchased ? (
          <Button
            className="w-full h-12 rounded-xl text-base font-bold"
            onClick={() => navigate(`/reader/${book.id}`)}
          >
            지금 바로 읽기
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <button className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border hover:bg-secondary transition-colors shrink-0">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-0.5">{book.reviewCount}</span>
            </button>
            <Button className="flex-1 h-12 rounded-xl text-base font-bold" onClick={handlePurchase}>
              {currentOption.price.toLocaleString()}원 구매하기
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BookDetail;
