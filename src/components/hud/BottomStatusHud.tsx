type BottomStatus = {
  statusType: "idle" | "skill_unlocked" | "stage_completed" | "homework_ready" | "warning_sync";
  title: string;
  body: string;
};

type BottomStatusHudProps = {
  status?: BottomStatus;
};

export function BottomStatusHud({ status }: BottomStatusHudProps) {
  return (
    <div className={`hud-panel bottom-status-hud is-${status?.statusType ?? "idle"}`}>
      <span className="hud-label">{status?.statusType === "skill_unlocked" ? "UNLOCKED" : "STATUS"}</span>
      <strong>{status?.title ?? "HUD 待机"}</strong>
      <small>{status?.body ?? "等待时间轴事件触发"}</small>
    </div>
  );
}
