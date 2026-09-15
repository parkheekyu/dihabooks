import type { TocChapter } from "@/components/TocFields";
import type { ResourceLink, ResourceFile } from "@/components/PageResourceFields";
import type { EbookVersion } from "@/components/EbookFileFields";

type Paged = { pages: Record<string, string> };

/** 제목은 있는데 해당 판본 쪽수가 빈 소제목 수. */
export const countMissingPages = (toc: TocChapter[], versionId: string) =>
  toc.flatMap((c) => c.subtopics).filter((s) => s.title.trim() && !s.pages[versionId]).length;

/** 일부 판본에만 쪽을 넣고 나머지를 비운 항목 수. 전부 비운 건 '전체'라 빼고 센다. */
export const countMissingResourcePages = (items: Paged[], versionIds: string[], versionId: string) =>
  items.filter((it) => versionIds.some((id) => it.pages[id]) && !it.pages[versionId]).length;

const versionName = (v: EbookVersion, i: number) => v.label.trim() || `판본 ${i + 1}`;

export type VersionProblem = { versionId: string; section: "toc" | "resources"; message: string };

/**
 * 제출 전에 판본별 쪽수를 점검한다. 문제가 있으면 첫 번째만 돌려주고,
 * 화면은 그 판본 탭으로 옮겨 바로 고칠 수 있게 한다.
 */
export const findVersionProblem = (
  versions: EbookVersion[],
  toc: TocChapter[],
  links: ResourceLink[],
  files: ResourceFile[],
): VersionProblem | null => {
  const ids = versions.map((v) => v.id);
  for (const [i, v] of versions.entries()) {
    const name = versionName(v, i);

    const missing = countMissingPages(toc, v.id);
    if (missing > 0) {
      return { versionId: v.id, section: "toc", message: `'${name}' 판본에 시작 쪽이 빈 소제목이 ${missing}개 있습니다.` };
    }

    const pages = toc
      .flatMap((c) => c.subtopics)
      .filter((s) => s.title.trim() && s.pages[v.id])
      .map((s) => Number(s.pages[v.id]));
    if (pages.some((n, idx) => idx > 0 && n < pages[idx - 1])) {
      return { versionId: v.id, section: "toc", message: `'${name}' 판본의 시작 쪽이 목차 순서와 어긋납니다.` };
    }

    const resMissing = countMissingResourcePages([...links, ...files], ids, v.id);
    if (resMissing > 0) {
      return { versionId: v.id, section: "resources", message: `'${name}' 판본에 쪽수가 빈 링크·자료가 ${resMissing}개 있습니다.` };
    }
  }
  return null;
};

/**
 * 판본 PDF 북마크에서 읽은 소제목 시작 쪽을 목차에 채운다.
 * 목차가 비어 있으면 북마크 구조를 그대로 가져오고, 이미 있으면 순서대로 쪽수만 맞춘다.
 * 실제로는 서버가 PDF outline을 파싱해 내려주는 값이며, 데모에서는 판본 순서에 따라
 * 글자가 클수록 쪽이 늘어나는 표본 값을 쓴다.
 */
export const applyOutline = (toc: TocChapter[], versionId: string, versionIndex: number): TocChapter[] => {
  const factor = 1 + versionIndex * 0.3;
  const sample = [
    { chapter: "1. 시작하기", subtopics: [["들어가며", 1], ["이 책을 읽는 법", 8]] as const },
    { chapter: "2. 본론", subtopics: [["기본 개념 잡기", 16], ["실전 적용", 34]] as const },
  ];
  const page = (base: number) => String(Math.max(1, Math.round((base - 1) * factor) + 1));

  const hasTitles = toc.some((c) => c.subtopics.some((s) => s.title.trim()));
  if (!hasTitles) {
    return sample.map((c) => ({
      chapter: c.chapter,
      subtopics: c.subtopics.map(([title, p]) => ({ title, preview: false, pages: { [versionId]: page(p) } })),
    }));
  }

  // 이미 입력된 목차가 있으면 구조는 건드리지 않고 이 판본 쪽수만 순서대로 채운다.
  const outlinePages = sample.flatMap((c) => c.subtopics.map(([, p]) => page(p)));
  let k = 0;
  return toc.map((c) => ({
    ...c,
    subtopics: c.subtopics.map((s) => {
      if (!s.title.trim()) return s;
      const p = outlinePages[k++];
      return p ? { ...s, pages: { ...s.pages, [versionId]: p } } : s;
    }),
  }));
};

/* ── 상품 주소(slug) ── */

/** 상품 주소에 쓸 수 없는 예약어. 라우트와 겹치면 페이지가 열리지 않는다. */
const RESERVED_SLUGS = ["new", "edit", "admin", "store", "search", "preview"];

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * 제목에서 주소 후보를 만든다. 영문·숫자만 남기므로 한글만 있는 제목이면 비어 나오고,
 * 그때는 짧은 임의 주소를 만든다.
 */
export const suggestSlug = (title: string) => {
  const latin = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return latin.length >= 3 ? latin : `ebook-${Math.random().toString(36).slice(2, 7)}`;
};

export type SlugCheck = { ok: boolean; message: string };

export const checkSlug = (slug: string, taken: string[]): SlugCheck => {
  if (!slug) return { ok: false, message: "상품 주소를 입력해주세요." };
  if (slug.length < 3 || slug.length > 60) return { ok: false, message: "3~60자로 입력해주세요." };
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, message: "영문 소문자·숫자·하이픈(-)만 쓸 수 있고, 하이픈으로 시작하거나 끝날 수 없습니다." };
  }
  if (RESERVED_SLUGS.includes(slug)) return { ok: false, message: "시스템에서 쓰는 주소라 사용할 수 없습니다." };
  if (taken.includes(slug)) return { ok: false, message: "이미 다른 상품이 쓰고 있는 주소입니다." };
  return { ok: true, message: "사용할 수 있는 주소입니다." };
};

/** 상품 주소 앞부분. 화면 표시와 공유 링크에 같이 쓴다. */
export const SHOP_ORIGIN = "dihabooks.com/book/";
