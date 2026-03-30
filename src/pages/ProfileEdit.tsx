import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

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
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="border-b border-border bg-background">
          <div className="container px-4 py-3 flex items-center gap-3 max-w-lg mx-auto">
            <button onClick={() => navigate("/profile")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-sm font-bold">프로필 수정</h1>
          </div>
        </div>

        <div className="container px-4 py-6 max-w-lg mx-auto space-y-6">
          {/* Profile image */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={profilePreview || "/placeholder.svg"}
                alt="프로필"
                className="h-24 w-24 rounded-full object-cover border-2 border-border"
              />
              <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">사진을 변경하려면 카메라 아이콘을 눌러주세요</p>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-border bg-background p-5 space-y-4">
            <div>
              <Label className="text-sm font-semibold">이름 <span className="text-destructive">*</span></Label>
              <Input
                className="mt-1.5"
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
              />
            </div>

            <div>
              <Label className="text-sm font-semibold">이메일</Label>
              <Input
                className="mt-1.5"
                value={user?.email || ""}
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">카카오 계정 이메일은 변경할 수 없습니다.</p>
            </div>

            <div>
              <Label className="text-sm font-semibold">연락처</Label>
              <Input
                className="mt-1.5"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-sm font-semibold">자기소개</Label>
              <Textarea
                className="mt-1.5 min-h-[100px]"
                placeholder="간단한 자기소개를 입력해주세요"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{bio.length} / 200</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => navigate("/profile")}>
              취소
            </Button>
            <Button className="flex-1 h-11 rounded-xl" onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileEdit;
