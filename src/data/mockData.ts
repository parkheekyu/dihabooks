import { Book } from "@/components/BookCard";
import { BookOpen, Youtube, Camera, Handshake, Bot, Wallet, Sparkles, Palette, Megaphone, Code, type LucideIcon } from "lucide-react";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export const categories: { id: string; label: string; icon?: LucideIcon }[] = [
  { id: "all", label: "전체", icon: BookOpen },
  { id: "youtube", label: "유튜브", icon: Youtube },
  { id: "instagram", label: "인스타그램", icon: Camera },
  { id: "affiliate", label: "제휴마케팅", icon: Handshake },
  { id: "ai", label: "AI/자동화", icon: Bot },
  { id: "finance", label: "재테크", icon: Wallet },
  { id: "selfdev", label: "자기계발", icon: Sparkles },
  { id: "design", label: "디자인", icon: Palette },
  { id: "marketing", label: "마케팅", icon: Megaphone },
  { id: "it", label: "IT/프로그래밍", icon: Code },
];

export const heroSlides = [
  { image: hero1, id: 1 },
  { image: hero2, id: 2 },
  { image: hero3, id: 3 },
];

export const sampleBooks: Book[] = [
  {
    id: "1",
    title: "유튜브 알고리즘 마스터: 구독자 0에서 10만까지",
    author: "크리에이터 김",
    price: 19000,
    rating: 4.9,
    reviewCount: 452,
    category: "유튜브",
    image: hero1,
    badge: "BEST",
    pageCount: 136,
  },
  {
    id: "2",
    title: "인스타 릴스로 월 500만원 수익 만드는 비밀",
    author: "인스타 마스터",
    price: 15000,
    rating: 4.8,
    reviewCount: 322,
    category: "인스타그램",
    image: hero2,
    badge: "BEST",
  },
  {
    id: "3",
    title: "ChatGPT와 자동화로 월 300만원 파이프라인 구축",
    author: "AI 전문가",
    price: 39000,
    rating: 5.0,
    reviewCount: 198,
    category: "AI/자동화",
    image: hero3,
    badge: "BEST",
    pageCount: 210,
  },
  {
    id: "4",
    title: "제휴마케팅 A to Z: 수익형 블로그 완전 가이드",
    author: "마케터 박",
    price: 12000,
    rating: 4.7,
    reviewCount: 156,
    category: "제휴마케팅",
    image: hero1,
  },
  {
    id: "5",
    title: "퇴사 후 한 달 만에 월 수익 300만원 달성한 비결",
    author: "프리랜서 후기",
    price: 25000,
    rating: 4.9,
    reviewCount: 523,
    category: "재테크",
    image: hero2,
    badge: "TOP",
    pageCount: 180,
  },
  {
    id: "6",
    title: "평생 써먹는 가계부 작성 및 자산 관리 전략",
    author: "핀테크 전문가",
    price: 9900,
    rating: 4.6,
    reviewCount: 178,
    category: "자기계발",
    image: hero3,
    pageCount: 95,
  },
  {
    id: "7",
    title: "쇼츠 10분 영단어 암기법: 망각 곡선을 이기는 비법",
    author: "언어 전문 쥬이",
    price: 13000,
    rating: 4.8,
    reviewCount: 84,
    category: "자기계발",
    image: hero1,
  },
  {
    id: "8",
    title: "상위 1% 마케터만 아는 카피라이팅의 정석",
    author: "마케팅 대부",
    price: 22000,
    rating: 4.9,
    reviewCount: 346,
    category: "마케팅",
    image: hero2,
    pageCount: 156,
  },
];

export const reviews = [
  {
    id: 1,
    title: "카드값 200만원에서 저축 200만원이 되기까지",
    content: "매달 무엇가 사치를 부리는 것도 아니고 2만, 3만원... 소소히 모으니까 돈에의 없었다 하지만, 돈을 불리는건 정말인지한 게발파라인 가계학자...",
    author: "성공환불입님",
    avatar: "성",
    rating: 5.0,
  },
  {
    id: 2,
    title: "재테크기초반 듣기 전 돈 버리는 짓만 하고있었어",
    content: "근데 강의를 듣자마자 출자마자 호통케이텔었어요. 이 별로 아니라 나였다미팅이게랄 맞전 감님들은 모라고 만물 맞지 기초의한 방법을 더 다순한 방법으로 할 더시...",
    author: "수리짱이님",
    avatar: "수",
    rating: 5.0,
  },
  {
    id: 3,
    title: "유튜브 보다가 여기까지 강의까지 다 수강",
    content: "재테크기초반절을 듣기 실고, 전반적으로 직기 보면 배움에 뺐수록 '이거지라기'",
    author: "달박님",
    avatar: "달",
    rating: 5.0,
  },
];
