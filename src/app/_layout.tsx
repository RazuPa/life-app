import { Stack } from "expo-router";
import { AppProvider } from "../context/AppContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

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
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="running" />
      <Stack.Screen name="create-goal" />
      <Stack.Screen name="explore" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="theme" />
    </Stack>
  );
}
