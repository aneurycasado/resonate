// components/RecordButton.tsx
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

type RecordingStatus = "idle" | "recording" | "paused" | "stopped" | "error";

interface RecordButtonProps {
  status: RecordingStatus;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  status,
  onPress,
  size = 72,
  disabled = false,
}) => {
  const isRecording = status === "recording";

  const handlePress = () => {
    // Provide haptic feedback when pressed
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      className={`items-center justify-center rounded-full ${
        isRecording ? "bg-red-500" : "bg-primary"
      } ${disabled ? "opacity-50" : "opacity-100"}`}
      style={{ width: size, height: size }}
    >
      {isRecording ? (
        // Show square stop icon when recording
        <View className="w-6 h-6 bg-white rounded-sm" />
      ) : (
        // Show microphone icon when not recording
        <Ionicons name="mic" size={size * 0.4} color="white" />
      )}
    </TouchableOpacity>
  );
};

export default RecordButton;
