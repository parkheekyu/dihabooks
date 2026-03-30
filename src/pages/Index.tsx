import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";

import BookCard from "@/components/BookCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, heroSlides, sampleBooks, reviews } from "@/data/mockData";
import ctaBg from "@/assets/cta-bg.jpg";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const filteredBooks =
    activeCategory === "all"
      ? sampleBooks
      : sampleBooks.filter((b) => b.category === categories.find(c => c.id === activeCategory)?.label);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Carousel */}
        <section className="relative overflow-hidden bg-background">
          <div className="relative aspect-[2/1] tablet:aspect-[5/2] desktop:aspect-[4/1] overflow-hidden">
            {heroSlides.map((slide, i) => (
              <img
                key={slide.id}
                src={slide.image}
                alt=""
                width={1920}
                height={600}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {/* Controls */}
            <div className="absolute bottom-3 tablet:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 tablet:gap-3">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlide ? "bg-background w-5 tablet:w-6" : "bg-background/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="container px-4 mt-6 tablet:mt-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 tablet:px-4 py-2 rounded-full text-xs tablet:text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.icon && <cat.icon className="h-3.5 w-3.5" />}
                {cat.label}
              </button>
            ))}
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
            {filteredBooks.map((book) => (
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
              </div>

              {/* Right: review cards */}
              <div className="flex-1 min-w-0">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 desktop:mx-0 desktop:px-0">
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
