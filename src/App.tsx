import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Store from "./pages/Store.tsx";
import BookDetail from "./pages/BookDetail.tsx";
import Library from "./pages/Library.tsx";
import Reader from "./pages/Reader.tsx";
import Cart from "./pages/Cart.tsx";
import InstructorDashboard from "./pages/InstructorDashboard.tsx";
import Profile from "./pages/Profile.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import BecomeSeller from "./pages/BecomeSeller.tsx";
import SellerProfile from "./pages/SellerProfile.tsx";
import NotFound from "./pages/NotFound.tsx";
import PurchaseHistory from "./pages/PurchaseHistory.tsx";
import FAQ from "./pages/FAQ.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <WishlistProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/store" element={<Store />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/library" element={<Library />} />
          <Route path="/reader/:id" element={<Reader />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/seller-profile" element={<SellerProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/purchases" element={<PurchaseHistory />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </WishlistProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
