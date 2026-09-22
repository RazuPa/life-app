import type { ReactNode } from "react";

import { Pressable, StyleSheet, View } from "react-native";

import type { StyleProp, ViewStyle } from "react-native";

import { useTheme } from "../context/ThemeContext";

type AppCardProps = {
  children: ReactNode;

  style?: StyleProp<ViewStyle>;

  variant?: "default" | "alt";

  padding?: number;

  onPress?: () => void;

  disabled?: boolean;
};

export default function AppCard({
  children,
  style,
  variant = "default",
  padding = 16,
  onPress,
  disabled = false,
}: AppCardProps) {
  const { theme } = useTheme();

  const backgroundColor =
    variant === "alt" ? theme.colors.cardAlt : theme.colors.card;

  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    {
      backgroundColor,
      borderColor: theme.colors.border,
      padding,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  disabled: {
    opacity: 0.6,
  },
});
