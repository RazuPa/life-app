import type { ReactNode } from "react";

import { StyleSheet, Text } from "react-native";

import type { StyleProp, TextStyle } from "react-native";

import { useTheme } from "../context/ThemeContext";

type TextVariant =
  | "pageTitle"
  | "title"
  | "subtitle"
  | "body"
  | "secondary"
  | "label"
  | "caption"
  | "xp";

type AppTextProps = {
  children: ReactNode;
  variant?: TextVariant;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export default function AppText({
  children,
  variant = "body",
  style,
  numberOfLines,
}: AppTextProps) {
  const { theme } = useTheme();

  function getColor() {
    switch (variant) {
      case "secondary":
      case "subtitle":
        return theme.colors.textSecondary;

      case "label":
      case "caption":
        return theme.colors.muted;

      case "xp":
        return theme.colors.xp;

      default:
        return theme.colors.text;
    }
  }

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.base,
        styles[variant],
        {
          color: getColor(),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 14,
  },

  pageTitle: {
    fontSize: 32,
    fontWeight: "800",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },

  body: {
    fontSize: 14,
    lineHeight: 20,
  },

  secondary: {
    fontSize: 13,
    lineHeight: 19,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  caption: {
    fontSize: 11,
    lineHeight: 16,
  },

  xp: {
    fontSize: 14,
    fontWeight: "800",
  },
});
