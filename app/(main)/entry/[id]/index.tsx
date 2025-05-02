// src/app/(main)/entry/[id]/index.tsx
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { withObservables } from "@nozbe/with-observables";
import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { format } from "date-fns";
import JournalEntryRepository from "../../../../database/repositories/JournalEntryRepository";
import JournalEntry from "../../../../database/models/JournalEntry";
import PlaybackControls from "../../../../components/PlaybackControls";

interface Props {
  entry: JournalEntry;
}

function EntryDetailScreen({ entry }: Props) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState(
    entry.transcript || ""
  );

  useEffect(() => {
    // Load the sound file
    loadSound();

    return () => {
      // Unload sound when component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [entry.audioPath]);

  const loadSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: entry.audioPath },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis / 1000);
      setPlaybackDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        // Reset playback when finished
        sound?.setPositionAsync(0);
      }
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSaveTranscript = async () => {
    await JournalEntryRepository.updateTranscript(entry.id, editedTranscript);
    setIsEditing(false);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark p-4">
      <ScrollView className="flex-1">
        <Text className="text-text-light dark:text-text-dark opacity-70 mb-2">
          {format(new Date(entry.createdAt), "MMMM d, yyyy h:mm a")}
        </Text>

        <PlaybackControls
          isPlaying={isPlaying}
          position={playbackPosition}
          duration={playbackDuration}
          onPlayPause={handlePlayPause}
        />

        <Text className="text-lg font-bold text-text-light dark:text-text-dark mt-6 mb-2">
          Transcript
        </Text>

        {!entry.isTranscribed && !entry.transcript ? (
          <View className="flex-row items-center bg-surface-light dark:bg-surface-dark rounded-lg p-4">
            <ActivityIndicator size="small" color="#6366F1" />
            <Text className="text-text-light dark:text-text-dark ml-2">
              Transcribing...
            </Text>
          </View>
        ) : (
          <>
            {isEditing ? (
              <View>
                <TextInput
                  className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 text-text-light dark:text-text-dark"
                  multiline
                  value={editedTranscript}
                  onChangeText={setEditedTranscript}
                  style={{ minHeight: 200 }}
                />

                <TouchableOpacity
                  onPress={handleSaveTranscript}
                  className="bg-primary rounded-lg p-4 items-center mt-4"
                >
                  <Text className="text-white font-semibold">Save Changes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="bg-surface-light dark:bg-surface-dark rounded-lg p-4">
                <Text className="text-text-light dark:text-text-dark">
                  {entry.transcript || "No transcript available"}
                </Text>

                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="bg-primary rounded-lg p-2 items-center mt-4 self-end"
                >
                  <Text className="text-white font-semibold px-2">Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default withObservables(["params"], ({ params }) => ({
  entry: JournalEntryRepository.getEntryById(params.id),
}))(EntryDetailScreen);
