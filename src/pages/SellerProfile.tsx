import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, X, Edit, Briefcase, GraduationCap, Award, Wrench, FileText, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SellerProfile = () => {
  const { user, sellerProfile, updateSellerProfile } = useAuth();
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <div className="container px-4 py-6 tablet:py-10 max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src={user?.profileImage}
              alt=""
              className="h-16 w-16 tablet:h-20 tablet:w-20 rounded-full object-cover border-2 border-border"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{user?.name}</h1>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="text-xs h-7 rounded-full">편집</Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 desktop:grid-cols-5 gap-6">
            {/* Left Column */}
            <div className="desktop:col-span-3 space-y-6">
              {/* 활동 정보 */}
              <section className="rounded-xl border border-border bg-background p-5">
                <h2 className="font-bold text-sm mb-4">활동 정보</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">총 작업 수</p>
                    <p className="text-2xl font-bold mt-1">0개</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">만족도</p>
                    <p className="text-2xl font-bold mt-1">0%</p>
                  </div>
                </div>
              </section>

              {/* 경력 사항 */}
              <section className="rounded-xl border border-border bg-background p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-sm flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> 경력 사항
                  </h2>
                  <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                    <Plus className="h-3 w-3" /> 총 경력 입력
                  </Button>
                </div>
                <p className="text-sm font-medium mb-3">총 4년</p>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center justify-between">
                    상세 경력
                    <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                      <Plus className="h-3 w-3" /> 추가하기
                    </Button>
                  </h3>
                  {careers.map((c) => (
                    <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm">• {c.title}</p>
                        <p className="text-xs text-muted-foreground ml-3">{c.duration}</p>
                      </div>
                      <button
                        onClick={() => setCareers(careers.filter(x => x.id !== c.id))}
                        className="p-1"
                      >
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* 학력 */}
              <section className="rounded-xl border border-border bg-background p-5">
                <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
                  <GraduationCap className="h-4 w-4" /> 학력
                </h2>
                <div className="border border-dashed border-border rounded-lg p-6 text-center">
                  <Plus className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">간단한 정보로 전문성을 보여주세요.</p>
                </div>
              </section>

              {/* 인증·수상·자격증 */}
              <section className="rounded-xl border border-border bg-background p-5">
                <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
                  <Award className="h-4 w-4" /> 인증·수상·자격증
                </h2>
                <div className="border border-dashed border-border rounded-lg p-6 text-center">
                  <Plus className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">작은 수상이나 자격증도 좋아요.</p>
                </div>
              </section>

              {/* 전문분야·상세분야 */}
              <section className="rounded-xl border border-border bg-background p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-sm">전문분야·상세분야 <span className="text-primary text-xs">필수</span></h2>
                  <Button variant="ghost" size="sm" className="text-xs h-7">편집</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary">{s}</span>
                  ))}
                </div>
              </section>

              {/* 보유 기술 */}
              <section className="rounded-xl border border-border bg-background p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-sm flex items-center gap-2">
                    <Wrench className="h-4 w-4" /> 보유 기술 <span className="text-primary text-xs">필수</span>
                  </h2>
                  <Button variant="ghost" size="sm" className="text-xs h-7">편집</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary">{s}</span>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="desktop:col-span-2 space-y-6">
              {/* 소개 */}
              <section className="rounded-xl border border-border bg-background p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-sm">소개 <span className="text-primary text-xs">필수</span></h2>
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
              </section>

              {/* 포트폴리오 */}
              <section className="rounded-xl border border-border bg-background p-5">
                <h2 className="font-bold text-sm mb-4">포트폴리오</h2>
                <div className="border border-dashed border-border rounded-lg p-8 text-center">
                  <FileText className="h-8 w-8 mx-auto text-primary/40 mb-3" />
                  <p className="text-sm font-medium">작업물로 나의 실력을 보여주세요</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    작은 프로젝트라도 괜찮아요.
                    <br />
                    완성한 작업 중 자신있는 것부터 올려보세요.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4 text-xs rounded-full">
                    포트폴리오 등록하기 →
                  </Button>
                </div>
              </section>

              {/* 서비스 */}
              <section className="rounded-xl border border-border bg-background p-5">
                <h2 className="font-bold text-sm mb-4">서비스</h2>
                <div className="border border-dashed border-border rounded-lg p-8 text-center">
                  <Rocket className="h-8 w-8 mx-auto text-primary/40 mb-3" />
                  <p className="text-sm font-medium">나의 전자책을 판매해 보세요</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    회원들이 전자책을 찾고 있어요
                  </p>
                  <Button variant="outline" size="sm" className="mt-4 text-xs rounded-full">
                    전자책 등록하기 →
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerProfile;
