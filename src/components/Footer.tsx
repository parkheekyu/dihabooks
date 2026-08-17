import { Link } from "react-router-dom";
import { asset } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-footer-bg text-footer-foreground">
      <div className="container px-4 py-8 tablet:py-12">
        <div className="grid grid-cols-2 tablet:grid-cols-3 gap-6 tablet:gap-8">
          {/* Brand */}
          <div className="space-y-3 col-span-2 tablet:col-span-1">
            {/* White variant — the footer sits on --footer-bg (near-black). */}
            <img
              src={asset("/brand/dihabooks-logo-en-white.png")}
              alt="DIHABOOKS"
              className="h-6 tablet:h-7 w-auto"
            />
            <div className="text-[11px] tablet:text-xs leading-relaxed space-y-0.5">
              <p>상호: 디하북스 | 대표: 최주원</p>
              <p>사업자등록번호: 313-18-03233</p>
              <p>주소: 경기도 용인시 기흥구 서천동로 94-1, 502호(농서동)</p>
              <p>연락처: 031-8007-1222</p>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-[11px] tablet:text-xs font-semibold tracking-widest uppercase text-white/70">
              Support
            </h4>
            <ul className="space-y-2 text-xs tablet:text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/author-guide" className="hover:text-white transition-colors">작가 등록 가이드</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-[11px] tablet:text-xs font-semibold tracking-widest uppercase text-white/70">
              Legal
            </h4>
            <ul className="space-y-2 text-xs tablet:text-sm">
              <li><Link to="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
              <li><Link to="/privacy" className="font-semibold text-white hover:text-white/80 transition-colors">개인정보 처리방침</Link></li>
              <li><Link to="/refund" className="hover:text-white transition-colors">환불 정책</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 tablet:mt-10 pt-4 tablet:pt-6 border-t border-white/10 text-[11px] tablet:text-xs text-white/40">
          © 2026 DIHABOOKS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
