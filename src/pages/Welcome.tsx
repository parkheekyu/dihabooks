import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/constants";

// 디자인팀이 통이미지 한 장으로 내려주는 소개 페이지.
// 교체할 때는 public/welcome/intro.png 를 같은 이름으로 덮어쓰면 된다.
const INTRO_IMAGE = asset("/welcome/intro.png");

// 원본 비율(860 x 4000). 이미지 로드 전에도 자리를 잡아 레이아웃이 튀지 않게 한다.
const INTRO_RATIO = "860 / 4000";

const Welcome = () => (
  <div className="min-h-screen flex flex-col">
    <Header />

    <main className="flex-1 bg-black">
      {/* 통이미지는 원본 폭(860px)을 넘겨 늘리지 않는다. */}
      <img
        src={INTRO_IMAGE}
        alt="디하북스 소개"
        width={860}
        height={4000}
        style={{ aspectRatio: INTRO_RATIO }}
        className="block w-full max-w-[860px] mx-auto h-auto"
      />

      <div className="bg-background">
        <div className="container px-4 py-10 tablet:py-14 text-center">
          <p className="text-sm tablet:text-base text-muted-foreground">
            지금 바로 나에게 맞는 전자책을 찾아보세요.
          </p>
          <Link to="/store" className="inline-block mt-4">
            <Button className="h-11 px-6 rounded-lg gap-2 text-sm font-semibold">
              전자책 스토어 둘러보기 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default Welcome;
