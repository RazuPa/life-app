import { StyleSheet, View } from "react-native";
import AppText from "./AppText";

export default function SectionHeader({ title }: { title: string }) {
  return <View style={styles.row}><AppText variant="label">{title}</AppText></View>;
}
const styles = StyleSheet.create({ row: { marginTop: 28, marginBottom: 12 } });
