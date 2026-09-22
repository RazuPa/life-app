import { Pressable, StyleSheet, View } from "react-native";

import AppText from "./AppText";

import { useTheme } from "../context/ThemeContext";

type SectionHeaderProps = {
  title: string;

  actionLabel?: string;

  onActionPress?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="title">{title}</AppText>

      {actionLabel &&
        (onActionPress ? (
          <Pressable
            onPress={onActionPress}
            hitSlop={10}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <AppText
              style={[
                styles.actionText,
                {
                  color: theme.colors.primary,
                },
              ]}
            >
              {actionLabel}
            </AppText>
          </Pressable>
        ) : (
          <AppText
            style={[
              styles.actionText,
              {
                color: theme.colors.primary,
              },
            ]}
          >
            {actionLabel}
          </AppText>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 14,
  },

  actionText: {
    fontSize: 12,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.6,
  },
});
