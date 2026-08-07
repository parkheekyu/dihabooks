import { useState, useEffect, useCallback, useRef, type TransitionEvent } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

import BookCard from "@/components/BookCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroVideo from "@/components/HeroVideo";
import { categories, heroSlides, sampleBooks, reviews } from "@/data/mockData";
import { useMediaQuery } from "@/hooks/use-media-query";
import ctaBg from "@/assets/cta-bg.jpg";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [paused, setPaused] = useState(false);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // % width of the center slide. The peek layout only reads well on a wide screen:
  // at 46% a 390px phone leaves a 180px card, and even 768px gives just 333px. So
  // below the desktop breakpoint the centre slide takes nearly the full width and
  // the neighbours only hint at the edges.
  const isNarrow = useMediaQuery("(max-width: 1023px)");
  const SLIDE_W = isNarrow ? 88 : 46;

  // Infinite loop: clone last slide at front, first slide at end
  const n = heroSlides.length;
  const slidesEx = [heroSlides[n - 1], ...heroSlides, heroSlides[0]];
  const [pos, setPos] = useState(1); // index into slidesEx (1 = first real slide)
  const [anim, setAnim] = useState(true);
  const realIndex = ((pos - 1) % n + n) % n;

  const scrollReviews = (dir: "left" | "right") => {
    const el = reviewsRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const lockRef = useRef(false); // ignore clicks while a slide transition is running
  const nextSlide = useCallback(() => {
    if (lockRef.current) return;
    lockRef.current = true;
    setAnim(true); setPos((p) => p + 1);
  }, []);
  const prevSlide = useCallback(() => {
    if (lockRef.current) return;
    lockRef.current = true;
    setAnim(true); setPos((p) => p - 1);
  }, []);

  // When landing on a cloned edge, snap (without animation) to the real slide
  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    // only react to the track's own transform transition (not children's opacity)
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (pos === n + 1) { setAnim(false); setPos(1); }
    else if (pos === 0) { setAnim(false); setPos(n); }
    lockRef.current = false;
  };
  useEffect(() => {
    if (!anim) {
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
      return () => cancelAnimationFrame(id);
    }
  }, [anim]);

  useEffect(() => {
    if (paused) return;
    if (heroSlides[realIndex]?.youtubeId) return; // video slide advances itself on end
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, paused, realIndex]);

  const filteredBooks =
    activeCategory === "all"
      ? sampleBooks
      : sampleBooks.filter((b) => b.category === categories.find(c => c.id === activeCategory)?.label);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Carousel (peek style, infinite loop) */}
        <section className="relative overflow-hidden bg-background pt-4 tablet:pt-6">
          <div className="relative overflow-hidden w-full">
            <div
              className="flex"
              style={{
                transform: `translateX(calc(${pos} * -${SLIDE_W}% + ${(100 - SLIDE_W) / 2}%))`,
                transition: anim ? "transform 450ms cubic-bezier(0.32, 0.72, 0, 1)" : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slidesEx.map((slide, i) => {
                const active = i === pos;
                return (
                  <div key={i} className="shrink-0 px-1.5 tablet:px-2.5" style={{ width: `${SLIDE_W}%` }}>
                    <div
                      className={`relative rounded-xl tablet:rounded-2xl overflow-hidden aspect-[16/9] tablet:aspect-[1530/688] transition-opacity duration-300 ${
                        active ? "opacity-100" : "opacity-40 cursor-pointer"
                      }`}
                      onClick={() => !active && (i < pos ? prevSlide() : nextSlide())}
                    >
                      {slide.youtubeId ? (
                        active && i === 1 ? (
                          // live video (only for the real first slide when centered)
                          <HeroVideo youtubeId={slide.youtubeId} paused={paused} onEnded={nextSlide} />
                        ) : (
                          // thumbnail (neighbors / clone), letterboxed on black
                          <div className="absolute inset-0 bg-black flex items-center justify-center">
                            <img
                              src={`https://img.youtube.com/vi/${slide.youtubeId}/maxresdefault.jpg`}
                              alt=""
                              className="h-full w-auto max-w-full object-contain"
                            />
                          </div>
                        )
                      ) : (
                        <img
                          src={slide.image}
                          alt=""
                          width={1920}
                          height={600}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fixed controls (anchored to center card's right side, always visible) */}
            <div
              className="absolute bottom-3 tablet:bottom-5 z-10 flex items-center gap-0.5 rounded-full bg-black/35 backdrop-blur-sm text-white pl-2 pr-1 py-1"
              style={{ right: `calc(${(100 - SLIDE_W) / 2}% + 44px)` }}
            >
              <button
                type="button"
                aria-label={paused ? "재생" : "일시정지"}
                onClick={() => setPaused((p) => !p)}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              </button>
              <span className="px-1.5 text-xs font-medium tabular-nums">
                {realIndex + 1} / {n}
              </span>
              <button
                type="button"
                aria-label="이전 배너"
                onClick={prevSlide}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="다음 배너"
                onClick={nextSlide}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Category Tiles */}
        <section className="container px-4 mt-6 tablet:mt-8">
          <div className="flex gap-4 tablet:gap-7 overflow-x-auto pt-1.5 pb-2 scrollbar-hide -mx-4 px-4 justify-start desktop:justify-center">
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="group flex flex-col items-center gap-2 shrink-0"
                >
                  <span
                    className={`flex h-14 w-14 tablet:h-16 tablet:w-16 items-center justify-center rounded-2xl transition-all ${
                      active
                        ? "bg-primary/10 ring-1 ring-primary/40"
                        : "bg-secondary group-hover:bg-secondary/70"
                    }`}
                  >
                    {cat.icon && (
                      <cat.icon
                        className={`h-6 w-6 tablet:h-7 tablet:w-7 transition-colors ${
                          active ? "text-primary" : "text-foreground/50 group-hover:text-foreground/70"
                        }`}
                        strokeWidth={1.8}
                      />
                    )}
                  </span>
                  <span
                    className={`text-xs tablet:text-sm whitespace-nowrap transition-colors ${
                      active ? "font-bold text-foreground" : "font-medium text-muted-foreground"
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Recommended Books */}
        <section className="container px-4 mt-8 tablet:mt-10">
          <div className="flex items-end justify-between mb-4 tablet:mb-6">
            <div>
              <h2 className="text-xl tablet:text-2xl font-bold">추천 전자책</h2>
              <p className="text-xs tablet:text-sm text-muted-foreground mt-1">
                전문가들이 직접 집필한 하이클래스 지식 콘텐츠
              </p>
            </div>
            <Link
              to="/store"
              className="text-xs tablet:text-sm font-medium text-primary hover:underline flex items-center gap-1 shrink-0"
            >
              전체보기 <ArrowRight className="h-3.5 w-3.5 tablet:h-4 tablet:w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-3 tablet:gap-4 desktop:gap-6">
            {filteredBooks.slice(0, 8).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="bg-secondary/60 py-10 tablet:py-16 mt-14 tablet:mt-20">
          <div className="container px-4">
            <div className="flex flex-col desktop:flex-row desktop:items-start gap-6 desktop:gap-10">
              {/* Left: title */}
              <div className="desktop:w-64 shrink-0">
                <h2 className="text-xl tablet:text-2xl font-bold">디하북스 수강생 후기</h2>
                <p className="text-xs tablet:text-sm text-muted-foreground mt-2 leading-relaxed">
                  나도 할 수 있을까 고민이 된다면{"\n"}수강생들의 성공 경험을 들어보세요.
                </p>
                {/* Carousel controls */}
                <div className="hidden desktop:flex items-center gap-2 mt-5">
                  <button
                    type="button"
                    aria-label="이전 후기"
                    onClick={() => scrollReviews("left")}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-secondary transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="다음 후기"
                    onClick={() => scrollReviews("right")}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-secondary transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right: review cards */}
              <div className="flex-1 min-w-0">
                <div
                  ref={reviewsRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide -mx-4 px-4 desktop:mx-0 desktop:px-0"
                >
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="min-w-[280px] tablet:min-w-[300px] max-w-[320px] flex-shrink-0 rounded-lg border border-border bg-background p-5 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-sm leading-snug mb-2">{review.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{review.content}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                            {review.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{review.author}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-star text-star" />
                              <span className="text-xs font-medium">{review.rating}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container px-4 my-14 tablet:my-20">
          <div
            className="relative rounded-xl tablet:rounded-2xl overflow-hidden p-6 tablet:p-10 desktop:p-16"
            style={{ backgroundImage: `url(${ctaBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="relative z-10">
              <h2 className="text-xl tablet:text-2xl desktop:text-3xl font-bold text-background">
                디하북스가 처음이라면
              </h2>
              <a
                href="https://cafe.naver.com/dinohighclass"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 tablet:mt-4 px-5 tablet:px-6 py-2.5 tablet:py-3 rounded-lg bg-background/20 text-background text-sm font-semibold hover:bg-background/30 transition-colors border border-background/30"
              >
                더 알아보기 <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
