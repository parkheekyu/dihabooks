import { useParams, Link } from "react-router-dom";
import { Star, Heart, ArrowLeft, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/data/mockData";

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

const BookDetail = () => {
  const { id } = useParams();
  const book = sampleBooks.find((b) => b.id === id) || sampleBooks[0];

  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/store" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> 뒤로가기
          </Link>
          <button className="ml-auto p-2 text-muted-foreground hover:text-foreground">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 desktop:grid-cols-[1fr_380px] gap-10">
          {/* Left Content */}
          <div className="space-y-10">
            {/* Title & Image */}
            <div>
              <h1 className="text-2xl tablet:text-3xl font-black leading-tight mb-2">
                {book.title}
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(book.rating) ? "fill-star text-star" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{book.rating}</span>
                <span className="text-sm text-primary hover:underline cursor-pointer">
                  {book.reviewCount}개 후기
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-video bg-secondary">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <span className="w-1 h-6 bg-primary rounded-full" />
                상세 설명
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                (상세설명)
              </p>
            </div>

            {/* Author */}
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <span className="w-1 h-6 bg-primary rounded-full" />
                작가 소개
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                안녕하세요, {book.author}입니다. 저는 단순히 이론을 나열하는 것이 아니라, 실제 현장에서 수백 번의 시행착오 끝에 얻은 '진짜 기술을 전달하는 것'을 사명으로 합니다.
              </p>
            </div>

            {/* TOC */}
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <span className="w-1 h-6 bg-primary rounded-full" />
                목차
              </h2>
              <div className="space-y-2">
                {tableOfContents.map((item) => (
                  <div
                    key={item.chapter}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {item.chapter}
                    </span>
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full" />
                  수강생 리뷰
                </h2>
                <button className="text-sm text-primary hover:underline">리뷰 작성하기</button>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-secondary mb-6">
                <div className="text-center">
                  <div className="text-4xl font-black">{book.rating}</div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-star text-star" />
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
                  <div key={i} className="py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.name}</p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-star text-star" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Purchase Card */}
          <div className="desktop:block">
            <div className="sticky top-24 rounded-2xl border border-border p-6 space-y-4">
              {/* Price */}
              <div>
                {discount && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-primary">{discount}%</span>
                    <span className="text-sm text-muted-foreground line-through">
                      {book.originalPrice?.toLocaleString()}원
                    </span>
                  </div>
                )}
                <div className="text-3xl font-black">{book.price.toLocaleString()}원</div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold">{book.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">웹 뷰어로 바로 읽기</p>
                    </div>
                    <span className="text-sm font-bold">{book.price.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-sm font-medium">상품 금액</span>
                <span className="text-xl font-black">{book.price.toLocaleString()}원</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="p-3 rounded-xl border border-border hover:bg-secondary transition-colors">
                  <Heart className="h-5 w-5 text-muted-foreground" />
                </button>
                <Button className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground text-base font-bold hover:bg-primary/90">
                  지금 바로 구매하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookDetail;
