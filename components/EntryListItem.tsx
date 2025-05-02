// components/EntryListItem.tsx
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { format } from "date-fns";

interface EntryProps {
  entry: {
    id: string;
    title?: string;
    transcript?: string;
    createdAt: Date | number;
    duration: number;
    isTranscribed?: boolean;
  };
  onPress: (id: string) => void;
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.floor(seconds)} sec`;
  } else {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  }
};

const EntryListItem: React.FC<EntryProps> = ({ entry, onPress }) => {
  const entryDate =
    entry.createdAt instanceof Date
      ? entry.createdAt
      : new Date(entry.createdAt);

  return (
    <TouchableOpacity
      className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg mb-3"
      onPress={() => onPress(entry.id)}
      activeOpacity={0.7}
    >
      <Text className="text-lg font-semibold text-text-light dark:text-text-dark">
        {entry.title || format(entryDate, "MMM d, yyyy h:mm a")}
      </Text>

      <Text
        className="text-text-light dark:text-text-dark opacity-70 mt-1"
        numberOfLines={2}
      >
        {entry.transcript ||
          (entry.isTranscribed === false
            ? "Processing transcription..."
            : "No transcript available")}
      </Text>

      <View className="flex-row justify-between mt-2">
        <Text className="text-text-light dark:text-text-dark opacity-50">
          {formatDuration(entry.duration)}
        </Text>
        <Text className="text-text-light dark:text-text-dark opacity-50">
          {format(entryDate, "MMM d, yyyy")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default EntryListItem;
