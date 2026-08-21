import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import AuthModal from "@/components/AuthModal";
import Index from "./pages/Index.tsx";
import Welcome from "./pages/Welcome.tsx";
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
import Support from "./pages/Support.tsx";
import FAQ from "./pages/FAQ.tsx";
import EbookForm from "./pages/EbookForm.tsx";
import ProfileEdit from "./pages/ProfileEdit.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderComplete from "./pages/OrderComplete.tsx";

// file:// 로 열리는 오프라인 빌드에서는 history API 라우팅이 동작하지 않으므로
// 해시 라우팅으로 전환한다. 일반 빌드(base "/")는 기존대로 BrowserRouter.
const Router = import.meta.env.BASE_URL === "/" ? BrowserRouter : HashRouter;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <WishlistProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthModal />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/store" element={<Store />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/library" element={<Library />} />
          <Route path="/reader/:id" element={<Reader />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-complete" element={<OrderComplete />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/seller-profile" element={<SellerProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/purchases" element={<PurchaseHistory />} />
          
          <Route path="/support" element={<Support />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/instructor/ebook/new" element={<EbookForm />} />
          <Route path="/instructor/ebook/edit" element={<EbookForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
    </WishlistProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
