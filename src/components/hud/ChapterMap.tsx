type ChapterMapProps = {
  nodes: Array<{
    id: string;
    label: string;
  }>;
  nodeStates: Record<string, "locked" | "not_started" | "current" | "completed" | "unlocked">;
};

const nodeStateLabels: Record<ChapterMapProps["nodeStates"][string], string> = {
  locked: "LOCK",
  not_started: "WAIT",
  current: "ACTIVE",
  completed: "DONE",
  unlocked: "OPEN",
};

export function ChapterMap({ nodes, nodeStates }: ChapterMapProps) {
  return (
    <div className="hud-panel chapter-map">
      <div className="hud-section-title">
        <span>CHAPTER MAP</span>
        <i aria-hidden="true" />
      </div>
      <div className="map-route">
        {nodes.map((node) => {
          const state = nodeStates[node.id] ?? "locked";
          return (
            <div className={`map-node is-${state}`} key={node.id}>
              <span className="node-dot" aria-hidden="true" />
              <strong>{node.label}</strong>
              <small>{nodeStateLabels[state]}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
