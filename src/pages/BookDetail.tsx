import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, ArrowLeft, Share2, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const tableOfContents = [
  { chapter: 1, title: "프롤로그: 왜 지금 이 기술이 필요한가" },
  { chapter: 2, title: "제1장: 마인드셋과 도구 준비하기" },
  { chapter: 3, title: "제2장: 0원에서 100만원을 만드는 핵심 알고리즘" },
  { chapter: 4, title: "제3장: 지속 가능한 수익을 위한 자동화 시스템" },
  { chapter: 5, title: "에필로그: 당신의 항해를 응원하며" },
];

const bookReviews = [
  { name: "노마드팀", rating: 5, date: "2026.03.15", content: "진짜 실전에서 바로 쓸 수 있는 꿀팁만 모아놓셨네요. 문의 전혀 아깝지 않습니다!" },
  { name: "디지털리버", rating: 5, date: "2026.03.10", content: "내용이 아주 알찹니다. 특히 자동화 시스템 구축 부분이 인상 깊었어요." },
  { name: "성장하는개발자", rating: 5, date: "2026.03.08", content: "비전공자인데도 이해하기 쉽게 설명되어 있어서 좋았습니다. 강추입니다." },
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
            <h2 className="text-base tablet:text-lg font-bold flex items-center gap-2 mb-3 tablet:mb-4">
              <span className="w-1 h-5 tablet:h-6 bg-primary rounded-full" />
              목차
            </h2>
            <div className="space-y-2">
              {tableOfContents.map((item) => (
                <div key={item.chapter} className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
                    {item.chapter}
                  </span>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-3 tablet:mb-4">
              <h2 className="text-base tablet:text-lg font-bold flex items-center gap-2">
                <span className="w-1 h-5 tablet:h-6 bg-primary rounded-full" />
                수강생 리뷰
              </h2>
              <button className="text-sm text-primary hover:underline">리뷰 작성하기</button>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-4 tablet:gap-6 p-4 tablet:p-6 rounded-xl tablet:rounded-2xl bg-secondary mb-4 tablet:mb-6">
              <div className="text-center shrink-0">
                <div className="text-3xl tablet:text-4xl font-black">{book.rating}</div>
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 tablet:h-3.5 w-3 tablet:w-3.5 fill-star text-star" />
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs w-3">{stars}</span>
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: stars === 5 ? "80%" : stars === 4 ? "15%" : "5%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {bookReviews.map((review, i) => (
                <div key={i} className="py-3 tablet:py-4 border-b border-border last:border-0">
                  <div className="flex items-center gap-2 tablet:gap-3 mb-2">
                    <div className="h-7 w-7 tablet:h-8 tablet:w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                      {review.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{review.name}</p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="h-3 w-3 fill-star text-star" />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto shrink-0">{review.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.content}</p>
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
