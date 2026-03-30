import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
  badge?: "BEST" | "NEW" | "TOP";
  pageCount?: number;
}

interface BookCardProps {
  book: Book;
}

const badgeStyles: Record<string, string> = {
  BEST: "bg-primary text-primary-foreground",
  NEW: "bg-foreground text-background",
  TOP: "bg-primary text-primary-foreground",
};

const BookCard = ({ book }: BookCardProps) => {
  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : null;

  return (
    <Link to={`/book/${book.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg tablet:rounded-xl bg-secondary aspect-[4/3]">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {book.badge && (
          <span
            className={`absolute top-2 left-2 tablet:top-3 tablet:left-3 px-2 py-0.5 tablet:px-2.5 tablet:py-1 text-[10px] tablet:text-xs font-bold rounded-md ${badgeStyles[book.badge]}`}
          >
            {book.badge}
          </span>
        )}
        {book.pageCount && (
          <span className="absolute bottom-2 right-2 tablet:bottom-3 tablet:right-3 px-1.5 py-0.5 text-[10px] tablet:text-xs font-medium bg-foreground/70 text-background rounded">
            {book.pageCount}P
          </span>
        )}
      </div>
      <div className="mt-2 tablet:mt-3 space-y-0.5 tablet:space-y-1">
        <span className="text-[10px] tablet:text-xs font-medium text-primary">{book.category}</span>
        <h3 className="text-xs tablet:text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-[10px] tablet:text-xs text-muted-foreground">{book.author}</p>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 tablet:h-3.5 tablet:w-3.5 fill-star text-star" />
          <span className="text-[10px] tablet:text-xs font-medium">{book.rating}</span>
          <span className="text-[10px] tablet:text-xs text-muted-foreground">({book.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1.5 tablet:gap-2 flex-wrap">
          {discount && (
            <span className="text-[10px] tablet:text-xs font-bold text-primary">{discount}%</span>
          )}
          {book.originalPrice && (
            <span className="text-[10px] tablet:text-xs text-muted-foreground line-through">
              {book.originalPrice.toLocaleString()}원
            </span>
          )}
          <span className="text-xs tablet:text-sm font-bold">{book.price.toLocaleString()}원</span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
