import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Split layout */}
      <div className="flex flex-1">
        {/* Left - Branding */}
        <div className="hidden tablet:flex flex-1 flex-col justify-between p-10 desktop:p-16 bg-primary text-primary-foreground">
          <Link to="/" className="text-sm font-medium flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            ← BACK TO STORE
          </Link>
          <div className="max-w-md">
            <h1 className="text-3xl desktop:text-4xl font-black leading-tight">
              다시, 당신의
              <br />
              비상을 시작할 시간
            </h1>
            <p className="mt-4 text-sm opacity-80 leading-relaxed">
              디하북스는 상위 1% 노마드들을 위한
              <br />
              검증된 전자책 플랫폼입니다.
            </p>
          </div>

          {/* Testimonial */}
          <div className="rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 p-5 max-w-md">
            <p className="text-sm leading-relaxed opacity-90">
              "이곳에서 배운 제휴마케팅 전략 덕분에 퇴사 후 첫 달 수익 500만원을 달성했습니다."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="h-9 w-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">
                노
              </div>
              <div>
                <p className="text-sm font-medium">노마드 앤드류</p>
                <p className="text-xs opacity-60">VERIFIED MEMBER</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="flex-1 flex flex-col justify-center px-6 tablet:px-16 desktop:px-24 py-10">
          <div className="max-w-md mx-auto w-full">
            {/* Logo */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold mb-8">
              D
            </div>

            <h2 className="text-3xl font-black mb-2">로그인</h2>
            <p className="text-muted-foreground text-sm mb-10">
              서비스 이용을 위해 로그인이 필요합니다.
            </p>

            {/* Kakao Login Button */}
            <Button
              className="w-full h-14 rounded-xl bg-kakao text-kakao-foreground hover:bg-kakao/90 text-base font-semibold"
              onClick={() => {/* Kakao OAuth */}}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.8 5.117 4.512 6.482-.154.567-.991 3.647-1.024 3.876 0 0-.02.168.089.233.109.065.237.03.237.03.313-.044 3.622-2.37 4.194-2.77.637.09 1.296.138 1.992.138 5.523 0 10-3.463 10-7.691S17.523 3 12 3z"/>
              </svg>
              카카오로 로그인
            </Button>

            <p className="text-center mt-8 text-sm text-muted-foreground">
              아직 멤버가 아니신가요?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                회원가입 하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
