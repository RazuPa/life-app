import { StyleSheet, View } from "react-native";

import type { StyleProp, ViewStyle } from "react-native";

import { useTheme } from "../context/ThemeContext";

type ProgressBarProps = {
  value: number;
  max: number;

  height?: number;

  style?: StyleProp<ViewStyle>;
};

export default function ProgressBar({
  value,
  max,
  height = 9,
  style,
}: ProgressBarProps) {
  const { theme } = useTheme();

  const percentage =
    max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: theme.colors.secondary,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${percentage}%`,
            backgroundColor: theme.colors.xp,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
