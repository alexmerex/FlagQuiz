import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function Brand({ compact = false }) {
  return (
    <View style={styles.row} accessibilityRole="header">
      <View style={[styles.mark, compact && styles.markCompact]}><Text style={styles.flag}>🚩</Text></View>
      <View>
        <Text style={[styles.title, compact && styles.titleCompact]}>FLAG QUIZ</Text>
        {!compact && <Text style={styles.subtitle}>Khám phá thế giới qua những lá cờ</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  mark: { width: 62, height: 62, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  markCompact: { width: 44, height: 44, borderRadius: 14 },
  flag: { fontSize: 28 },
  title: { color: colors.text, fontSize: 30, fontWeight: "900", letterSpacing: 1.2 },
  titleCompact: { fontSize: 22 },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 3 },
});
