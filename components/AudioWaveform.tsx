// src/components/AudioWaveform.tsx
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { AudioLevels } from "../types";
import { formatTime } from "@/utils/formatters";

interface Props {
  levels: AudioLevels;
  color?: string;
  barWidth?: number;
  barGap?: number;
  height?: number;
}

const AudioWaveform: React.FC<Props> = ({
  levels,
  color = "#6366F1",
  barWidth = 3,
  barGap = 2,
  height = 100,
}) => {
  return (
    <View className="bg-surface-light dark:bg-surface-dark rounded-lg p-4">
      <View className="flex-row justify-between items-center mb-2">
        <TouchableOpacity
          onPress={onPlayPause}
          className="bg-primary rounded-full p-3"
        >
          <Text className="text-white">{isPlaying ? "Pause" : "Play"}</Text>
        </TouchableOpacity>

        <Text className="text-text-light dark:text-text-dark">
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>

      <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <View
          className="h-2 bg-primary rounded-full"
          style={{
            width: `${(position / Math.max(duration, 1)) * 100}%`,
          }}
        />
      </View>
    </View>
  );
};

export default PlaybackControls;
