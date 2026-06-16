type CourseStageBarProps = {
  stages: Array<{
    id: string;
    shortName: string;
    name: string;
  }>;
  stageStates: Record<string, "not_started" | "current" | "completed">;
};

const stageStateLabels: Record<CourseStageBarProps["stageStates"][string], string> = {
  not_started: "待启动",
  current: "当前",
  completed: "完成",
};

export function CourseStageBar({ stages, stageStates }: CourseStageBarProps) {
  return (
    <div className="hud-panel course-stage-bar">
      {stages.map((stage) => {
        const state = stageStates[stage.id] ?? "not_started";
        return (
          <div className={`stage-segment is-${state}`} key={stage.id}>
            <span className="stage-node" aria-hidden="true" />
            <div>
              <strong>{stage.shortName}</strong>
              <small>{stageStateLabels[state]}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}
