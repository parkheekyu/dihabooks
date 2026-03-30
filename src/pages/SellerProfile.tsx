import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Plus, X, Edit, Briefcase, GraduationCap, Award, Wrench, FileText, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/AccountSidebar";

const SellerProfile = () => {
  const { user, isLoggedIn, sellerProfile, updateSellerProfile } = useAuth();
  const [intro, setIntro] = useState(sellerProfile.intro);
  const [editingIntro, setEditingIntro] = useState(false);

  const [careers, setCareers] = useState([
    { id: "1", title: "프리랜서", duration: "3년 0개월" },
  ]);

  const [skills, setSkills] = useState([
    "인스타그램 관리", "키워드·검색 광고", "블로그 관리", "검색최적화·SEO",
  ]);

  const [specialties, setSpecialties] = useState([
    "퍼포먼스 마케팅", "마케팅 분석·전략",
  ]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-6 tablet:py-10">
          <div className="flex gap-10 max-w-5xl mx-auto">
            <AccountSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold mb-6 desktop:hidden">계정 설정</h1>
              <h2 className="hidden desktop:block text-lg font-bold mb-6">판매자 프로필 설정</h2>

              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <img
                  src={user?.profileImage}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover border border-border"
                />
                <div>
                  <p className="font-bold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {/* 소개 */}
              <div className="py-5 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">소개 <span className="text-destructive">*</span></h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 gap-1"
                    onClick={() => setEditingIntro(!editingIntro)}
                  >
                    <Edit className="h-3 w-3" /> 편집
                  </Button>
                </div>
                {editingIntro ? (
                  <div className="space-y-2">
                    <Textarea
                      value={intro}
                      onChange={(e) => setIntro(e.target.value)}
                      className="text-sm min-h-[80px]"
                    />
                    <Button size="sm" className="text-xs" onClick={() => { updateSellerProfile({ intro }); setEditingIntro(false); }}>저장</Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{intro}</p>
                )}
              </div>

              {/* 활동 정보 */}
              <div className="py-5 border-b border-border">
                <h3 className="text-sm font-semibold mb-3">활동 정보</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground">총 집필 수</p>
                    <p className="text-2xl font-bold mt-1">3권</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground">후기</p>
                    <p className="text-2xl font-bold mt-1">24개</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground">평점</p>
                    <p className="text-2xl font-bold mt-1">4.8 <span className="text-sm font-normal text-muted-foreground">/ 5.0</span></p>
                  </div>
                </div>
              </div>

              {/* 경력 사항 */}
              <div className="py-5 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4" /> 경력 사항</h3>
                  <Button variant="ghost" size="sm" className="text-xs h-7 gap-1"><Plus className="h-3 w-3" /> 추가</Button>
                </div>
                <p className="text-sm mb-2">총 4년</p>
                {careers.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm">• {c.title}</p>
                      <p className="text-xs text-muted-foreground ml-3">{c.duration}</p>
                    </div>
                    <button onClick={() => setCareers(careers.filter(x => x.id !== c.id))} className="p-1">
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 전문분야 */}
              <div className="py-5 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">전문분야 <span className="text-destructive">*</span></h3>
                  <Button variant="ghost" size="sm" className="text-xs h-7">편집</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary">{s}</span>
                  ))}
                </div>
              </div>

              {/* 보유 기술 */}
              <div className="py-5 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2"><Wrench className="h-4 w-4" /> 보유 기술 <span className="text-destructive">*</span></h3>
                  <Button variant="ghost" size="sm" className="text-xs h-7">편집</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary">{s}</span>
                  ))}
                </div>
              </div>

              {/* 학력 */}
              <div className="py-5 border-b border-border">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><GraduationCap className="h-4 w-4" /> 학력</h3>
                <div className="border border-dashed border-border rounded-lg p-6 text-center">
                  <Plus className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">간단한 정보로 전문성을 보여주세요.</p>
                </div>
              </div>

              {/* 인증·수상·자격증 */}
              <div className="py-5">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><Award className="h-4 w-4" /> 인증·수상·자격증</h3>
                <div className="border border-dashed border-border rounded-lg p-6 text-center">
                  <Plus className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">작은 수상이나 자격증도 좋아요.</p>
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
