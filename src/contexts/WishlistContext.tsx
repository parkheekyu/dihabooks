import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface WishlistContextType {
  wishlist: string[];
  isWished: (bookId: string) => boolean;
  toggleWish: (bookId: string) => void;
  wishCount: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isWished: () => false,
  toggleWish: () => {},
  wishCount: 0,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const isWished = useCallback((bookId: string) => wishlist.includes(bookId), [wishlist]);

  const toggleWish = useCallback((bookId: string) => {
    setWishlist((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, isWished, toggleWish, wishCount: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};
