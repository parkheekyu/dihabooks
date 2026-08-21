import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * 라우터가 스크롤 위치를 그대로 두기 때문에, 페이지 하단에서 링크를 누르면
 * 새 페이지도 그 높이에서 시작한다. 이동할 때마다 맨 위로 되돌린다.
 *
 * 뒤로/앞으로 가기(POP)는 브라우저가 복원해주는 위치를 존중해 건드리지 않는다.
 * 페인트 전에 옮겨야 화면이 한 번 튀지 않으므로 useLayoutEffect를 쓴다.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === "POP") return;
    // 같은 페이지 안 앵커 이동(#섹션)까지 막지 않도록 해시가 있으면 넘어간다.
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
