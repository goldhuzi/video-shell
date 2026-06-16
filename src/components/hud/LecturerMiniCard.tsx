type LecturerMiniCardProps = {
  lecturerName: string;
  lecturerTitle: string;
  displayMode: "video" | "avatar" | "compact" | "hidden";
};

export function LecturerMiniCard({ displayMode, lecturerName, lecturerTitle }: LecturerMiniCardProps) {
  if (displayMode === "hidden") {
    return null;
  }

  return (
    <div className="hud-panel lecturer-card">
      <div className="lecturer-avatar" aria-hidden="true">
        <span>{lecturerName.slice(0, 1).toUpperCase()}</span>
      </div>
      <div>
        <span className="hud-label">LECTURER</span>
        <strong>{lecturerName}</strong>
        {displayMode !== "compact" ? <small>{lecturerTitle}</small> : null}
      </div>
    </div>
  );
}
