/**
 * 데모용 구매 상태. 결제를 마친 상품 id를 탭이 열려 있는 동안만 기억해서
 * 상품 페이지가 '구매 완료' 화면과 후기 작성란을 보여줄 수 있게 한다.
 */
const KEY = "dihabooks:purchased";

const read = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const isPurchasedBook = (id: string) => read().includes(id);

export const markPurchased = (ids: string[]) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify([...new Set([...read(), ...ids])]));
  } catch {
    // 저장소를 못 쓰는 환경이면 구매 상태를 기억하지 않을 뿐이다.
  }
};
