// src/app/record/index.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import RecordingService from "../../services/RecordingService";
import JournalEntryRepository from "../../database/repositories/JournalEntryRepository";
import AudioWaveform from "../../components/AudioWaveform";
import RecordButton from "../../components/RecordButton";
import { formatTime } from "../../utils/formatters";
import { RecordingStatus } from "../../types";

export default function RecordingScreen() {
  const [recordingStatus, setRecordingStatus] =
    useState<RecordingStatus>("idle");
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set up recording service listeners
    RecordingService.setOnStatusChange(setRecordingStatus);
    RecordingService.setOnLevelsChange(setAudioLevels);

    return () => {
      // Clean up
      if (timer) {
        clearInterval(timer);
      }

      // If still recording when leaving, stop it
      if (recordingStatus === "recording") {
        handleStopRecording();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      await RecordingService.startRecording();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Start timer
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      setTimer(interval);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Failed to start recording");
    }
  };

  const handleStopRecording = async () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    try {
      const result = await RecordingService.stopRecording();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (result) {
        // Save the recording
        const entry = await JournalEntryRepository.createEntry({
          tempAudioUri: result.uri,
          duration: result.duration,
        });

        // Navigate back to home
        router.back();

        // Navigate to the entry detail
        setTimeout(() => {
          router.push(`/entry/${entry.id}`);
        }, 500);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      alert("Failed to save recording");
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark justify-between p-4">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Text className="text-primary">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-text-light dark:text-text-dark text-lg font-semibold">
          New Journal Entry
        </Text>
        <View className="w-12" />
      </View>

      <View className="flex-1 justify-center items-center">
        <Text className="text-4xl text-text-light dark:text-text-dark font-bold mb-8">
          {formatTime(recordingTime)}
        </Text>

        <View className="h-24 w-full">
          <AudioWaveform
            levels={audioLevels.length > 0 ? audioLevels : Array(50).fill(0.05)}
            color={recordingStatus === "recording" ? "#6366F1" : "#94A3B8"}
            height={80}
          />
        </View>

        <RecordButton
          status={recordingStatus}
          onPress={
            recordingStatus === "recording"
              ? handleStopRecording
              : handleStartRecording
          }
          size={80}
        />
      </View>

      <Text className="text-center text-text-light dark:text-text-dark opacity-70 mb-8">
        {recordingStatus === "recording"
          ? "Tap to stop recording"
          : "Tap to start recording"}
      </Text>
    </View>
  );
}
