import { Link } from "react-router-dom";
import { asset } from "@/lib/constants";

/** 상품 페이지 푸터에 밝혀야 하는 판매자(작가) 정보. */
export type FooterSeller = {
  nickname: string;
  freelancer: boolean;
  businessName: string;
  representative: string;
  businessNumber: string;
  sellerPhone: string;
  sellerEmail: string;
};

const MEDIATION_NOTICE =
  "디하북스는 통신판매중개자로서 중개하는 거래에 대하여 책임을 부담하지 않고, 모든 판매에 대한 책임은 각 작가에게 있습니다.";

interface Props {
  /** 상품 페이지처럼 판매 주체가 정해진 화면에서만 넘긴다. */
  seller?: FooterSeller;
}

const Footer = ({ seller }: Props) => {
  // 사업자가 없으면 상호명 대신 닉네임을 쓰고 대표·사업자등록번호는 빼둔다.
  const sellerItems = seller
    ? [
        seller.freelancer ? seller.nickname : seller.businessName || seller.nickname,
        !seller.freelancer && seller.representative ? `대표 : ${seller.representative}` : "",
        !seller.freelancer && seller.businessNumber ? `사업자등록번호 : ${seller.businessNumber}` : "",
        seller.sellerPhone ? `연락처 : ${seller.sellerPhone}` : "",
        seller.sellerEmail ? `이메일 : ${seller.sellerEmail}` : "",
      ].filter(Boolean)
    : [];

  return (
    <footer className="bg-footer-bg text-footer-foreground">
      <div className="container px-4 py-8 tablet:py-12">
        {/* 판매자 정보 — 기존 푸터 위에 구분선을 두고 그 위에 놓는다. */}
        {seller && (
          <div className="pb-6 tablet:pb-8 mb-6 tablet:mb-8 border-b border-white/10 space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tablet:text-xs">
              {sellerItems.map((text, i) => (
                <span key={text} className="flex items-center gap-3">
                  {i > 0 && <span className="text-white/20">|</span>}
                  <span className={i === 0 ? "font-bold text-white" : ""}>{text}</span>
                </span>
              ))}
            </div>
            <p className="text-[11px] tablet:text-xs text-white/40 leading-relaxed">
              {MEDIATION_NOTICE}
            </p>
          </div>
        )}

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

        <div className="mt-8 tablet:mt-10 space-y-2 text-[11px] tablet:text-xs text-white/40">
          {/* 통신판매중개자 고지. 판매자 정보를 위에서 이미 밝힌 화면에서는 겹치므로 생략한다. */}
          {!seller && <p className="leading-relaxed">{MEDIATION_NOTICE}</p>}
          <p>© 2026 DIHABOOKS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
