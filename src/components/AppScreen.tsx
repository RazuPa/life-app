import type { ReactNode } from "react";

import { ScrollView, StyleSheet, View } from "react-native";

import { useTheme } from "../context/ThemeContext";

type AppScreenProps = {
  children: ReactNode;

  scroll?: boolean;

  horizontalPadding?: number;

  topPadding?: number;

  bottomPadding?: number;

  showsVerticalScrollIndicator?: boolean;
};

export default function AppScreen({
  children,
  scroll = true,
  horizontalPadding = 20,
  topPadding = 60,
  bottomPadding = 120,
  showsVerticalScrollIndicator = false,
}: AppScreenProps) {
  const { theme } = useTheme();

  const contentStyle = {
    paddingHorizontal: horizontalPadding,
    paddingTop: topPadding,
    paddingBottom: bottomPadding,
  };

  if (scroll) {
    return (
      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
        contentContainerStyle={contentStyle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        contentStyle,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
