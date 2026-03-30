import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left - Branding */}
        <div className="hidden tablet:flex flex-1 flex-col justify-between p-10 desktop:p-16 bg-primary text-primary-foreground">
          <Link to="/" className="text-sm font-medium flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            ← BACK TO STORE
          </Link>
          <div className="max-w-md">
            <h1 className="text-3xl desktop:text-4xl font-black leading-tight">
              지식을 자산으로
              <br />
              바꾸는 첫 걸음
            </h1>
            <p className="mt-4 text-sm opacity-80 leading-relaxed">
              단 1분 만에 회원가입하고
              <br />
              당신만의 디지털 수익 자동화를 구축하세요.
            </p>
          </div>

          {/* Testimonial */}
          <div className="rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 p-5 max-w-md">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-star text-star" />
              ))}
              <span className="text-sm font-medium ml-1">4.9/5.0</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              "작가로 등록한 지 일주일 만에 첫 판매가 일어났습니다. 시스템이 정말 직관적이에요."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="h-9 w-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">
                H
              </div>
              <div>
                <p className="text-sm font-medium">하이클래스 제이</p>
                <p className="text-xs opacity-60">POWER AUTHOR</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="flex-1 flex flex-col justify-center px-6 tablet:px-16 desktop:px-24 py-10">
          <div className="max-w-md mx-auto w-full">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold mb-8">
              D
            </div>

            <h2 className="text-3xl font-black mb-2">회원가입</h2>
            <p className="text-muted-foreground text-sm mb-10">
              디하북스의 멤버가 되어 성장을 시작하세요.
            </p>

            {/* Kakao Signup Button */}
            <Button
              className="w-full h-14 rounded-xl bg-kakao text-kakao-foreground hover:bg-kakao/90 text-base font-semibold"
              onClick={() => {/* Kakao OAuth */}}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.8 5.117 4.512 6.482-.154.567-.991 3.647-1.024 3.876 0 0-.02.168.089.233.109.065.237.03.237.03.313-.044 3.622-2.37 4.194-2.77.637.09 1.296.138 1.992.138 5.523 0 10-3.463 10-7.691S17.523 3 12 3z"/>
              </svg>
              카카오로 시작하기
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
              가입 시 <Link to="/terms" className="underline">이용약관</Link> 및{" "}
              <Link to="/privacy" className="underline">개인정보 처리방침</Link>에 동의합니다.
            </p>

            <p className="text-center mt-8 text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                로그인 하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
