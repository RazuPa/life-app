import { Stack } from "expo-router";

import { AppProvider } from "../context/AppContext";
import {
  ThemeProvider,
  useTheme,
} from "../context/ThemeContext";

/*
 * ROOT LAYOUT
 *
 * This is the highest level of the app.
 *
 * It provides:
 * - Theme state
 * - Activities / XP / goals state
 * - Stack navigation
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RootStack />
      </AppProvider>
    </ThemeProvider>
  );
}

function RootStack() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,

        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {/* Bottom-tab section */}
      <Stack.Screen name="(tabs)" />

      {/* Activity screens */}
      <Stack.Screen name="activity" />
      <Stack.Screen name="running" />

      {/* Goal creation */}
      <Stack.Screen name="create-goal" />

      {/* Additional screens */}
      <Stack.Screen name="explore" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="theme" />
    </Stack>
  );
}