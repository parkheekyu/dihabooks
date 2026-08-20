import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import {
  Bold, Italic, Underline, Heading2, List, ListOrdered,
  AlignLeft, AlignCenter, Minus, Image as ImageIcon, Link2,
} from "lucide-react";

const TOOLBAR = [
  { icon: Bold, command: "bold", label: "굵게" },
  { icon: Italic, command: "italic", label: "기울임" },
  { icon: Underline, command: "underline", label: "밑줄" },
  { icon: Heading2, command: "formatBlock", value: "h2", label: "제목" },
  { divider: true },
  { icon: List, command: "insertUnorderedList", label: "목록" },
  { icon: ListOrdered, command: "insertOrderedList", label: "번호 목록" },
  { divider: true },
  { icon: AlignLeft, command: "justifyLeft", label: "왼쪽 정렬" },
  { icon: AlignCenter, command: "justifyCenter", label: "가운데 정렬" },
  { divider: true },
  { icon: Minus, command: "insertHorizontalRule", label: "구분선" },
] as const;

export interface RichTextEditorHandle {
  /** 현재 편집 내용을 HTML 문자열로 반환. */
  getHTML: () => string;
  clear: () => void;
}

interface Props {
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

/**
 * 툴바 + contentEditable 기반 에디터. 이미지는 data URL로 본문에 삽입된다.
 * (업로드 백엔드가 붙으면 삽입 직전에 업로드 후 URL을 넣도록 바꾸면 된다.)
 */
const RichTextEditor = forwardRef<RichTextEditorHandle, Props>(
  ({ placeholder = "내용을 입력해주세요.", minHeight = "280px", className = "" }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getHTML: () => editorRef.current?.innerHTML ?? "",
      clear: () => { if (editorRef.current) editorRef.current.innerHTML = ""; },
    }));

    const exec = useCallback((command: string, value?: string) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    }, []);

    const insertImage = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => exec("insertImage", reader.result as string);
        reader.readAsDataURL(file);
      };
      input.click();
    };

    return (
      <div className={className}>
        <div className="rounded-t-xl border border-border bg-secondary/30 px-2 py-1.5 flex items-center gap-0.5 flex-wrap">
          {TOOLBAR.map((btn, i) =>
            "divider" in btn ? (
              <div key={i} className="w-px h-5 bg-border mx-1" />
            ) : (
              <button
                key={i}
                type="button"
                title={btn.label}
                onClick={() => exec(btn.command, "value" in btn ? btn.value : undefined)}
                className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              >
                <btn.icon className="h-4 w-4 text-foreground" />
              </button>
            )
          )}
          <div className="w-px h-5 bg-border mx-1" />
          <button
            type="button"
            title="이미지 삽입"
            onClick={insertImage}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            <ImageIcon className="h-4 w-4 text-foreground" />
          </button>
          <button
            type="button"
            title="링크 삽입"
            onClick={() => {
              const url = prompt("URL을 입력해주세요:");
              if (url) exec("createLink", url);
            }}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            <Link2 className="h-4 w-4 text-foreground" />
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          className="rounded-b-xl border border-t-0 border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring prose prose-sm max-w-none [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2"
          style={{ wordBreak: "break-word", minHeight }}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
        <p className="text-xs text-muted-foreground mt-1 text-right flex items-center justify-end gap-1">
          <ImageIcon className="h-3 w-3" /> 이미지 삽입 가능
        </p>
      </div>
    );
  }
);
RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
