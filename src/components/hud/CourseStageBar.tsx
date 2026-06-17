type CourseStageBarProps = {
  stages: Array<{
    id: string;
    shortName: string;
    name: string;
    startTime?: number;
    endTime?: number;
  }>;
  stageStates: Record<string, "not_started" | "current" | "completed">;
  mode?: "editor" | "render";
  onStageClick?: (stageId: string, startTime?: number) => void;
};

const stageStateLabels: Record<CourseStageBarProps["stageStates"][string], string> = {
  not_started: "待启动",
  current: "当前",
  completed: "完成",
};

export function CourseStageBar({
  mode = "render",
  stages,
  stageStates,
  onStageClick,
}: CourseStageBarProps) {
  return (
    <div
      className="hud-panel course-stage-bar"
      style={{ gridTemplateColumns: `repeat(${Math.max(stages.length, 1)}, minmax(0, 1fr))` }}
    >
      {stages.map((stage) => {
        const state = stageStates[stage.id] ?? "not_started";
        const content = (
          <>
            <span className="stage-node" aria-hidden="true" />
            <div>
              <strong>{stage.shortName}</strong>
              <small>{stageStateLabels[state]}</small>
            </div>
          </>
        );

        if (mode === "editor") {
          return (
            <div
              className={`stage-segment is-${state}`}
              key={stage.id}
              onClick={() => onStageClick?.(stage.id, stage.startTime)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onStageClick?.(stage.id, stage.startTime);
                }
              }}
              role="button"
              tabIndex={0}
            >
              {content}
            </div>
          );
        }

        return (
          <div className={`stage-segment is-${state}`} key={stage.id}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
