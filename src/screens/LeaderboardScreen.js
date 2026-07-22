import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen"; import Brand from "../components/Brand"; import AppButton from "../components/AppButton";
import { api } from "../services/api"; import { LEVELS } from "../config/levels"; import { colors } from "../theme/colors";

export default function LeaderboardScreen({ route, navigation }) {
  const [levelId, setLevelId] = useState(route.params?.initialLevel || "easy"); const [scores, setScores] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [requestId, setRequestId] = useState(0);
  useEffect(() => {
    let active = true;
    api.getLeaderboard(levelId)
      .then((data) => { if (active) setScores(data.scores); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [levelId, requestId]);
  const load = () => { setLoading(true); setError(""); setRequestId((value) => value + 1); };
  const selectLevel = (value) => { setLoading(true); setError(""); setScores([]); setLevelId(value); };
  return <Screen contentStyle={styles.screen}><Brand compact /><View><Text style={styles.title}>Bảng xếp hạng</Text><Text style={styles.subtitle}>Điểm cao nhất của mỗi người chơi</Text></View>
    <View style={styles.tabs}>{LEVELS.map((level) => <Pressable key={level.id} onPress={() => selectLevel(level.id)} style={[styles.tab, levelId === level.id && { backgroundColor: level.color, borderColor: level.color }]}><Text style={[styles.tabText, levelId === level.id && styles.tabTextActive]}>{level.name}</Text></Pressable>)}</View>
    <View style={styles.board}>{loading && !scores.length ? <View style={styles.center}><ActivityIndicator color={colors.accent} /></View> : error ? <View style={styles.center}><Text style={styles.error}>{error}</Text><AppButton title="Thử lại" onPress={load} /></View> : <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.accent} />}><View style={styles.header}><Text style={styles.rank}>HẠNG</Text><Text style={styles.user}>NGƯỜI CHƠI</Text><Text style={styles.points}>ĐIỂM</Text></View>{scores.length ? scores.map((item) => <View key={item.userId} style={styles.row}><Text style={[styles.rankValue, item.position <= 3 && styles.medal]}>{item.position <= 3 ? ["🥇", "🥈", "🥉"][item.position - 1] : item.position}</Text><View style={styles.user}><Text style={styles.username} numberOfLines={1}>{item.username}</Text><Text style={styles.detail}>{item.correctAnswers}/{item.totalQuestions} câu đúng</Text></View><Text style={styles.score}>{item.score}</Text></View>) : <Text style={styles.empty}>Chưa có thành tích. Hãy là người đầu tiên!</Text>}</ScrollView>}</View>
    <AppButton title="Quay lại" variant="ghost" onPress={() => navigation.goBack()} />
  </Screen>;
}
const styles = StyleSheet.create({ screen: { gap: 18 }, title: { color: colors.text, fontSize: 30, fontWeight: "900" }, subtitle: { color: colors.muted, marginTop: 5 }, tabs: { flexDirection: "row", gap: 8 }, tab: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, alignItems: "center", paddingVertical: 10 }, tabText: { color: colors.muted, fontWeight: "800" }, tabTextActive: { color: colors.background }, board: { flex: 1, backgroundColor: colors.surface, borderRadius: 22, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }, center: { flex: 1, justifyContent: "center", padding: 24, gap: 16 }, error: { color: colors.danger, textAlign: "center" }, header: { flexDirection: "row", padding: 14, backgroundColor: colors.surfaceRaised }, headerText: { color: colors.muted }, row: { minHeight: 68, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.border }, rank: { width: 55, color: colors.muted, fontSize: 11, fontWeight: "900" }, rankValue: { width: 55, color: colors.muted, fontWeight: "900", textAlign: "center" }, medal: { fontSize: 23 }, user: { flex: 1 }, points: { width: 65, color: colors.muted, fontSize: 11, fontWeight: "900", textAlign: "right" }, username: { color: colors.text, fontWeight: "800" }, detail: { color: colors.muted, fontSize: 12, marginTop: 3 }, score: { width: 65, color: colors.accent, fontSize: 17, fontWeight: "900", textAlign: "right" }, empty: { color: colors.muted, textAlign: "center", marginTop: 48, padding: 20 } });
