// src/app/(main)/index.tsx
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Link, router } from "expo-router";
// import { withObservables } from "@nozbe/with-observables";
import { useCallback } from "react";
import JournalEntryRepository from "../../database/repositories/JournalEntryRepository";
import JournalEntry from "../../database/models/JournalEntry";
import EntryListItem from "../../components/EntryListItem";

type Props = {
  entries: JournalEntry[];
};

function HomeScreen({ entries }: Props) {
  const handlePressEntry = useCallback((id: string) => {
    router.push(`/entry/${id}`);
  }, []);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark p-4">
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryListItem entry={item} onPress={handlePressEntry} />
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-text-light dark:text-text-dark opacity-70 text-lg">
              No entries yet. Start by recording your first thought.
            </Text>
          </View>
        }
      />

      <Link href="/record" asChild>
        <TouchableOpacity className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <Text className="text-white text-3xl">+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

export default HomeScreen;

// export default withObservables([], () => ({
//   entries: JournalEntryRepository.getAllEntries(),
// })(HomeScreen);
