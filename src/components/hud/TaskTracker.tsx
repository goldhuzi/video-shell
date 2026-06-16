type TaskTrackerProps = {
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  taskStates: Record<string, "not_started" | "current" | "completed">;
};

const taskStateLabels: Record<TaskTrackerProps["taskStates"][string], string> = {
  not_started: "NEXT",
  current: "ACTIVE",
  completed: "DONE",
};

export function TaskTracker({ tasks, taskStates }: TaskTrackerProps) {
  return (
    <div className="hud-panel task-tracker">
      <div className="hud-section-title">
        <span>TASK TRACKER</span>
        <i aria-hidden="true" />
      </div>
      <div className="task-list">
        {tasks.map((task) => {
          const state = taskStates[task.id] ?? "not_started";
          return (
            <div className={`task-item is-${state}`} key={task.id}>
              <span>{taskStateLabels[state]}</span>
              <div>
                <strong>{task.title}</strong>
                <small>{task.description ?? "等待任务说明"}</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
