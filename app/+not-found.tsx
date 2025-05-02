// src/app/+not-found.tsx
import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-4 bg-background-light dark:bg-background-dark">
        <Text className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
          This screen doesn't exist.
        </Text>
        <Link href="/" className="text-primary">
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
