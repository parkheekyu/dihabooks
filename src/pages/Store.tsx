import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { categories, sampleBooks } from "@/data/mockData";

const Store = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredBooks = sampleBooks.filter((book) => {
    return (
      activeCategory === "all" ||
      book.category === categories.find((c) => c.id === activeCategory)?.label
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-4 tablet:py-8">
        {/* Title */}
        <div className="mb-6 tablet:mb-8">
          <h1 className="text-2xl tablet:text-3xl font-black">
            전자책<span className="text-gradient-primary">스토어</span>
          </h1>
          <p className="text-xs tablet:text-sm text-muted-foreground mt-1">
            {filteredBooks.length > 0
              ? `${filteredBooks.length}개의 프리미엄 지식이 당신을 기다리고 있습니다.`
              : "이 카테고리는 아직 준비 중입니다."}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden desktop:block w-56 shrink-0">
            <div className="sticky top-24 rounded-2xl border border-border p-5 space-y-1">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                카테고리
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
                      {cat.icon && <cat.icon className="h-4 w-4" />}
                      {cat.label}
                      {activeCategory === cat.id && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-primary-foreground" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Grid — min-w-0 overrides the flex item's default min-width:auto.
              Without it this column stretches to the category row's content
              width and the whole page scrolls sideways on mobile instead of
              the chip row scrolling on its own. */}
          <div className="flex-1 min-w-0">
            {/* Mobile categories */}
            <div className="desktop:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-4 px-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {cat.icon && <cat.icon className="h-3.5 w-3.5" />}
                  {cat.label}
                </button>
              ))}
            </div>

            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-3 gap-3 tablet:gap-4 desktop:gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              /* Keeps the column's footprint when a category has no books —
                 otherwise the grid collapses to zero height and the footer
                 jumps up the page. */
              <div className="flex min-h-[320px] tablet:min-h-[420px] flex-col items-center justify-center rounded-xl tablet:rounded-2xl border border-dashed border-border text-center text-muted-foreground px-4">
                <p className="text-base tablet:text-lg font-medium">해당 카테고리에 전자책이 없습니다.</p>
                <p className="text-xs tablet:text-sm mt-1">다른 카테고리를 선택해보세요.</p>
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
