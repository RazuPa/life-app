import { Pressable, StyleSheet } from "react-native";
import AppText from "./AppText";
import { useTheme } from "../context/ThemeContext";

export default function AppButton({
  title, onPress, disabled = false,
}: { title: string; onPress: () => void; disabled?: boolean }) {
  const { theme } = useTheme();
  return (
    <Pressable disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, {
        backgroundColor: theme.colors.primary,
        opacity: disabled ? 0.5 : pressed ? 0.75 : 1,
      }]}>
      <AppText style={styles.text}>{title}</AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: { minHeight: 54, borderRadius: 17, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  text: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
