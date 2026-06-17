export function clampTime(value: number, min = 0, max = Number.POSITIVE_INFINITY) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Number.isFinite(totalSeconds) ? totalSeconds : 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = Math.floor(safeSeconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function parseTime(input: string | number) {
  if (typeof input === "number") {
    return Number.isFinite(input) ? input : 0;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return 0;
  }

  if (!trimmed.includes(":")) {
    const seconds = Number(trimmed);
    return Number.isFinite(seconds) ? seconds : 0;
  }

  const parts = trimmed.split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part) || part < 0)) {
    return 0;
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return 0;
}
