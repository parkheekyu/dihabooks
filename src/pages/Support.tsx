import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Mail, Send, Check, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/AccountSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { sampleBooks, mockPurchases } from "@/data/mockData";
import { DEFAULT_AVATAR } from "@/lib/constants";

const INQUIRY_TYPES = ["내용 문의", "자료 요청", "오류 신고", "기타"];

const Support = () => {
  const { isLoggedIn } = useAuth();

  // 구매한 전자책만 문의 대상. 같은 작가의 책을 여러 권 샀어도 티켓은 주문 단위로 연다.
  const contactable = mockPurchases
    .filter((p) => p.status === "confirmed")
    .map((p) => ({ purchase: p, book: sampleBooks.find((b) => b.id === p.bookId) }))
    .filter((row): row is { purchase: typeof mockPurchases[number]; book: (typeof sampleBooks)[number] } => !!row.book);

  const [openId, setOpenId] = useState<string | null>(null);
  const [type, setType] = useState(INQUIRY_TYPES[0]);
  const [message, setMessage] = useState("");
  const [sentIds, setSentIds] = useState<string[]>([]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const openTicket = (id: string) => {
    setOpenId(openId === id ? null : id);
    setType(INQUIRY_TYPES[0]);
    setMessage("");
  };

  const submit = (id: string) => {
    setSentIds((prev) => [...prev, id]);
    setOpenId(null);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-6 tablet:py-10">
          <div className="flex flex-col desktop:flex-row gap-0 desktop:gap-10 max-w-5xl mx-auto">
            <AccountSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold mb-1 desktop:hidden">1:1 문의</h1>
              <h2 className="hidden desktop:block text-lg font-bold mb-1">1:1 문의</h2>
              <p className="text-xs text-muted-foreground mb-5 tablet:mb-6">
                구매하신 전자책의 작가에게만 문의할 수 있습니다. 문의하실 책을 선택해주세요.
              </p>

              {contactable.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center px-4">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">아직 구매한 전자책이 없습니다.</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    전자책을 구매하시면 작가에게 문의할 수 있어요.
                  </p>
                  <Link to="/store">
                    <Button size="sm" className="text-xs rounded-full h-8">
                      전자책 둘러보기
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactable.map(({ purchase, book }) => {
                    const sent = sentIds.includes(purchase.id);
                    const open = openId === purchase.id;

                    return (
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
                            {sent ? (
                              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <Check className="h-3.5 w-3.5" /> 접수됨
                              </span>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs rounded-lg h-8 gap-1.5"
                                onClick={() => openTicket(purchase.id)}
                              >
                                <Mail className="h-3.5 w-3.5" />
                                <span className="hidden tablet:inline">문의하기</span>
                              </Button>
                            )}
                          </div>
                        </div>

                        {sent && (
                          <p className="mt-3 rounded-md bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
                            문의가 접수되었습니다. 작가가 확인하면 등록하신 이메일로 답변이 전달됩니다.
                          </p>
                        )}

                        {open && !sent && (
                          <div className="mt-4 pt-4 border-t border-border space-y-3">
                            <div className="flex flex-wrap gap-1.5">
                              {INQUIRY_TYPES.map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setType(t)}
                                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                                    type === t
                                      ? "bg-foreground/10 text-foreground font-semibold"
                                      : "bg-secondary text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>

                            <Textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder={`${book.author} 작가님께 문의할 내용을 적어주세요.`}
                              className="min-h-[96px] text-sm resize-none"
                            />

                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8"
                                onClick={() => setOpenId(null)}
                              >
                                취소
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs h-8 gap-1.5 rounded-lg"
                                disabled={!message.trim()}
                                onClick={() => submit(purchase.id)}
                              >
                                <Send className="h-3 w-3" />
                                문의 보내기
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
