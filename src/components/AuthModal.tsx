import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { TicketPercent, Check } from "lucide-react";
import { asset } from "@/lib/constants";

const benefits = [
  "첫 구매 할인쿠폰 즉시 지급",
  "신간·할인 소식 가장 먼저 받기",
  "구매한 전자책 평생 소장",
];

const AuthModal = () => {
  const { authOpen, closeAuth, login } = useAuth();

  return (
    <Dialog open={authOpen} onOpenChange={(open) => !open && closeAuth()}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl p-0 overflow-hidden border-0 gap-0">
        <DialogTitle className="sr-only">디하북스 로그인 · 회원가입</DialogTitle>

        <div className="px-7 pt-11 pb-9 text-center">
          {/* Logo */}
          <img
            src={asset("/brand/dihabooks-logo-kr.png")}
            alt="디하북스"
            className="h-7 w-auto mx-auto"
          />

          {/* Divider */}
          <div className="mt-6 border-t border-border/60" />

          {/* Tagline */}
          <div className="mt-7 flex items-center justify-center gap-3">
            <TicketPercent className="h-8 w-8 text-primary shrink-0" strokeWidth={1.8} />
            <p className="text-[15px] leading-snug text-left text-foreground">
              지금 가입하고
              <br />
              <span className="font-bold text-primary">첫 구매 할인쿠폰</span> 받으세요!
            </p>
          </div>

          {/* Kakao button */}
          <button
            type="button"
            onClick={login}
            className="mt-7 w-full h-14 rounded-xl bg-kakao text-kakao-foreground font-bold text-[15px] flex items-center justify-center gap-2 hover:brightness-95 active:brightness-90 transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.8 5.117 4.512 6.482-.154.567-.991 3.647-1.024 3.876 0 0-.02.168.089.233.109.065.237.03.237.03.313-.044 3.622-2.37 4.194-2.77.637.09 1.296.138 1.992.138 5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
            </svg>
            카카오로 3초만에 시작하기
          </button>

          {/* Benefits */}
          <ul className="mt-7 space-y-3 text-left">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          {/* Terms */}
          <p className="mt-8 text-[11px] text-muted-foreground/80 leading-relaxed">
            가입 시 <span className="underline underline-offset-2">이용약관</span> 및{" "}
            <span className="underline underline-offset-2">개인정보처리방침</span>에<br className="tablet:hidden" /> 동의하게 됩니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
