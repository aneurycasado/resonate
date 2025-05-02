// components/PlaybackControls.tsx
import React, { useState } from "react";
import { View, TouchableOpacity, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PlaybackControlsProps {
  isPlaying: boolean;
  position: number;
  duration: number;
  onPlayPause: () => void;
  onSeek?: (position: number) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  position,
  duration,
  onPlayPause,
  onSeek,
}) => {
  const progressPercentage = Math.min(
    (position / Math.max(duration, 1)) * 100,
    100
  );

  const handleProgressBarPress = (event: any) => {
    if (!onSeek) return;

    // Get the layout of the progress bar
    const { locationX, measure } = event.nativeEvent;

    // Calculate the percentage of the touch position relative to the width
    const touchPercentage = locationX / measure.width;

    // Calculate the new position based on the percentage
    const newPosition = touchPercentage * duration;

    // Call the onSeek callback with the new position
    onSeek(newPosition);
  };

  return (
    <View className="bg-surface-light dark:bg-surface-dark rounded-lg p-4">
      <View className="flex-row justify-between items-center mb-3">
        <TouchableOpacity
          onPress={onPlayPause}
          className="bg-primary rounded-full w-12 h-12 items-center justify-center"
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <Text className="text-text-light dark:text-text-dark">
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>

      <Pressable
        onPress={handleProgressBarPress}
        className="h-8 justify-center"
      >
        <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <View
            className="h-2 bg-primary rounded-full"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default PlaybackControls;
