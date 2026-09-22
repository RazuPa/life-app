import { Pressable, StyleSheet, Text } from "react-native";

import type { StyleProp, ViewStyle } from "react-native";

import { useTheme } from "../context/ThemeContext";

type ButtonVariant = "primary" | "secondary" | "danger";

type AppButtonProps = {
  title: string;

  onPress: () => void;

  variant?: ButtonVariant;

  disabled?: boolean;

  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}: AppButtonProps) {
  const { theme } = useTheme();

  function getBackgroundColor() {
    if (disabled) {
      return theme.colors.secondary;
    }

    switch (variant) {
      case "secondary":
        return theme.colors.cardAlt;

      case "danger":
        return theme.colors.danger;

      case "primary":
      default:
        return theme.colors.primary;
    }
  }

  function getTextColor() {
    if (disabled) {
      return theme.colors.muted;
    }

    if (variant === "secondary") {
      return theme.colors.text;
    }

    return "#FFFFFF";
  }

  function getBorderColor() {
    if (variant === "secondary") {
      return theme.colors.border;
    }

    return getBackgroundColor();
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),

          borderColor: getBorderColor(),
        },

        disabled && styles.disabled,

        pressed && !disabled && styles.pressed,

        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,

    borderRadius: 16,

    borderWidth: 1,

    paddingHorizontal: 20,

    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.72,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  disabled: {
    opacity: 0.65,
  },
});
