import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
        <section className="relative overflow-hidden bg-secondary">
          <div className="container">
            <div className="relative aspect-[2/1] tablet:aspect-[3/1] overflow-hidden rounded-2xl my-6">
              {heroSlides.map((slide, i) => (
                <img
                  key={slide.id}
                  src={slide.image}
                  alt=""
                  width={1200}
                  height={600}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    i === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentSlide ? "bg-background w-6" : "bg-background/50"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="container mt-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Recommended Books */}
        <section className="container mt-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">추천 전자책</h2>
              <p className="text-sm text-muted-foreground mt-1">
                전문가들이 직접 집필한 하이클래스 지식 콘텐츠
              </p>
            </div>
            <Link
              to="/store"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              전체보기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4 tablet:gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="container mt-20 mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">디하북스 수강생 후기</h2>
            <p className="text-sm text-muted-foreground mt-1">
              나도 할 수 있을까 고민이 되신다면 수강생들의 생생 경험을 들어보세요.
            </p>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-sm leading-snug mb-2">{review.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{review.content}</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold">
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
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mb-20">
          <div
            className="relative rounded-2xl overflow-hidden p-10 tablet:p-16"
            style={{ backgroundImage: `url(${ctaBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="relative z-10">
              <h2 className="text-2xl tablet:text-3xl font-bold text-background">
                디하북스가 처음이라면
              </h2>
              <Link
                to="/store"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-lg bg-background/20 text-background text-sm font-semibold hover:bg-background/30 transition-colors border border-background/30"
              >
                더 알아보기 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
