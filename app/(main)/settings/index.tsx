// src/app/(main)/settings/index.tsx
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useAppStore } from "../../../store/appStore";

export default function SettingsScreen() {
  const { isDarkMode, setDarkMode, resetDatabase } = useAppStore();

  const handleResetDatabase = async () => {
    await resetDatabase();
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark p-4">
      <View className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 mb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-text-light dark:text-text-dark text-lg">
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#767577", true: "#6366F1" }}
            thumbColor="#f4f3f4"
          />
        </View>
      </View>

      <View className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 mb-4">
        <Text className="text-text-light dark:text-text-dark text-lg mb-4">
          Data Management
        </Text>

        <TouchableOpacity
          className="bg-red-500 rounded-lg p-4 items-center"
          onPress={handleResetDatabase}
        >
          <Text className="text-white font-semibold">Reset Database</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
