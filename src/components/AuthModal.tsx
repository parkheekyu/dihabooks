import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth, type Gender } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/constants";

const AGE_GROUPS = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

const AuthModal = () => {
  const { authOpen, closeAuth, login, needsOnboarding, completeOnboarding } = useAuth();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [ageGroup, setAgeGroup] = useState("");

  const ready =
    name.trim().length > 0 && nickname.trim().length > 0 && gender !== "" && ageGroup !== "";

  const submit = () => {
    if (!ready) return;
    completeOnboarding({ name: name.trim(), nickname: nickname.trim(), gender, ageGroup });
    setName(""); setNickname(""); setGender(""); setAgeGroup("");
  };

  return (
    <Dialog
      open={authOpen}
      // 온보딩은 필수 입력이라 바깥 클릭·ESC로 닫히지 않게 한다.
      onOpenChange={(open) => { if (!open && !needsOnboarding) closeAuth(); }}
    >
      <DialogContent
        className={`sm:max-w-[420px] rounded-2xl p-0 overflow-hidden border-0 gap-0 ${
          // 온보딩 중에는 기본 닫기(X) 버튼도 감춘다.
          needsOnboarding ? "[&>button.absolute]:hidden" : ""
        }`}
        onInteractOutside={(e) => needsOnboarding && e.preventDefault()}
        onEscapeKeyDown={(e) => needsOnboarding && e.preventDefault()}
      >
        <DialogTitle className="sr-only">
          {needsOnboarding ? "추가 정보 입력" : "디하북스 로그인"}
        </DialogTitle>

        <div className="px-7 pt-11 pb-9">
          <img
            src={asset("/brand/dihabooks-logo-kr.png")}
            alt="디하북스"
            className="h-7 w-auto mx-auto"
          />
          <div className="mt-6 border-t border-border/60" />

          {needsOnboarding ? (
            /* ── 2단계: 첫 로그인 추가 정보 ── */
            <div className="mt-7 space-y-5">
              <div className="text-center">
                <p className="text-[15px] font-bold">가입을 완료해주세요</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  서비스 이용을 위해 아래 정보가 필요합니다.
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ob-name" className="text-xs font-semibold">
                  이름 (실명) <span className="text-destructive">*</span>
                </label>
                <Input
                  id="ob-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="실명"
                  autoComplete="name"
                  className="text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  결제·환불 확인용으로만 쓰이며 다른 회원에게 보이지 않습니다.
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ob-nickname" className="text-xs font-semibold">
                  닉네임 <span className="text-destructive">*</span>
                </label>
                <Input
                  id="ob-nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="사용하실 닉네임"
                  className="text-sm"
                />
                <p className="text-[11px] text-primary">디하클 카페 닉네임과 일치시켜 주세요</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold">
                  성별 <span className="text-destructive">*</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {([["male", "남성"], ["female", "여성"]] as const).map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setGender(v)}
                      className={`h-10 rounded-md border text-sm transition-colors ${
                        gender === v
                          ? "border-primary bg-primary/5 font-semibold text-primary"
                          : "border-input text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold">
                  나이 <span className="text-destructive">*</span>
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {AGE_GROUPS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAgeGroup(a)}
                      className={`h-10 rounded-md border text-sm transition-colors ${
                        ageGroup === a
                          ? "border-primary bg-primary/5 font-semibold text-primary"
                          : "border-input text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl text-sm font-bold"
                disabled={!ready}
                onClick={submit}
              >
                디하북스 시작하기
              </Button>
            </div>
          ) : (
            /* ── 1단계: 카카오 로그인만 ── */
            <>
              <button
                type="button"
                onClick={login}
                className="mt-7 w-full h-14 rounded-xl bg-kakao text-kakao-foreground font-bold text-[15px] flex items-center justify-center gap-2 hover:brightness-95 active:brightness-90 transition"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.8 5.117 4.512 6.482-.154.567-.991 3.647-1.024 3.876 0 0-.02.168.089.233.109.065.237.03.237.03.313-.044 3.622-2.37 4.194-2.77.637.09 1.296.138 1.992.138 5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
                </svg>
                카카오 로그인
              </button>

              <p className="mt-8 text-[11px] text-center text-muted-foreground/80 leading-relaxed">
                가입 시 <span className="underline underline-offset-2">이용약관</span> 및{" "}
                <span className="underline underline-offset-2">개인정보처리방침</span>에<br className="tablet:hidden" /> 동의하게 됩니다.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
