type WarningHint = {
  hintType: "key_point" | "beginner_tip" | "warning" | "summary" | "homework";
  title: string;
  body: string;
};

type WarningPanelProps = {
  hint?: WarningHint;
};

const hintLabels: Record<WarningHint["hintType"], string> = {
  key_point: "KEY POINT",
  beginner_tip: "BEGINNER TIP",
  warning: "WARNING",
  summary: "SUMMARY",
  homework: "HOMEWORK",
};

export function WarningPanel({ hint }: WarningPanelProps) {
  const panelType = hint?.hintType ?? "key_point";

  return (
    <div className={`hud-panel warning-panel is-${panelType}`}>
      <div className="hud-section-title">
        <span>{hint ? hintLabels[hint.hintType] : "NO ACTIVE HINT"}</span>
        <i aria-hidden="true" />
      </div>
      <strong>{hint?.title ?? "等待关键提示"}</strong>
      <p>{hint?.body ?? "当前时间点暂无重点提示，画面保持低干扰状态。"}</p>
    </div>
  );
}
