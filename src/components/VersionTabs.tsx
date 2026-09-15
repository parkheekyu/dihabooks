import { Check, AlertCircle } from "lucide-react";

export type VersionTab = { id: string; label: string };

interface Props {
  versions: VersionTab[];
  active: string;
  onChange: (id: string) => void;
  /** 판본별로 비어 있는 칸 수. 0이면 완료 표시. */
  missing?: Record<string, number>;
}

/**
 * 판본 전환 탭. 목차와 링크·자료가 같은 탭 규칙을 쓰도록 한곳에 뒀다.
 * 판본이 하나뿐이면 전환할 게 없으니 그리지 않는다.
 */
const VersionTabs = ({ versions, active, onChange, missing }: Props) => {
  if (versions.length < 2) return null;

  return (
    <div role="tablist" aria-label="판본" className="flex flex-wrap gap-1.5">
      {versions.map((v, i) => {
        const selected = v.id === active;
        const empty = missing?.[v.id] ?? 0;
        return (
          <button
            key={v.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(v.id)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              selected
                ? "border-primary bg-primary/5 font-semibold text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{v.label.trim() || `판본 ${i + 1}`}</span>
            {missing &&
              (empty > 0 ? (
                <span className="flex items-center gap-0.5 text-amber-600">
                  <AlertCircle className="h-3 w-3" /> {empty}칸 비어있음
                </span>
              ) : (
                <Check className="h-3 w-3 text-emerald-600" aria-label="입력 완료" />
              ))}
          </button>
        );
      })}
    </div>
  );
};

export default VersionTabs;
