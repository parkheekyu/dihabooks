import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AdminSettingsProps {
  view: "general" | "seo" | "header";
}

const AdminSettings = ({ view }: AdminSettingsProps) => {
  if (view === "seo") return <SeoSettings />;
  if (view === "header") return <HeaderSettings />;
  return <GeneralSettings />;
};

const GeneralSettings = () => (
  <div className="space-y-6 max-w-2xl">
    <div className="rounded-xl border border-border bg-background p-5 space-y-5">
      <h3 className="font-bold text-sm">기본 설정</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm">사이트 이름</Label>
          <Input defaultValue="디하북스" className="mt-1.5 rounded-lg" />
        </div>
        <div>
          <Label className="text-sm">사이트 URL</Label>
          <Input defaultValue="https://dihabooks.com" className="mt-1.5 rounded-lg" />
        </div>
        <div>
          <Label className="text-sm">관리자 이메일</Label>
          <Input defaultValue="admin@dihabooks.com" className="mt-1.5 rounded-lg" />
        </div>
        <div>
          <Label className="text-sm">사이트 설명</Label>
          <Textarea defaultValue="디하북스 - 전문가의 노하우를 전자책으로 만나보세요." className="mt-1.5 rounded-lg" rows={3} />
        </div>
      </div>
    </div>

    <div className="rounded-xl border border-border bg-background p-5 space-y-5">
      <h3 className="font-bold text-sm">기능 설정</h3>
      <div className="space-y-4">
        {[
          { label: "회원가입 허용", desc: "새로운 회원 가입을 허용합니다.", checked: true },
          { label: "리뷰 기능", desc: "전자책에 리뷰/평점 기능을 사용합니다.", checked: true },
          { label: "쿠폰 기능", desc: "쿠폰 발급 및 사용 기능을 활성화합니다.", checked: true },
          { label: "유지보수 모드", desc: "사이트를 일시적으로 유지보수 모드로 전환합니다.", checked: false },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Switch defaultChecked={item.checked} />
          </div>
        ))}
      </div>
    </div>

    <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-lg">변경 사항 저장</Button>
  </div>
);

const SeoSettings = () => (
  <div className="space-y-6 max-w-2xl">
    <div className="rounded-xl border border-border bg-background p-5 space-y-5">
      <h3 className="font-bold text-sm">SEO 설정</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm">메타 타이틀</Label>
          <Input defaultValue="디하북스 | 전문가의 전자책 마켓플레이스" className="mt-1.5 rounded-lg" />
          <p className="text-xs text-muted-foreground mt-1">60자 이내 권장</p>
        </div>
        <div>
          <Label className="text-sm">메타 설명</Label>
          <Textarea defaultValue="유튜브, 인스타그램, AI 자동화 등 전문가의 노하우를 전자책으로 만나보세요. 디하북스에서 시작하세요." className="mt-1.5 rounded-lg" rows={3} />
          <p className="text-xs text-muted-foreground mt-1">160자 이내 권장</p>
        </div>
        <div>
          <Label className="text-sm">OG 이미지 URL</Label>
          <Input defaultValue="" placeholder="https://..." className="mt-1.5 rounded-lg" />
        </div>
        <div>
          <Label className="text-sm">Google Analytics 추적 ID</Label>
          <Input defaultValue="" placeholder="G-XXXXXXXXXX" className="mt-1.5 rounded-lg" />
        </div>
        <div>
          <Label className="text-sm">네이버 웹마스터 인증 코드</Label>
          <Input defaultValue="" placeholder="인증 메타태그 content 값" className="mt-1.5 rounded-lg" />
        </div>
      </div>
    </div>
    <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-lg">변경 사항 저장</Button>
  </div>
);

const HeaderSettings = () => (
  <div className="space-y-6 max-w-2xl">
    <div className="rounded-xl border border-border bg-background p-5 space-y-5">
      <h3 className="font-bold text-sm">헤더 설정</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm">로고 텍스트</Label>
          <Input defaultValue="DIHABOOKS" className="mt-1.5 rounded-lg" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">검색바 표시</p>
            <p className="text-xs text-muted-foreground">헤더에 검색바를 표시합니다.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">카테고리 네비게이션</p>
            <p className="text-xs text-muted-foreground">헤더 하단에 카테고리 메뉴를 표시합니다.</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>

    <div className="rounded-xl border border-border bg-background p-5 space-y-5">
      <h3 className="font-bold text-sm">푸터 설정</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm">회사명</Label>
          <Input defaultValue="디하북스" className="mt-1.5 rounded-lg" />
        </div>
        <div>
          <Label className="text-sm">고객센터 이메일</Label>
          <Input defaultValue="help@dihabooks.com" className="mt-1.5 rounded-lg" />
        </div>
        <div>
          <Label className="text-sm">카카오톡 상담 링크</Label>
          <Input defaultValue="" placeholder="https://pf.kakao.com/..." className="mt-1.5 rounded-lg" />
        </div>
        <div>
          <Label className="text-sm">사업자등록번호</Label>
          <Input defaultValue="" placeholder="000-00-00000" className="mt-1.5 rounded-lg" />
        </div>
      </div>
    </div>
    <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-lg">변경 사항 저장</Button>
  </div>
);

export default AdminSettings;
