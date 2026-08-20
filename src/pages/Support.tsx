import { Link, Navigate } from "react-router-dom";
import { MessageCircle, ShoppingBag, Headset } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/AccountSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { sampleBooks, mockPurchases } from "@/data/mockData";
import { DEFAULT_AVATAR } from "@/lib/constants";

/** 작가 계정의 1:1 문의는 플랫폼 고객센터 카카오톡 채널로 연결한다. */
const KAKAO_CHANNEL_URL = "http://pf.kakao.com/_jJqwX/chat";

const Support = () => {
  const { isLoggedIn, role, sellerProfile } = useAuth();
  const isExpert = role === "expert";

  // 구매 확정된 전자책만 문의 대상.
  const contactable = mockPurchases
    .filter((p) => p.status === "confirmed")
    .map((p) => ({ purchase: p, book: sampleBooks.find((b) => b.id === p.bookId) }))
    .filter((row): row is { purchase: typeof mockPurchases[number]; book: (typeof sampleBooks)[number] } => !!row.book);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // 작가가 프로필에 설정한 오픈채팅 주소. 비어 있으면 문의 버튼을 열 수 없다.
  const authorChatUrl = sellerProfile.contactUrl;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-6 tablet:py-10">
          <div className="flex flex-col desktop:flex-row gap-0 desktop:gap-10 max-w-5xl mx-auto">
            <AccountSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold mb-4 desktop:hidden">마이페이지</h1>
              <h2 className="hidden desktop:block text-lg font-bold mb-1">1:1 문의</h2>
              <p className="text-xs text-muted-foreground mb-5 tablet:mb-6">
                {isExpert
                  ? "디하북스 고객센터 카카오톡 채널로 연결됩니다."
                  : "구매하신 전자책의 작가 오픈채팅으로 연결됩니다."}
              </p>

              {isExpert ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-border text-center px-4">
                  <Headset className="h-6 w-6 text-muted-foreground mb-3" />
                  <p className="text-sm font-bold">디하북스 고객센터</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-1">
                    정산, 상품 등록·심사, 계정 문제 등을 상담해드립니다.
                  </p>
                  <p className="text-[11px] text-muted-foreground mb-4">
                    평일 10:00 - 18:00 (점심 12 - 13시, 주말·공휴일 제외)
                  </p>
                  <a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="text-xs h-9 rounded-lg bg-kakao text-kakao-foreground hover:bg-kakao/90">
                      카카오톡으로 문의하기
                    </Button>
                  </a>
                </div>
              ) : contactable.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center px-4">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">아직 구매한 전자책이 없습니다.</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    전자책을 구매하시면 작가에게 문의할 수 있어요.
                  </p>
                  <Link to="/store">
                    <Button size="sm" className="text-xs rounded-full h-8">전자책 둘러보기</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactable.map(({ purchase, book }) => (
                    <div key={purchase.id} className="rounded-lg border border-border p-4 tablet:p-5">
                      <div className="flex items-start gap-3 tablet:gap-4">
                        <Link to={`/book/${book.id}`} className="shrink-0">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-16 w-24 tablet:h-[72px] tablet:w-28 rounded-md object-cover bg-secondary"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link to={`/book/${book.id}`} className="hover:underline">
                            <p className="text-sm font-bold leading-snug line-clamp-2">{book.title}</p>
                          </Link>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <img src={DEFAULT_AVATAR} alt="" className="h-5 w-5 rounded-full object-cover" />
                            <span className="text-xs text-muted-foreground">{book.author}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {purchase.date} 구매 · #{purchase.id}
                          </p>
                        </div>

                        <div className="shrink-0 self-center">
                          {authorChatUrl ? (
                            <a href={authorChatUrl} target="_blank" rel="noopener noreferrer">
                              <Button
                                size="sm"
                                className="text-xs rounded-lg h-8 gap-1.5 bg-kakao text-kakao-foreground hover:bg-kakao/90"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span className="hidden tablet:inline">문의하기</span>
                              </Button>
                            </a>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">문의 링크 미등록</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
