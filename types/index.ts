import { Audio } from "expo-av";

export type RecordingStatus =
  | "idle"
  | "recording"
  | "paused"
  | "stopped"
  | "error";
export type AudioLevels = number[];

export interface RecordingResult {
  uri: string;
  duration: number;
}

export interface TranscriptionResult {
  text: string;
  success: boolean;
  error?: string;
}

export interface QueueItem {
  entryId: string;
  attempts: number;
}
