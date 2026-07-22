import { StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen"; import Brand from "../components/Brand"; import AppButton from "../components/AppButton";
import { useSession } from "../context/SessionContext"; import { colors } from "../theme/colors";

export default function HomeScreen({ navigation }) {
  const { session, signOut } = useSession();
  return <Screen contentStyle={styles.screen}>
    <Brand compact />
    <View style={styles.hero}><Text style={styles.eyebrow}>XIN CHÀO, {session.user.username.toUpperCase()}</Text><Text style={styles.title}>Bạn nhận ra được bao nhiêu lá cờ?</Text><Text style={styles.copy}>Chọn độ khó, trả lời nhanh và chinh phục vị trí đầu bảng.</Text></View>
    <View style={styles.actions}><AppButton title="Bắt đầu chơi" onPress={() => navigation.navigate("Levels")} /><AppButton title="Bảng xếp hạng" variant="secondary" onPress={() => navigation.navigate("Leaderboard")} /></View>
    <AppButton title="Đăng xuất" variant="ghost" onPress={signOut} />
  </Screen>;
}
const styles = StyleSheet.create({ screen: { gap: 24 }, hero: { flex: 1, justifyContent: "center", backgroundColor: colors.surface, borderRadius: 28, padding: 26, borderWidth: 1, borderColor: colors.border }, eyebrow: { color: colors.accent, fontSize: 13, fontWeight: "900", letterSpacing: 1.2, marginBottom: 14 }, title: { color: colors.text, fontSize: 38, lineHeight: 44, fontWeight: "900" }, copy: { color: colors.muted, fontSize: 17, lineHeight: 25, marginTop: 14 }, actions: { gap: 12 } });
