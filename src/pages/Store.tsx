import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { categories, sampleBooks } from "@/data/mockData";

const priceRanges = [
  { id: "all", label: "전체" },
  { id: "under10k", label: "1만원 이하" },
  { id: "10k-30k", label: "1~3만원" },
  { id: "over30k", label: "3만원 이상" },
];

const Store = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePriceRange, setActivePriceRange] = useState("all");

  const filteredBooks = sampleBooks.filter((book) => {
    const catMatch =
      activeCategory === "all" ||
      book.category === categories.find((c) => c.id === activeCategory)?.label;

    let priceMatch = true;
    if (activePriceRange === "under10k") priceMatch = book.price <= 10000;
    else if (activePriceRange === "10k-30k") priceMatch = book.price > 10000 && book.price <= 30000;
    else if (activePriceRange === "over30k") priceMatch = book.price > 30000;

    return catMatch && priceMatch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            전자책<span className="text-gradient-primary">스토어</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sampleBooks.length}개의 프리미엄 지식이 당신을 기다리고 있습니다.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden desktop:block w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl border border-border p-6 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                  Categories
                </h3>
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          activeCategory === cat.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary text-foreground"
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        {cat.label}
                        {activeCategory === cat.id && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                  Price Range
                </h3>
                <ul className="space-y-2">
                  {priceRanges.map((range) => (
                    <li key={range.id}>
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                          type="radio"
                          name="price"
                          checked={activePriceRange === range.id}
                          onChange={() => setActivePriceRange(range.id)}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        {range.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Mobile category tabs */}
          <div className="desktop:hidden absolute left-0 right-0 -mt-2 mb-4">
            {/* Shown via responsive */}
          </div>

          {/* Grid */}
          <div className="flex-1">
            {/* Mobile categories */}
            <div className="desktop:hidden flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4 tablet:gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">해당 카테고리에 전자책이 없습니다.</p>
                <p className="text-sm mt-1">다른 카테고리를 선택해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Store;
