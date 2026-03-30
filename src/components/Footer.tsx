import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-footer-bg text-footer-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-black tracking-wide text-white">
              DIHABOOKS
            </h3>
            <p className="text-sm leading-relaxed">
              디지털 노마드의 성장을 돕는 프리미엄 지식 마켓플레이스.
              <br />
              당신의 소중한 경험이 누군가에게는 가장 큰 힘이 됩니다.
            </p>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white/70">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">1:1 문의하기</Link></li>
              <li><Link to="/author-guide" className="hover:text-white transition-colors">작가 등록 가이드</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white/70">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
              <li><Link to="/privacy" className="font-semibold text-white hover:text-white/80 transition-colors">개인정보 처리방침</Link></li>
              <li><Link to="/refund" className="hover:text-white transition-colors">환불 정책</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-white/40">
          © 2026 DIHABOOKS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
