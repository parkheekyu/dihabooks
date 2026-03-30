import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowRight, Star } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { sampleBooks } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
  const { wishlist, toggleWish } = useWishlist();
  const { isLoggedIn } = useAuth();

  const wishedBooks = sampleBooks.filter((b) => wishlist.includes(b.id));
  const total = wishedBooks.reduce((sum, b) => sum + b.price, 0);
  const totalOriginal = wishedBooks.reduce((sum, b) => sum + (b.originalPrice || b.price), 0);
  const discount = totalOriginal - total;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-4 tablet:py-8">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-xl tablet:text-2xl font-bold">찜 목록</h1>
          {isLoggedIn && wishedBooks.length > 0 && (
            <span className="text-sm text-muted-foreground">({wishedBooks.length})</span>
          )}
        </div>

        {!isLoggedIn ? (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">로그인 후 이용해주세요</p>
            <Link to="/login" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
              로그인하기
            </Link>
          </div>
        ) : wishedBooks.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">찜한 전자책이 없습니다</p>
            <Link to="/store">
              <Button variant="outline" className="mt-4 rounded-full gap-2">
                스토어 둘러보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col desktop:flex-row gap-6">
            {/* Items */}
            <div className="flex-1 space-y-3">
              {wishedBooks.map(book => (
                <div key={book.id} className="flex gap-3 tablet:gap-4 rounded-xl border border-border bg-background p-3 tablet:p-4">
                  <Link to={`/book/${book.id}`}>
                    <img src={book.image} alt="" className="w-16 h-22 tablet:w-20 tablet:h-28 rounded-lg object-cover shrink-0" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link to={`/book/${book.id}`} className="hover:underline">
                        <p className="text-sm font-medium line-clamp-2">{book.title}</p>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{book.rating}</span>
                        <span className="text-xs text-muted-foreground">({book.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm tablet:text-base font-bold text-primary">₩{book.price.toLocaleString()}</p>
                        {book.originalPrice && book.originalPrice > book.price && (
                          <p className="text-xs text-muted-foreground line-through">₩{book.originalPrice.toLocaleString()}</p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleWish(book.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="hidden desktop:block desktop:w-80 shrink-0">
              <div className="rounded-xl border border-border bg-background p-5 sticky top-24">
                <h3 className="font-bold text-sm mb-4">결제 요약</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">상품 금액</span>
                    <span>₩{totalOriginal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">할인</span>
                      <span className="text-green-600">-₩{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="h-px bg-border my-3" />
                  <div className="flex justify-between font-bold">
                    <span>총 결제 금액</span>
                    <span className="text-primary text-lg">₩{total.toLocaleString()}</span>
                  </div>
                </div>
                <Button className="w-full rounded-md bg-foreground text-background hover:bg-foreground/90" size="lg">
                  전체 구매하기
                </Button>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  결제 시 이용약관에 동의하는 것으로 간주됩니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile fixed bottom bar */}
        {isLoggedIn && wishedBooks.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 desktop:hidden border-t border-border bg-background p-4 safe-bottom z-40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">총 {wishedBooks.length}건</span>
              <span className="font-bold text-primary">₩{total.toLocaleString()}</span>
            </div>
            <Button className="w-full rounded-full" size="lg">
              전체 구매하기
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
