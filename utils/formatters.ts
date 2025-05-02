// src/utils/formatters.ts
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} sec`;
  } else {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  }
};
