import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen"; import AppButton from "../components/AppButton";
import { api } from "../services/api"; import { useSession } from "../context/SessionContext";
import { getLevel } from "../config/levels"; import { colors } from "../theme/colors";

const SECONDS_PER_QUESTION = 20;
const POINTS_PER_SECOND = 10;
const BASE_POINTS = 100;

function QuestionRound({ question, onAnswered }) {
  const [time, setTime] = useState(SECONDS_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const lockedRef = useRef(false);
  const timeRef = useRef(SECONDS_PER_QUESTION);

  const answer = useCallback((value, remaining) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setIsLocked(true);
    setSelected(value);
    setTimeout(() => onAnswered(value, remaining), value ? 350 : 0);
  }, [onAnswered]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((current) => {
        const next = Math.max(current - 1, 0);
        timeRef.current = next;
        if (next === 0) {
          clearInterval(interval);
          answer(null, 0);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [answer]);
  return <>
    <View style={styles.timerTrack}><View style={[styles.timerFill, { width: `${(time / SECONDS_PER_QUESTION) * 100}%` }]} /></View>
    <Text style={styles.timer}>{time} giây</Text>
    <View style={styles.questionCard}><Text style={question.type === "flag" ? styles.flag : styles.question}>{question.prompt}</Text></View>
    <View style={styles.answers}>{question.answers.map((item, index) => <Pressable key={`${item}-${index}`} disabled={isLocked} onPress={() => answer(item, timeRef.current)} style={({ pressed }) => [styles.answer, selected === item && styles.answerSelected, pressed && styles.answerPressed]}><Text style={question.type === "country" ? styles.answerFlag : styles.answerText}>{item}</Text></Pressable>)}</View>
  </>;
}

export default function QuizScreen({ route, navigation }) {
  const { levelId } = route.params; const level = getLevel(levelId); const { session } = useSession();
  const [questions, setQuestions] = useState([]); const [index, setIndex] = useState(0); const [score, setScore] = useState(0); const [correct, setCorrect] = useState(0); const [error, setError] = useState(""); const [loading, setLoading] = useState(true); const [requestId, setRequestId] = useState(0);
  useEffect(() => {
    let active = true;
    api.getQuestions(levelId, session.token)
      .then((data) => { if (active) { setQuestions(data.questions); setIndex(0); setScore(0); setCorrect(0); } })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [levelId, requestId, session.token]);
  const load = () => { setLoading(true); setError(""); setRequestId((value) => value + 1); };
  const handleAnswered = useCallback((answer, remaining) => {
    const question = questions[index]; const isCorrect = answer === question.correctAnswer; const nextScore = score + (isCorrect ? BASE_POINTS + remaining * POINTS_PER_SECOND : 0); const nextCorrect = correct + (isCorrect ? 1 : 0);
    if (index + 1 >= questions.length) navigation.replace("Result", { levelId, score: nextScore, correctAnswers: nextCorrect, totalQuestions: questions.length, maxScore: questions.length * (BASE_POINTS + SECONDS_PER_QUESTION * POINTS_PER_SECOND) });
    else { setScore(nextScore); setCorrect(nextCorrect); setIndex((value) => value + 1); }
  }, [correct, index, levelId, navigation, questions, score]);
  if (loading) return <Screen contentStyle={styles.center}><ActivityIndicator size="large" color={colors.accent} /><Text style={styles.muted}>Đang chuẩn bị câu hỏi…</Text></Screen>;
  if (error || !questions.length) return <Screen contentStyle={styles.center}><Text style={styles.error}>{error || "Chưa có câu hỏi cho cấp độ này."}</Text><AppButton title="Thử lại" onPress={load} style={styles.retry} /><AppButton title="Quay lại" variant="ghost" onPress={() => navigation.goBack()} style={styles.retry} /></Screen>;
  return <Screen contentStyle={styles.screen}><View style={styles.header}><View><Text style={[styles.level, { color: level.color }]}>{level.icon} {level.name}</Text><Text style={styles.progress}>Câu {index + 1}/{questions.length}</Text></View><Text style={styles.score}>{score} điểm</Text></View><QuestionRound key={questions[index].id} question={questions[index]} onAnswered={handleAnswered} /></Screen>;
}
const styles = StyleSheet.create({ screen: { gap: 14 }, center: { alignItems: "center", justifyContent: "center", gap: 18 }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, level: { fontWeight: "900", fontSize: 18 }, progress: { color: colors.muted, marginTop: 3 }, score: { color: colors.text, fontWeight: "800" }, timerTrack: { height: 7, borderRadius: 8, overflow: "hidden", backgroundColor: colors.surfaceRaised, marginTop: 8 }, timerFill: { height: "100%", backgroundColor: colors.accent }, timer: { color: colors.muted, textAlign: "right", fontSize: 13 }, questionCard: { minHeight: 180, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 20 }, flag: { fontSize: 88 }, question: { color: colors.text, fontWeight: "900", fontSize: 26, textAlign: "center", lineHeight: 34 }, answers: { flex: 1, justifyContent: "center", gap: 10 }, answer: { minHeight: 64, borderRadius: 16, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", padding: 12 }, answerSelected: { borderColor: colors.primary, backgroundColor: colors.primary }, answerPressed: { opacity: 0.75 }, answerText: { color: colors.text, fontSize: 17, fontWeight: "800", textAlign: "center" }, answerFlag: { fontSize: 38 }, muted: { color: colors.muted }, error: { color: colors.danger, textAlign: "center", lineHeight: 22 }, retry: { width: "100%", maxWidth: 320 } });

export const scoring = { SECONDS_PER_QUESTION, POINTS_PER_SECOND, BASE_POINTS };
