type TopHeaderProps = {
  courseTitle: string;
  lessonTitle: string;
  chapterTitle: string;
  lessonNumber: string;
  courseCode: string;
  statusLabel: string;
  currentStageName?: string;
};

export function TopHeader({
  chapterTitle,
  courseCode,
  courseTitle,
  currentStageName,
  lessonNumber,
  lessonTitle,
  statusLabel,
}: TopHeaderProps) {
  return (
    <div className="hud-panel top-header">
      <div className="hud-brand">
        <span>{courseCode}</span>
        <strong>{lessonNumber}</strong>
      </div>
      <div className="top-header-title">
        <strong>{courseTitle}</strong>
        <span>{chapterTitle} / {lessonTitle}</span>
      </div>
      <div className="top-header-status">
        <span>{currentStageName ?? "待机"}</span>
        <strong>{statusLabel}</strong>
      </div>
    </div>
  );
}
