// src/app/_layout.tsx
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useAppStore } from "../store/appStore";
import { Audio } from "expo-av";

export default function RootLayout() {
  const { isDarkMode } = useAppStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    // Set color scheme based on app state
    setColorScheme(isDarkMode ? "dark" : "light");

    // Configure audio session
    setupAudio();
  }, [isDarkMode]);

  const setupAudio = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
  };

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen
          name="record/index"
          options={{
            presentation: "modal",
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </>
  );
}
