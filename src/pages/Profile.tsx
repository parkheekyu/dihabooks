import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, User, LogOut, BookOpen, Settings, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/AccountSidebar";

const Profile = () => {
  const { user, isLoggedIn, role, logout, toggleRole } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  // Redirect to edit page (profile page is now the account settings hub)
  navigate("/profile/edit");
  return null;
};

export default Profile;
