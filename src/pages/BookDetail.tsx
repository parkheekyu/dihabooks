import { Fragment, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, Share2, Send, ThumbsUp, ChevronLeft, ChevronRight, CircleCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { sampleBooks, sellerByAuthor } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_AVATAR } from "@/lib/constants";
import { useWishlist } from "@/contexts/WishlistContext";
import { isPurchasedBook } from "@/lib/purchased";

/**
 * 상품 등록의 목차 설정에서 받은 값. page는 소제목이 시작하는 쪽이고,
 * 끝 쪽은 다음 소제목의 시작 직전으로 본다. preview를 켠 소제목은
 * 그 구간의 앞 30%까지 뷰어에서 무료로 볼 수 있다.
 */
const tableOfContents = [
  {
    chapter: "프롤로그",
    title: "왜 지금 이 기술이 필요한가",
    subtopics: [
      { title: "변화하는 디지털 경제 환경", page: 1, preview: true },
      { title: "이 책을 읽어야 하는 이유", page: 6, preview: false },
      { title: "성공 사례 미리보기", page: 11, preview: true },
    ],
  },
  {
    chapter: "Chapter 1",
    title: "마인드셋과 도구 준비하기",
    subtopics: [
      { title: "성장형 사고방식 만들기", page: 18, preview: true },
      { title: "필수 도구 세팅 가이드", page: 26, preview: false },
      { title: "효율적인 워크플로우 구축", page: 33, preview: false },
    ],
  },
  {
    chapter: "Chapter 2",
    title: "0원에서 100만원을 만드는 핵심 알고리즘",
    subtopics: [
      { title: "수익화 구조 이해하기", page: 40, preview: false },
      { title: "트래픽을 수익으로 전환하는 법", page: 48, preview: false },
      { title: "실전 A/B 테스트 전략", page: 56, preview: false },
      { title: "자동 수익 파이프라인 설계", page: 63, preview: false },
    ],
  },
  {
    chapter: "Chapter 3",
    title: "지속 가능한 수익을 위한 자동화 시스템",
    subtopics: [
      { title: "자동화 툴 비교 분석", page: 70, preview: false },
      { title: "노코드로 시스템 구축하기", page: 78, preview: false },
      { title: "유지보수 최소화 전략", page: 86, preview: false },
    ],
  },
  {
    chapter: "에필로그",
    title: "당신의 항해를 응원하며",
    subtopics: [
      { title: "앞으로의 로드맵", page: 92, preview: false },
      { title: "커뮤니티 활용법", page: 97, preview: false },
    ],
  },
];


const AGES = ["10대", "20대", "30대", "40대", "50대", "60대 이상"] as const;
const GENDERS = ["남성", "여성"] as const;
const EXPERIENCES = ["첫 수강이에요", "기존 학습 경험이 있어요"] as const;
const FIRST = EXPERIENCES[0];
const EXISTING = EXPERIENCES[1];

type Review = {
  name: string; age: string; gender: string; experience: string;
  rating: number; likes: number; date: string; content: string;
};

const bookReviews: Review[] = [
  { name: "노마드팀", age: "30대", gender: "여성", experience: EXISTING, rating: 5, likes: 42, date: "2026-03-15", content: "진짜 실전에서 바로 쓸 수 있는 꿀팁만 모아놓셨네요. 문의 전혀 아깝지 않습니다! 이 가격에 이 정도 퀄리티면 정말 대만족이에요." },
  { name: "디지털리버", age: "40대", gender: "남성", experience: EXISTING, rating: 5, likes: 31, date: "2026-03-10", content: "내용이 아주 알찹니다. 특히 자동화 시스템 구축 부분이 인상 깊었어요. 실제로 적용해보니 효과가 바로 나타나더라구요." },
  { name: "성장하는개발자", age: "20대", gender: "남성", experience: FIRST, rating: 5, likes: 28, date: "2026-03-08", content: "비전공자인데도 이해하기 쉽게 설명되어 있어서 좋았습니다. 강추입니다. 주변에도 많이 추천하고 있어요." },
  { name: "마케터박", age: "30대", gender: "남성", experience: EXISTING, rating: 5, likes: 24, date: "2026-03-05", content: "마케팅 실무에서 바로 써먹을 수 있는 내용이 가득합니다. 특히 채널별 전략 부분이 정말 유용했어요." },
  { name: "프리랜서후기", age: "30대", gender: "여성", experience: FIRST, rating: 4, likes: 19, date: "2026-03-02", content: "전체적으로 만족스러운 내용이었습니다. 다만 좀 더 심화 내용이 있었으면 하는 아쉬움이 있네요." },
  { name: "초보창업자", age: "40대", gender: "여성", experience: FIRST, rating: 5, likes: 17, date: "2026-02-28", content: "창업 준비하면서 읽었는데 정말 도움이 많이 됐어요. 실전 경험에서 나온 팁들이라 신뢰가 갑니다." },
  { name: "직장인탈출", age: "30대", gender: "남성", experience: EXISTING, rating: 5, likes: 15, date: "2026-02-25", content: "퇴사 준비하면서 이 책 덕분에 자신감이 생겼습니다. 단계별로 따라하기 쉽게 설명되어 있어요." },
  { name: "수익화마스터", age: "20대", gender: "남성", experience: EXISTING, rating: 5, likes: 12, date: "2026-02-20", content: "수익화에 대한 체계적인 로드맵을 제시해줘서 좋았습니다. 이미 첫 수익을 만들었어요!" },
  { name: "콘텐츠크리에이터", age: "20대", gender: "여성", experience: FIRST, rating: 4, likes: 9, date: "2026-02-15", content: "콘텐츠 제작 관련 팁이 특히 유용했습니다. 실제 사례가 많아서 이해하기 쉬웠어요." },
  { name: "디지털노마드", age: "30대", gender: "여성", experience: EXISTING, rating: 5, likes: 7, date: "2026-02-10", content: "해외에서 원격으로 일하면서 이 책의 방법론을 적용하고 있습니다. 정말 감사합니다." },
  { name: "투잡러", age: "50대", gender: "남성", experience: FIRST, rating: 5, likes: 5, date: "2026-02-05", content: "본업 외에 부수입을 만들고 싶어서 읽었는데, 실행 가능한 방법들이 많아서 좋았습니다." },
];

const REVIEWS_PER_PAGE = 5;

// 탭 순서는 운영 중인 상품 페이지와 같다. 섹션은 소개 → 목차 → 후기 → 작가 순으로 놓인다.
const SECTION_TABS = [
  { key: "desc", label: "소개" },
  { key: "toc", label: "목차" },
  { key: "author", label: "작가" },
  { key: "reviews", label: "후기" },
];

/** 글자 별점. 채운 만큼만 색을 넣는다. */
const Stars = ({ value, on, off }: { value: number; on: string; off: string }) => (
  <>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} aria-hidden="true" className={n <= Math.round(value) ? on : off}>★</span>
    ))}
  </>
);

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sellerProfile } = useAuth();
  const { isWished, toggleWish } = useWishlist();
  const book = sampleBooks.find((b) => b.id === id) || sampleBooks[0];
  const wished = isWished(book.id);
  // 결제는 주문서(/checkout)에서 끝난다. 거기서 남긴 구매 기록을 읽어 온다.
  const isPurchased = isPurchasedBook(book.id);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [genderFilter, setGenderFilter] = useState("전체");
  const [ageFilter, setAgeFilter] = useState("전체");
  const [expFilter, setExpFilter] = useState("전체");
  const [reviewSort, setReviewSort] = useState<"useful" | "latest">("latest");
  const [likedReviews, setLikedReviews] = useState<string[]>([]);

  const [activeSection, setActiveSection] = useState("desc");

  // Highlight whichever section is currently near the top of the viewport.
  useEffect(() => {
    const els = SECTION_TABS.map((t) => document.getElementById(`sec-${t.key}`))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    // A callback only carries the entries that *changed*, so intersecting
    // sections are accumulated across callbacks and the topmost one wins.
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)
        );
        if (!visible.size) return;
        const topId = [...visible]
          .map((id) => ({
            id,
            top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity,
          }))
          .sort((a, b) => a.top - b.top)[0].id;
        setActiveSection(topId.split("-")[1]);
      },
      { rootMargin: "-96px 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const sectionTabs = () => (
    <nav className="mt-7 grid grid-cols-4 border-b border-border" aria-label="상품 상세 섹션">
      {SECTION_TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => document.getElementById(`sec-${t.key}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          aria-current={activeSection === t.key ? "true" : undefined}
          className={`-mb-px border-b-2 px-2 py-3 text-xs font-semibold transition-colors tablet:text-sm ${
            activeSection === t.key
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.label}
          {t.key === "reviews" && ` ${bookReviews.length}`}
        </button>
      ))}
    </nav>
  );

  const handleReviewSubmit = () => {
    if (reviewRating > 0 && reviewText.trim()) {
      setReviewSubmitted(true);
    }
  };

  // Plain function, called as an expression rather than used as a JSX element.
  // A component declared inside this body is a new type on every render, so
  // React would remount it — which drops focus from the textarea per keystroke.
  const ReviewForm = () => {
    if (!isPurchased) {
      return (
        <p className="mt-8 rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
          이 전자책을 구매하면 리뷰를 작성할 수 있습니다.
        </p>
      );
    }
    if (reviewSubmitted) {
      return (
        <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-4 tablet:p-5 text-center space-y-2">
          <Star className="h-6 w-6 fill-star text-star mx-auto" />
          <p className="text-sm font-bold">리뷰가 등록되었습니다!</p>
          <p className="text-xs text-muted-foreground">소중한 후기 감사합니다.</p>
        </div>
      );
    }
    return (
      <div className="mt-8 rounded-xl border border-border bg-secondary/40 p-4 tablet:p-5 space-y-3">
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

  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : null;

  // 옵션·쿠폰·결제 금액은 주문서에서 다룬다. 여기서는 가격과 구매 버튼만 둔다.
  const handlePurchase = () => navigate(`/checkout?book=${book.id}`);

  const sectionHeading = (text: string) => (
    <h2 className="flex items-center gap-2 text-base font-bold tablet:text-lg">
      <span className="h-5 w-1 rounded-full bg-primary tablet:h-6" aria-hidden="true" />
      {text}
    </h2>
  );

  /**
   * 소제목의 미리보기 구간. 끝 쪽은 다음 소제목의 시작 직전이고,
   * 그중 앞 30%까지만 열어 준다. 최소 한 쪽은 보이도록 올림 처리한다.
   */
  const previewRange = (ci: number, si: number) => {
    const flat = tableOfContents.flatMap((sec, i) => sec.subtopics.map((sub, j) => ({ i, j, page: sub.page })));
    const at = flat.findIndex((x) => x.i === ci && x.j === si);
    const from = flat[at].page;
    const next = flat[at + 1]?.page;
    const last = (next ? next - 1 : book.pageCount ?? from);
    const to = Math.max(from, from + Math.ceil((last - from + 1) * 0.3) - 1);
    return { from, to };
  };

  const openPreview = (ci: number, si: number) => {
    const { from, to } = previewRange(ci, si);
    navigate(`/reader/${book.id}?preview=1&from=${from}&to=${to}`);
  };

  // The heart IS the wishlist — there is deliberately no separate 장바구니 button.
  // 60px square so it sits flush with the purchase button beside it.
  const wishButton = () => (
    <button
      type="button"
      onClick={() => toggleWish(book.id)}
      aria-pressed={wished}
      aria-label={wished ? "위시리스트에서 빼기" : "위시리스트에 추가"}
      className={`flex h-[60px] w-[60px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-md border bg-background text-xs transition-colors ${
        wished
          ? "border-[#ffb1b1] text-[#f04444]"
          : "border-[#dfe3eb] text-[#7b8290] hover:border-[#ffb1b1] hover:text-[#f04444]"
      }`}
    >
      <Heart className={`h-6 w-6 ${wished ? "fill-current" : ""}`} />
      <span className="whitespace-nowrap tabular-nums">{book.reviewCount + (wished ? 1 : 0)}</span>
    </button>
  );

  // All four fields come from 작가 프로필 설정 (/seller-profile).
  const authorName = sellerProfile.nickname || book.author;
  // 이 상품을 쓴 작가의 판매자 정보. 사업자가 없으면 상호명 대신 닉네임을 쓰고
  // 대표·사업자등록번호는 빼둔다. 등록되지 않은 작가면 작가명만이라도 밝힌다.
  const seller = sellerByAuthor[book.author];
  const sellerRows: [string, string][] = (
    seller
      ? [
          ["상호명", seller.freelancer ? seller.nickname : seller.businessName || seller.nickname],
          ["대표", seller.freelancer ? "" : seller.representative],
          ["사업자등록번호", seller.freelancer ? "" : seller.businessNumber],
          ["연락처", seller.sellerPhone],
          ["이메일", seller.sellerEmail],
        ]
      : [["판매자", book.author]]
  ).filter(([, value]) => value) as [string, string][];
  const authorSection = () => (
    <section id="sec-author" className="mt-8 scroll-mt-24">
      {sectionHeading("작가 소개")}
      {/* 한 박스 안에 작가 프로필 → 구분선 → 판매자 정보 */}
      <div className="mt-3 rounded-xl bg-secondary/40 px-4 py-4 tablet:px-5 tablet:py-5">
        <div className="flex items-start gap-3">
          <img
            src={sellerProfile.profileImage || DEFAULT_AVATAR}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="mb-1 text-sm font-semibold">{authorName}</p>
            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
              {sellerProfile.intro}
            </p>
          </div>
        </div>
        {/* 판매자 정보 — 통신판매중개 고지에 따라 판매 주체를 밝힌다. */}
        <div className="mt-4 border-t border-border/50 pt-4">
          <h3 className="text-xs font-bold text-foreground">판매자 정보</h3>
          <dl className="mt-2.5 grid grid-cols-[auto_1fr] tablet:grid-cols-[auto_1fr_auto_1fr] gap-x-4 tablet:gap-x-5 gap-y-1.5 text-xs">
            {sellerRows.map(([label, value]) => (
              <Fragment key={label}>
                <dt className="text-muted-foreground whitespace-nowrap">{label}</dt>
                <dd className="font-medium text-foreground break-all">{value}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );

  // ── 후기: 별점 요약 → 필터 → 정렬 → 목록 ──
  const count = (pick: (r: Review) => boolean) => bookReviews.filter(pick).length;
  const average = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
  const averageText = Number.isInteger(average) ? String(average) : average.toFixed(1);

  const filteredReviews = bookReviews
    .filter((r) => genderFilter === "전체" || r.gender === genderFilter)
    .filter((r) => ageFilter === "전체" || r.age === ageFilter)
    .filter((r) => expFilter === "전체" || r.experience === expFilter)
    .sort((a, b) => (reviewSort === "useful" ? b.likes - a.likes : b.date.localeCompare(a.date)));
  const totalReviewPages = Math.max(1, Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE));

  const filterRow = (
    label: string,
    options: readonly string[],
    value: string,
    setValue: (v: string) => void,
    pick: (r: Review, option: string) => boolean,
  ) => (
    <div className="flex items-start gap-4 tablet:gap-6">
      <span className="w-[68px] shrink-0 pt-2 text-[14px] font-medium text-[#78859a]">{label}</span>
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        {["전체", ...options].map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => { setValue(option); setReviewPage(1); }}
            className={`min-h-9 rounded-full border px-3 text-[14px] font-medium transition-colors ${
              value === option
                ? "border-[#2164ff] bg-[#f5f8ff] text-[#2164ff]"
                : "border-[#e3e7ed] bg-white text-[#17243f] hover:border-[#aeb9ca]"
            }`}
          >
            {option}
            {option !== "전체" && (
              <span className="text-[#8792a3]"> {count((r) => pick(r, option))}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const reviewSection = () => {
    const start = (reviewPage - 1) * REVIEWS_PER_PAGE;
    const rows = filteredReviews.slice(start, start + REVIEWS_PER_PAGE);
    return (
      <div id="sec-reviews" className="scroll-mt-24">
        <section className="mt-16 border-t border-[#edf0f4] pt-8">
          <h2 className="flex items-baseline gap-2 text-[19px] font-bold tracking-tight text-[#171b23]">
            후기
            <span className="text-[16px] font-normal text-[#8490a3]">총 {bookReviews.length}개</span>
          </h2>

          {/* 별점 요약 */}
          <div className="mt-5 grid min-h-[112px] grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] items-center gap-6 rounded-[4px] bg-[#f6f7f9] p-4 tablet:h-28 tablet:grid-cols-[170px_minmax(0,1fr)] tablet:gap-8">
            <div className="text-center">
              <div className="text-[24px] font-bold leading-none text-[#131a2a]">{averageText}</div>
              <div className="mt-2 flex justify-center gap-0.5 text-[18px] leading-none" aria-label={`${averageText}점`}>
                <Stars value={average} on="text-[#ffd338]" off="text-[#dfe2e8]" />
              </div>
            </div>
            <div className="grid h-20 grid-rows-5" aria-label="별점 분포">
              {[5, 4, 3, 2, 1].map((score) => {
                const n = count((r) => r.rating === score);
                return (
                  <div key={score} className="flex h-4 min-h-0 items-center gap-2 text-[12px] leading-4">
                    <span className="w-6 shrink-0 text-right text-[#8792a3]">{score}점</span>
                    <div className="h-[6px] flex-1 overflow-hidden bg-[#dfe2e8]">
                      <div className="h-full bg-[#4778ed]" style={{ width: `${(n / bookReviews.length) * 100}%` }} />
                    </div>
                    <span className="w-16 shrink-0 text-[#8792a3]">{n}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 space-y-3" aria-label="후기 필터">
            {filterRow("성별", GENDERS, genderFilter, setGenderFilter, (r, o) => r.gender === o)}
            {filterRow("나이", AGES, ageFilter, setAgeFilter, (r, o) => r.age === o)}
            {filterRow("학습경험", EXPERIENCES, expFilter, setExpFilter, (r, o) => r.experience === o)}
          </div>

          <div className="mt-5 flex items-center gap-4 border-t border-[#edf0f4] pt-5 text-[14px]">
            {([["useful", "유용한순"], ["latest", "최신순"]] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={reviewSort === key}
                onClick={() => { setReviewSort(key); setReviewPage(1); }}
                className={reviewSort === key ? "font-semibold text-[#1b2b4b]" : "text-[#9aa3b2]"}
              >
                {label}
              </button>
            ))}
          </div>

          {rows.length === 0 ? (
            <p className="mt-4 rounded-[4px] border border-[#e4e7ec] px-4 py-10 text-center text-[14px] text-[#8b95a5]">
              조건에 맞는 후기가 없습니다.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {rows.map((review) => {
                const liked = likedReviews.includes(review.name);
                return (
                  <li key={review.name} className="rounded-[4px] border border-[#e4e7ec] bg-white px-4 py-5 tablet:px-[18px]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0d8a5] text-[16px] font-bold text-[#805d26]">
                        {review.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-0.5 text-[15px] font-bold text-[#162036]">
                          <span className="truncate">{review.name}</span>
                          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1 text-[12px] text-[#8b95a5]">
                          <span>{review.age}</span>
                          <span aria-hidden="true">·</span>
                          <span>{review.gender}</span>
                          <span aria-hidden="true">·</span>
                          <span>{review.experience}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1" aria-label={`${review.rating}점`}>
                        <span className="text-[17px] leading-none tracking-[-2px]">
                          <Stars value={review.rating} on="text-[#ffd338]" off="text-[#dfe2e8]" />
                        </span>
                        <span className="ml-1 text-[14px] font-semibold text-[#1a2030]">{review.rating}</span>
                      </div>
                      <time className="shrink-0 text-[13px] text-[#a0a8b6]">{review.date}</time>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-[15px] leading-[1.85] text-[#444c5b]">{review.content}</p>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        aria-pressed={liked}
                        aria-label={`유용함, 현재 ${review.likes + (liked ? 1 : 0)}명`}
                        onClick={() =>
                          setLikedReviews((prev) =>
                            liked ? prev.filter((n) => n !== review.name) : [...prev, review.name]
                          )
                        }
                        className={`inline-flex min-h-8 items-center gap-1.5 rounded-md px-1.5 text-[14px] transition-colors hover:text-[#2164ff] ${
                          liked ? "text-[#2164ff]" : "text-[#17243f]"
                        }`}
                      >
                        <ThumbsUp className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                        <span>{review.likes + (liked ? 1 : 0)}</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {totalReviewPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-1">
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
          )}
        </section>
        {ReviewForm()}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container w-full min-w-0 flex-1 px-4 py-4 tablet:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/store" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <span aria-hidden="true">←</span> 뒤로가기
          </Link>
          <button type="button" className="ml-auto p-2 text-muted-foreground hover:text-foreground" aria-label="공유">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/*
          One copy of everything. On desktop the purchase panel is the sticky
          right column spanning both rows; below that it simply falls between
          the hero image and the content sections.
        */}
        <div className="mt-6 grid min-w-0 items-start gap-y-5 desktop:grid-cols-[minmax(0,1fr)_380px] desktop:grid-rows-[auto_1fr] desktop:gap-x-10 desktop:gap-y-0">
          {/* Hero image */}
          <div className="min-w-0 desktop:col-start-1 desktop:row-start-1">
            <div className="aspect-video overflow-hidden rounded-xl bg-[#f4f4f6] tablet:rounded-2xl">
              <img src={book.image} alt={book.title} className="h-full w-full object-contain" />
            </div>
          </div>

          {/* Purchase panel */}
          <aside className="min-w-0 self-start desktop:sticky desktop:top-24 desktop:col-start-2 desktop:row-span-2 desktop:row-start-1">
            <div className="space-y-5">
              <div>
                <p className="mb-1 text-sm font-medium text-primary">{book.author}</p>
                <h1 className="text-xl font-black leading-tight tablet:text-2xl">{book.title}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex items-center gap-0.5" aria-label={`${book.rating}점`}>
                    <Stars value={book.rating} on="text-star" off="text-border" />
                  </span>
                  <span className="text-sm font-medium">{book.rating}</span>
                </div>
                {book.badge && (
                  <span className="mt-2 inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    {book.badge === "BEST" ? "베스트셀러" : book.badge === "NEW" ? "신규" : "인기"}
                  </span>
                )}
              </div>

              {isPurchased ? (
                <div className="space-y-4 rounded-2xl border border-border p-6">
                  <div className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                      <CircleCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-bold">구매 완료된 전자책입니다</p>
                    <p className="text-xs text-muted-foreground">웹 뷰어에서 바로 읽을 수 있어요</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/reader/${book.id}`)}
                    className="inline-flex h-[60px] w-full items-center justify-center rounded-md bg-foreground px-3 text-base font-bold text-background transition hover:bg-foreground/90"
                  >
                    지금 바로 읽기
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-border p-6">
                  {discount && (
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-lg font-bold text-destructive">{discount}%</span>
                      <span className="text-sm text-muted-foreground line-through">
                        {book.originalPrice?.toLocaleString()}원
                      </span>
                    </div>
                  )}
                  <p className="mt-1 text-3xl font-black leading-tight">{book.price.toLocaleString()}원</p>
                  <p className="mt-2 text-xs text-muted-foreground">전자책 · 구매 즉시 웹 뷰어로 읽기</p>

                  <div className="mt-5 flex items-center gap-2">
                    {wishButton()}
                    <button
                      type="button"
                      onClick={handlePurchase}
                      className="inline-flex h-[60px] min-w-0 flex-1 items-center justify-center rounded-md bg-[#2148be] px-3 text-base font-bold text-white transition hover:bg-[#173da7]"
                    >
                      지금 바로 구매하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Content sections: 소개 → 목차 → 후기 → 작가 */}
          <div className="min-w-0 max-w-3xl desktop:col-start-1 desktop:row-start-2">
            {sectionTabs()}

            <section id="sec-desc" className="mt-8 scroll-mt-24 tablet:mt-10">
              {sectionHeading("상세 설명")}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">(상세설명)</p>
            </section>

            <section id="sec-toc" className="mt-8 scroll-mt-24">
              {sectionHeading("전체목차")}
              <div className="mt-5 space-y-8">
                {tableOfContents.map((section, ci) => (
                  <div key={ci}>
                    <h3 className="text-lg font-black leading-tight tablet:text-xl">
                      {section.chapter}. {section.title}
                    </h3>
                    <ul className="divide-y divide-border">
                      {section.subtopics.map((sub, si) => (
                        <li key={si}>
                          <div className="flex items-center gap-3 py-3.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-bold">
                              {si + 1}
                            </span>
                            <span className="min-w-0 flex-1 break-words text-sm">{sub.title}</span>
                            {sub.preview && (
                              <button
                                type="button"
                                onClick={() => openPreview(ci, si)}
                                className="inline-flex min-h-10 shrink-0 items-center rounded-lg border border-primary/20 px-2.5 py-2 text-xs font-semibold text-primary hover:bg-primary/5"
                              >
                                미리보기
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {reviewSection()}

            {authorSection()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookDetail;
