// src/services/RecordingService.ts
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { nanoid } from "nanoid";
import { RecordingStatus, AudioLevels, RecordingResult } from "../types";

class RecordingService {
  private recording: Audio.Recording | null = null;
  private status: RecordingStatus = "idle";
  private audioLevels: AudioLevels = [];
  private onStatusChange: ((status: RecordingStatus) => void) | null = null;
  private onLevelsChange: ((levels: AudioLevels) => void) | null = null;
  private metering: NodeJS.Timeout | null = null;

  constructor() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
  }

  setOnStatusChange(callback: (status: RecordingStatus) => void) {
    this.onStatusChange = callback;
  }

  setOnLevelsChange(callback: (levels: AudioLevels) => void) {
    this.onLevelsChange = callback;
  }

  private updateStatus(newStatus: RecordingStatus) {
    this.status = newStatus;
    if (this.onStatusChange) {
      this.onStatusChange(newStatus);
    }
  }

  private updateLevels(level: number) {
    // Keep only the last 50 levels for visualization
    if (this.audioLevels.length >= 50) {
      this.audioLevels.shift();
    }

    this.audioLevels.push(level);

    if (this.onLevelsChange) {
      this.onLevelsChange([...this.audioLevels]);
    }
  }

  private startMetering() {
    this.metering = setInterval(async () => {
      if (this.recording) {
        const status = await this.recording.getStatusAsync();
        if (status.isRecording && "metering" in status) {
          // Convert metering level to a value between 0 and 1
          const normalized = Math.min(
            Math.max(((status.metering as number) + 160) / 160, 0),
            1
          );
          this.updateLevels(normalized);
        }
      }
    }, 100);
  }

  private stopMetering() {
    if (this.metering) {
      clearInterval(this.metering);
      this.metering = null;
    }
  }

  async startRecording(): Promise<void> {
    try {
      await Audio.requestPermissionsAsync();

      await this.ensureRecordingDirectory();

      this.audioLevels = [];

      this.recording = new Audio.Recording();

      await this.recording.prepareToRecordAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      });

      await this.recording.startAsync();
      this.updateStatus("recording");
      this.startMetering();
    } catch (error) {
      console.error("Failed to start recording", error);
      this.updateStatus("error");
    }
  }

  async stopRecording(): Promise<RecordingResult | null> {
    if (!this.recording) {
      return null;
    }

    try {
      this.stopMetering();
      await this.recording.stopAndUnloadAsync();

      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();

      const result = {
        uri: uri as string,
        duration: status.durationMillis ? status.durationMillis / 1000 : 0,
      };

      this.recording = null;
      this.updateStatus("stopped");

      return result;
    } catch (error) {
      console.error("Failed to stop recording", error);
      this.updateStatus("error");
      return null;
    }
  }

  private async ensureRecordingDirectory(): Promise<void> {
    const dir = `${FileSystem.documentDirectory}recordings/`;

    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }

  async moveRecordingToStorage(tempUri: string): Promise<string> {
    const newFilename = `${nanoid()}.m4a`;
    const newUri = `${FileSystem.documentDirectory}recordings/${newFilename}`;

    await FileSystem.moveAsync({
      from: tempUri,
      to: newUri,
    });

    return newUri;
  }

  getStatus(): RecordingStatus {
    return this.status;
  }

  getLevels(): AudioLevels {
    return [...this.audioLevels];
  }
}

// Singleton instance
export default new RecordingService();
