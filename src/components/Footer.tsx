import { Link } from "react-router-dom";
import { asset } from "@/lib/constants";

const MEDIATION_NOTICE =
  "디하북스는 통신판매중개자로서 중개하는 거래에 대하여 책임을 부담하지 않고, 모든 판매에 대한 책임은 각 작가에게 있습니다.";

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
              <p>문의: 070-808-2422</p>
              {/* 통신판매중개자 고지 — 모든 화면에서 문의 바로 아래에 둔다. */}
              <p className="!mt-5 text-white/40 [word-break:keep-all]">{MEDIATION_NOTICE}</p>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-[11px] tablet:text-xs font-semibold tracking-widest uppercase text-white/70">
              Support
            </h4>
            <ul className="space-y-2 text-xs tablet:text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">1:1 문의하기</Link></li>
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
              <li><Link to="/review-policy" className="hover:text-white transition-colors">후기 정책</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 tablet:mt-10 pt-4 tablet:pt-6 border-t border-white/10 space-y-2 text-[11px] tablet:text-xs text-white/40">
          <p>© 2026 DIHABOOKS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
