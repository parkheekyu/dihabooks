import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/AccountSidebar";
import { toast } from "sonner";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, role, toggleRole } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | null>(user?.profileImage || null);

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }
    toast.success("프로필이 수정되었습니다.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-6 tablet:py-10">
          <div className="flex gap-10 max-w-4xl mx-auto">
            <AccountSidebar />

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile title */}
              <h1 className="text-lg font-bold mb-6 desktop:hidden">계정 설정</h1>

              <h2 className="hidden desktop:block text-lg font-bold mb-6">내 정보</h2>

              {/* Profile image + name section */}
              <div className="flex items-start gap-5 pb-6 border-b border-border">
                <div className="relative shrink-0">
                  <img
                    src={profilePreview || "/placeholder.svg"}
                    alt="프로필"
                    className="h-20 w-20 rounded-full object-cover border border-border"
                  />
                  <label className="absolute bottom-0 right-0 p-1 rounded-full bg-background border border-border cursor-pointer hover:bg-secondary transition-colors">
                    <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                <div className="pt-1">
                  <p className="font-bold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <button
                    onClick={toggleRole}
                    className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                      role === "member" ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {role === "member" ? "멤버" : "판매자"}
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="py-6 space-y-5">
                <div className="flex flex-col tablet:flex-row tablet:items-start gap-2 tablet:gap-8">
                  <Label className="text-sm font-semibold tablet:w-28 tablet:pt-2.5 shrink-0">닉네임</Label>
                  <div className="flex-1">
                    <Input
                      placeholder="이름을 입력해주세요"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={20}
                    />
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex flex-col tablet:flex-row tablet:items-start gap-2 tablet:gap-8">
                  <Label className="text-sm font-semibold tablet:w-28 tablet:pt-2.5 shrink-0">이메일</Label>
                  <div className="flex-1">
                    <Input value={user?.email || ""} disabled />
                    <p className="text-xs text-muted-foreground mt-1.5">카카오 계정 이메일은 변경할 수 없습니다.</p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex flex-col tablet:flex-row tablet:items-start gap-2 tablet:gap-8">
                  <Label className="text-sm font-semibold tablet:w-28 tablet:pt-2.5 shrink-0">연락처</Label>
                  <div className="flex-1">
                    <Input
                      placeholder="010-0000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex flex-col tablet:flex-row tablet:items-start gap-2 tablet:gap-8">
                  <Label className="text-sm font-semibold tablet:w-28 tablet:pt-2.5 shrink-0">자기소개</Label>
                  <div className="flex-1">
                    <Textarea
                      className="min-h-[100px]"
                      placeholder="간단한 자기소개를 입력해주세요"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{bio.length} / 200</p>
                  </div>
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end pt-2 border-t border-border">
                <Button className="rounded-lg px-8 mt-4" onClick={handleSave}>
                  저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileEdit;
