import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Camera, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_AVATAR } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/AccountSidebar";

const SellerProfile = () => {
  const { user, isLoggedIn, sellerProfile, updateSellerProfile } = useAuth();

  // Draft copy of the 작가 프로필 — committed to context on 저장.
  const [nickname, setNickname] = useState(sellerProfile.nickname);
  const [intro, setIntro] = useState(sellerProfile.intro);
  const [contactUrl, setContactUrl] = useState(sellerProfile.contactUrl);
  const [photo, setPhoto] = useState(sellerProfile.profileImage);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty =
    nickname !== sellerProfile.nickname ||
    intro !== sellerProfile.intro ||
    contactUrl !== sellerProfile.contactUrl ||
    photo !== sellerProfile.profileImage;

  // No upload backend in the demo, so preview straight off the local blob.
  // Revoke the previous one so repeated picks don't pile up.
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photo.startsWith("blob:")) URL.revokeObjectURL(photo);
    setPhoto(URL.createObjectURL(file));
    setSaved(false);
  };

  const handleSave = () => {
    updateSellerProfile({ nickname, intro, contactUrl, profileImage: photo });
    setSaved(true);
  };

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-6 tablet:py-10">
          <div className="flex flex-col desktop:flex-row gap-0 desktop:gap-10 max-w-5xl mx-auto">
            <AccountSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold mb-4 desktop:hidden">마이페이지</h1>
              <h2 className="hidden desktop:block text-lg font-bold mb-6">작가 프로필 설정</h2>

              {/* Profile Header */}
              <div className="flex flex-col items-center text-center gap-3 pb-5 border-b border-border tablet:flex-row tablet:text-left tablet:items-center tablet:gap-4 tablet:pb-6">
                <img
                  src={user?.profileImage}
                  alt=""
                  className="h-14 w-14 tablet:h-16 tablet:w-16 rounded-full object-cover border border-border"
                />
                <div>
                  <p className="font-bold text-sm tablet:text-base">{user?.name}</p>
                  <p className="text-xs tablet:text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {/* 작가 프로필 — 상품 페이지 하단 작가 소개에 그대로 노출 */}
              <div className="py-5 border-b border-border">
                <h3 className="text-sm font-semibold">작가 프로필 <span className="text-destructive">*</span></h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  여기서 설정한 내용이 상품 페이지 맨 아래 &lsquo;작가 소개&rsquo;에 그대로 표시됩니다.
                </p>

                {/* 프로필 사진 */}
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={photo || DEFAULT_AVATAR}
                    alt=""
                    className="h-20 w-20 rounded-full object-cover shrink-0"
                  />
                  <div className="space-y-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhoto}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => fileRef.current?.click()}>
                      <Camera className="h-3.5 w-3.5" /> 사진 {photo ? "변경" : "등록"}
                    </Button>
                    {photo && (
                      <button
                        onClick={() => { if (photo.startsWith("blob:")) URL.revokeObjectURL(photo); setPhoto(""); setSaved(false); }}
                        className="block text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        사진 제거
                      </button>
                    )}
                    <p className="text-[11px] text-muted-foreground">정사각형 이미지를 권장합니다.</p>
                  </div>
                </div>

                {/* 작가명 */}
                <div className="space-y-1.5 mb-4">
                  <label htmlFor="seller-nickname" className="text-xs font-semibold">작가명 (닉네임)</label>
                  <Input
                    id="seller-nickname"
                    value={nickname}
                    onChange={(e) => { setNickname(e.target.value); setSaved(false); }}
                    placeholder="독자에게 보여질 이름"
                    className="text-sm"
                  />
                </div>

                {/* 소개 */}
                <div className="space-y-1.5 mb-4">
                  <label htmlFor="seller-intro" className="text-xs font-semibold">소개글</label>
                  <Textarea
                    id="seller-intro"
                    value={intro}
                    onChange={(e) => { setIntro(e.target.value); setSaved(false); }}
                    placeholder="어떤 작가인지 2~3줄로 소개해주세요."
                    className="text-sm min-h-[80px]"
                  />
                </div>

                {/* 1:1 문의 링크 */}
                <div className="space-y-1.5 mb-4">
                  <label htmlFor="seller-contact" className="text-xs font-semibold">1:1 문의 링크</label>
                  <Input
                    id="seller-contact"
                    type="url"
                    value={contactUrl}
                    onChange={(e) => { setContactUrl(e.target.value); setSaved(false); }}
                    placeholder="https://open.kakao.com/o/..."
                    className="text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    오픈채팅, 폼 등 문의받을 주소입니다. 비워두면 문의 버튼이 나타나지 않습니다.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button size="sm" className="text-xs" onClick={handleSave} disabled={!dirty}>저장</Button>
                  {saved && !dirty && (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <Check className="h-3.5 w-3.5" /> 저장되었습니다
                    </span>
                  )}
                </div>
              </div>

              {/* 활동 정보 */}
              <div className="py-5">
                <h3 className="text-sm font-semibold mb-3">활동 정보</h3>
                <div className="grid grid-cols-3 gap-2 tablet:gap-3">
                  <div className="rounded-lg bg-secondary/50 p-3 tablet:p-4 text-center">
                    <p className="text-[11px] tablet:text-xs text-muted-foreground">총 집필 수</p>
                    <p className="text-xl tablet:text-2xl font-bold mt-0.5 tablet:mt-1">3권</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 tablet:p-4 text-center">
                    <p className="text-[11px] tablet:text-xs text-muted-foreground">후기</p>
                    <p className="text-xl tablet:text-2xl font-bold mt-0.5 tablet:mt-1">24개</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 tablet:p-4 text-center">
                    <p className="text-[11px] tablet:text-xs text-muted-foreground">평점</p>
                    <p className="text-xl tablet:text-2xl font-bold mt-0.5 tablet:mt-1">4.8 <span className="text-xs tablet:text-sm font-normal text-muted-foreground">/ 5.0</span></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerProfile;
