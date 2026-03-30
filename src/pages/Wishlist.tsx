import { Link } from "react-router-dom";
import { ChevronLeft, Heart, Trash2 } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { sampleBooks } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";

const Wishlist = () => {
  const { wishlist, toggleWish } = useWishlist();
  const { isLoggedIn } = useAuth();

  const wishedBooks = sampleBooks.filter((b) => wishlist.includes(b.id));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-6 tablet:py-10">
        <h1 className="text-xl tablet:text-2xl font-bold mb-6">찜 목록</h1>

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
            <p className="text-muted-foreground">찜한 전자책이 없습니다</p>
            <Link to="/store" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
              스토어 둘러보기
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">{wishedBooks.length}권의 전자책</p>
            <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4 tablet:gap-6">
              {wishedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
