import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, ArrowLeft, Share2, BookOpen, Send, ThumbsUp, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";

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
  { name: "노마드팀", tags: ["30대", "여성"], rating: 5, likes: 42, date: "2026.03.15", content: "진짜 실전에서 바로 쓸 수 있는 꿀팁만 모아놓셨네요. 문의 전혀 아깝지 않습니다! 이 가격에 이 정도 퀄리티면 정말 대만족이에요." },
  { name: "디지털리버", tags: ["40대", "남성"], rating: 5, likes: 31, date: "2026.03.10", content: "내용이 아주 알찹니다. 특히 자동화 시스템 구축 부분이 인상 깊었어요. 실제로 적용해보니 효과가 바로 나타나더라구요." },
  { name: "성장하는개발자", tags: ["20대", "첫구매"], rating: 5, likes: 28, date: "2026.03.08", content: "비전공자인데도 이해하기 쉽게 설명되어 있어서 좋았습니다. 강추입니다. 주변에도 많이 추천하고 있어요." },
  { name: "마케터박", tags: ["30대", "남성"], rating: 5, likes: 24, date: "2026.03.05", content: "마케팅 실무에서 바로 써먹을 수 있는 내용이 가득합니다. 특히 채널별 전략 부분이 정말 유용했어요." },
  { name: "프리랜서후기", tags: ["30대", "첫구매"], rating: 4, likes: 19, date: "2026.03.02", content: "전체적으로 만족스러운 내용이었습니다. 다만 좀 더 심화 내용이 있었으면 하는 아쉬움이 있네요." },
  { name: "초보창업자", tags: ["40대", "여성"], rating: 5, likes: 17, date: "2026.02.28", content: "창업 준비하면서 읽었는데 정말 도움이 많이 됐어요. 실전 경험에서 나온 팁들이라 신뢰가 갑니다." },
  { name: "직장인탈출", tags: ["30대", "남성"], rating: 5, likes: 15, date: "2026.02.25", content: "퇴사 준비하면서 이 책 덕분에 자신감이 생겼습니다. 단계별로 따라하기 쉽게 설명되어 있어요." },
  { name: "수익화마스터", tags: ["20대", "남성"], rating: 5, likes: 12, date: "2026.02.20", content: "수익화에 대한 체계적인 로드맵을 제시해줘서 좋았습니다. 이미 첫 수익을 만들었어요!" },
  { name: "콘텐츠크리에이터", tags: ["20대", "여성"], rating: 4, likes: 9, date: "2026.02.15", content: "콘텐츠 제작 관련 팁이 특히 유용했습니다. 실제 사례가 많아서 이해하기 쉬웠어요." },
  { name: "디지털노마드", tags: ["30대", "여성"], rating: 5, likes: 7, date: "2026.02.10", content: "해외에서 원격으로 일하면서 이 책의 방법론을 적용하고 있습니다. 정말 감사합니다." },
  { name: "투잡러", tags: ["40대", "남성"], rating: 5, likes: 5, date: "2026.02.05", content: "본업 외에 부수입을 만들고 싶어서 읽었는데, 실행 가능한 방법들이 많아서 좋았습니다." },
];

const REVIEWS_PER_PAGE = 5;

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
  const { isWished, toggleWish } = useWishlist();
  const book = sampleBooks.find((b) => b.id === id) || sampleBooks[0];
  const wished = isWished(book.id);
  const [isPurchased, setIsPurchased] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleReviewSubmit = () => {
    if (reviewRating > 0 && reviewText.trim()) {
      setReviewSubmitted(true);
    }
  };

  const ReviewForm = () => {
    if (!isPurchased) return null;
    if (reviewSubmitted) {
      return (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 tablet:p-5 text-center space-y-2 mb-4">
          <Star className="h-6 w-6 fill-star text-star mx-auto" />
          <p className="text-sm font-bold">리뷰가 등록되었습니다!</p>
          <p className="text-xs text-muted-foreground">소중한 후기 감사합니다.</p>
        </div>
      );
    }
    return (
      <div className="rounded-xl border border-border bg-secondary/40 p-4 tablet:p-5 space-y-3 mb-4">
        <p className="text-sm font-bold">구매평 남기기</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setReviewRating(star)}
              onMouseEnter={() => setReviewHover(star)}
              onMouseLeave={() => setReviewHover(0)}
              className="p-0.5"
            >
              <Star
                className={`h-5 w-5 transition-colors ${
                  star <= (reviewHover || reviewRating)
                    ? "fill-star text-star"
                    : "text-border"
                }`}
              />
            </button>
          ))}
          {reviewRating > 0 && (
            <span className="text-xs text-muted-foreground ml-1">{reviewRating}점</span>
          )}
        </div>
        <Textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="이 전자책에 대한 솔직한 후기를 남겨주세요."
          className="min-h-[80px] text-sm resize-none bg-background"
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            className="rounded-full h-8 gap-1.5 text-xs"
            disabled={reviewRating === 0 || !reviewText.trim()}
            onClick={handleReviewSubmit}
          >
            <Send className="h-3 w-3" />
            후기 등록
          </Button>
        </div>
      </div>
    );
  };

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

  // Desktop and mobile render the same content sections, so these live in one
  // place. Order on both:
  // 베스트 후기 → 상세 설명 → 전체목차 → 작가 소개 → 전체 후기 게시판.
  //
  // These are plain functions, called as expressions rather than used as JSX
  // elements. A component declared inside this body is a new type on
  // every render, so React would unmount and remount its subtree — which drops
  // focus from the review textarea after each keystroke.
  const sectionHeading = (text: string) => (
    <h2 className="text-base tablet:text-lg font-bold flex items-center gap-2 mb-3 tablet:mb-4">
      <span className="w-1 h-5 tablet:h-6 bg-primary rounded-full" />
      {text}
    </h2>
  );

  // The heart IS the wishlist — there is deliberately no separate 장바구니 button.
  // h-12 matches the adjacent purchase Button exactly so the pair reads as one row.
  const wishButton = () => (
    <button
      onClick={() => toggleWish(book.id)}
      aria-pressed={wished}
      aria-label={wished ? "위시리스트에서 빼기" : "위시리스트에 담기"}
      className={`flex h-12 w-14 flex-col items-center justify-center rounded-xl border transition-colors shrink-0 ${
        wished ? "border-destructive/40 bg-destructive/5" : "border-border hover:bg-secondary"
      }`}
    >
      <Heart className={`h-5 w-5 ${wished ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
      <span className={`text-[11px] mt-0.5 ${wished ? "text-destructive" : "text-muted-foreground"}`}>
        {book.reviewCount + (wished ? 1 : 0)}
      </span>
    </button>
  );

  // All four fields come from 판매자 프로필 설정 (/seller-profile).
  const authorName = sellerProfile.nickname || book.author;
  const authorSection = () => (
    <div>
      {sectionHeading("작가 소개")}
      <div className="flex items-start gap-4 tablet:gap-5">
        {sellerProfile.profileImage ? (
          <img
            src={sellerProfile.profileImage}
            alt={authorName}
            className="h-20 w-20 tablet:h-24 tablet:w-24 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="h-20 w-20 tablet:h-24 tablet:w-24 rounded-full bg-primary/80 flex items-end justify-center overflow-hidden shrink-0">
            <User className="h-16 w-16 tablet:h-[4.75rem] tablet:w-[4.75rem] text-white translate-y-2" strokeWidth={0} fill="currentColor" />
          </div>
        )}
        <div className="min-w-0 pt-0.5 tablet:pt-1">
          <h3 className="text-xl tablet:text-2xl font-black leading-tight">{authorName}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {sellerProfile.intro}
          </p>
        </div>
      </div>

      {sellerProfile.contactUrl && (
        <div className="relative inline-block mt-3 ml-10 tablet:ml-14">
          {/* Speech-bubble tail pointing back up at the avatar. */}
          <span className="absolute -top-1 left-5 h-3.5 w-3.5 rotate-45 rounded-[2px] bg-kakao" />
          <a
            href={sellerProfile.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center rounded-2xl bg-kakao px-5 py-2.5 text-sm font-bold text-kakao-foreground transition-opacity hover:opacity-90"
          >
            1:1 문의하기
          </a>
        </div>
      )}
    </div>
  );

  // Two-column review cards with avatar + inline rating, matching weolbu's
  // "베스트 수강 후기" block.
  // `variant` keeps the anchor ids unique — the desktop and mobile blocks both
  // render, one of them display:none, so a shared id would send the jump link to
  // the hidden copy.
  const reviewList = (variant: string) => (
    <div>
      {sectionHeading("베스트 후기")}
      {ReviewForm()}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3 tablet:gap-4">
        {bookReviews.slice(0, 4).map((review, i) => (
          <div key={i} className="rounded-xl border border-border p-4 tablet:p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                {review.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold truncate">{review.name}</span>
                  <span className="flex items-center gap-0.5 text-xs font-semibold shrink-0">
                    <Star className="h-3.5 w-3.5 fill-star text-star" />
                    {review.rating}.0
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{review.content}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-4 tablet:mt-5">
        <a
          href={`#reviews-board-${variant}`}
          className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
        >
          전체 후기 보기
        </a>
      </div>
    </div>
  );

  // Full review board at the bottom of the page: one row per review with a like
  // count and pagination. weolbu splits reviews the same way — the cards up top
  // are a curated showcase, this is the actual list.
  const totalReviewPages = Math.ceil(bookReviews.length / REVIEWS_PER_PAGE);
  const reviewBoard = (variant: string) => {
    const start = (reviewPage - 1) * REVIEWS_PER_PAGE;
    const rows = bookReviews.slice(start, start + REVIEWS_PER_PAGE);
    return (
      <div id={`reviews-board-${variant}`} className="scroll-mt-24">
        {sectionHeading(`전체 후기 (${bookReviews.length})`)}
        <div className="border-t border-border">
          {rows.map((review, i) => (
            <div key={start + i} className="border-b border-border py-4 tablet:py-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                  {review.name.slice(0, 1)}
                </div>
                <span className="text-sm font-bold">{review.name}</span>
                {review.tags.map((tag) => (
                  <span key={tag} className="hidden tablet:inline px-1.5 py-0.5 rounded bg-secondary text-[11px] text-muted-foreground">
                    {tag}
                  </span>
                ))}
                <span className="flex items-center gap-0.5 text-xs font-semibold shrink-0">
                  <Star className="h-3.5 w-3.5 fill-star text-star" />
                  {review.rating}.0
                </span>
                <span className="text-xs text-muted-foreground ml-auto shrink-0">{review.date}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
              <div className="flex justify-end mt-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {review.likes}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1 mt-5">
          <button
            onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
            disabled={reviewPage === 1}
            aria-label="이전 페이지"
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setReviewPage(n)}
              aria-current={reviewPage === n ? "page" : undefined}
              className={`h-9 w-9 rounded-lg text-sm transition-colors ${
                reviewPage === n
                  ? "font-bold text-primary bg-primary/10"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setReviewPage((p) => Math.min(totalReviewPages, p + 1))}
            disabled={reviewPage === totalReviewPages}
            aria-label="다음 페이지"
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-4 tablet:py-6 pb-28 desktop:pb-6">
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
          {/* Left: Hero image + content sections */}
          <div>
            <div className="rounded-xl tablet:rounded-2xl overflow-hidden aspect-[4/3] bg-[#f4f4f6]">
              <img src={book.image} alt={book.title} className="w-full h-full object-contain" />
            </div>

            {/* ═══ Content sections (desktop: inside grid for sticky sidebar) ═══ */}
            <div className="hidden desktop:block mt-8 tablet:mt-10 max-w-3xl space-y-8 tablet:space-y-10">
              {/* Reviews */}
              {reviewList("desktop")}

              {/* Description */}
              <div>
                <h2 className="text-base tablet:text-lg font-bold flex items-center gap-2 mb-3 tablet:mb-4">
                  <span className="w-1 h-5 tablet:h-6 bg-primary rounded-full" />
                  상세 설명
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">(상세설명)</p>
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
                      <h3 className="text-lg tablet:text-xl font-black mb-4">{section.chapter}. {section.title}</h3>
                      <div className="space-y-0 divide-y divide-border">
                        {section.subtopics.map((sub, j) => (
                          <div key={j} className="flex items-center gap-3 py-3.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm font-bold shrink-0">{j + 1}</span>
                            <span className="text-sm flex-1">{sub.title}</span>
                            {sub.preview && (
                              <button onClick={() => navigate(`/reader/${book.id}?preview=true`)} className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0">
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

              {/* Author — last, per review feedback */}
              {authorSection()}

              {/* Full review board */}
              {reviewBoard("desktop")}
            </div>
          </div>

          {/* Right: Info sidebar (desktop) */}
          <div className="hidden desktop:block self-start sticky top-24">
            <div className="space-y-5">
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
                <div className="rounded-2xl border border-border p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold">구매 완료된 전자책입니다</p>
                    <p className="text-xs text-muted-foreground">웹 뷰어에서 바로 읽을 수 있어요</p>
                  </div>
                  <Button className="w-full h-12 rounded-xl text-base font-bold" onClick={() => navigate(`/reader/${book.id}`)}>
                    지금 바로 읽기
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border border-border p-6 space-y-5">
                  <div>
                    {discount && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-destructive">{discount}%</span>
                        <span className="text-sm text-muted-foreground line-through">{currentOption.originalPrice?.toLocaleString()}원</span>
                      </div>
                    )}
                    <div className="text-3xl font-black">{currentOption.price.toLocaleString()}원</div>
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-3">구매 옵션</p>
                    <div className="space-y-2">
                      {purchaseOptions.map((opt, i) => (
                        <OptionCard key={i} label={opt.label} description={opt.description} price={opt.price} originalPrice={opt.originalPrice} selected={selectedOption === i} onClick={() => setSelectedOption(i)} />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-sm font-bold">상품 금액</span>
                    <span className="text-xl font-black">{currentOption.price.toLocaleString()}원</span>
                  </div>
                  <div className="flex gap-2">
                    {wishButton()}
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

        {/* ═══ Content sections (mobile/tablet only) ═══ */}
        <div className="desktop:hidden mt-8 tablet:mt-10 max-w-3xl space-y-8 tablet:space-y-10">
          {/* Reviews — TOP */}
          {reviewList("mobile")}

          {/* Description */}
          <div>
            <h2 className="text-base tablet:text-lg font-bold flex items-center gap-2 mb-3 tablet:mb-4">
              <span className="w-1 h-5 tablet:h-6 bg-primary rounded-full" />
              상세 설명
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">(상세설명)</p>
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

          {/* Author — last, per review feedback */}
          {authorSection()}

          {/* Full review board */}
          {reviewBoard("mobile")}
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
            {wishButton()}
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
