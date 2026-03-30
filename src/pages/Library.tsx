import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/data/mockData";

const Library = () => {
  // Mock purchased books (first 3)
  const purchasedBooks = sampleBooks.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> 메인으로
          </Link>
          <h1 className="text-xl font-bold">내 서재</h1>
          <div className="w-8 h-8 rounded-full bg-secondary" />
        </div>

        <div className="flex flex-col desktop:flex-row gap-8">
          {/* Profile Card */}
          <div className="shrink-0">
            <div className="rounded-2xl border border-border p-6 desktop:w-72">
              <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center text-2xl mb-4">
                👑
              </div>
              <h2 className="text-lg font-bold">닉네임님</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">NOMAD EXPLORER</p>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">보유 전자책</span>
                  <span className="font-bold">{purchasedBooks.length}권</span>
                </div>
              </div>
            </div>
          </div>

          {/* Books */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">보유 중인 전자책</h2>
              <p className="text-sm text-muted-foreground">
                구매한 모든 콘텐츠는 평생 소장 가능합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
              {purchasedBooks.map((book) => (
                <div key={book.id} className="rounded-2xl border border-border overflow-hidden">
                  <div className="aspect-[4/3] bg-secondary">
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-bold leading-snug line-clamp-2">{book.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">구매완료</span>
                      <span className="text-xs text-muted-foreground">웹 뷰어</span>
                    </div>
                    <Link to={`/reader/${book.id}`}>
                      <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold mt-2">
                        📖 웹에서 읽기
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Library;
