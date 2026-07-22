import { Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen"; import Brand from "../components/Brand"; import AppButton from "../components/AppButton";
import { LEVELS } from "../config/levels"; import { colors } from "../theme/colors";

export default function LevelScreen({ navigation }) {
  return <Screen contentStyle={styles.screen}><Brand compact /><View><Text style={styles.title}>Chọn độ khó</Text><Text style={styles.subtitle}>Mỗi ván gồm tối đa 10 câu, 20 giây cho mỗi câu.</Text></View>
    <View style={styles.list}>{LEVELS.map((level) => <Pressable key={level.id} accessibilityRole="button" onPress={() => navigation.navigate("Quiz", { levelId: level.id })} style={({ pressed }) => [styles.level, pressed && styles.pressed]}><View style={[styles.icon, { backgroundColor: `${level.color}22` }]}><Text style={styles.iconText}>{level.icon}</Text></View><View style={styles.levelCopy}><Text style={[styles.levelName, { color: level.color }]}>{level.name}</Text><Text style={styles.levelDescription}>{level.description}</Text></View><Text style={styles.arrow}>›</Text></Pressable>)}</View>
    <AppButton title="Quay lại" variant="ghost" onPress={() => navigation.goBack()} />
  </Screen>;
}
const styles = StyleSheet.create({ screen: { gap: 24 }, title: { color: colors.text, fontSize: 32, fontWeight: "900", marginTop: 12 }, subtitle: { color: colors.muted, marginTop: 8, lineHeight: 20 }, list: { flex: 1, justifyContent: "center", gap: 14 }, level: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 16 }, pressed: { opacity: 0.78 }, icon: { width: 54, height: 54, alignItems: "center", justifyContent: "center", borderRadius: 16 }, iconText: { fontSize: 26 }, levelCopy: { flex: 1 }, levelName: { fontSize: 20, fontWeight: "900" }, levelDescription: { color: colors.muted, marginTop: 4 }, arrow: { color: colors.muted, fontSize: 34 } });
