import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import Screen from "../components/Screen";
import Brand from "../components/Brand";
import AppButton from "../components/AppButton";
import { api } from "../services/api";
import { useSession } from "../context/SessionContext";
import { colors } from "../theme/colors";

export default function LoginScreen({ navigation }) {
  const { signIn } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!username.trim() || !password) return setError("Vui lòng nhập tên người dùng và mật khẩu.");
    setLoading(true); setError("");
    try {
      const data = await api.login({ username: username.trim(), password });
      await signIn(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <Screen scroll contentStyle={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <Brand />
        <View style={styles.card}>
          <Text style={styles.heading}>Chào mừng trở lại</Text>
          <Text style={styles.caption}>Đăng nhập để tiếp tục hành trình.</Text>
          <TextInput style={styles.input} placeholder="Tên người dùng" placeholderTextColor={colors.muted} autoCapitalize="none" autoCorrect={false} value={username} onChangeText={setUsername} returnKeyType="next" />
          <TextInput style={styles.input} placeholder="Mật khẩu" placeholderTextColor={colors.muted} secureTextEntry value={password} onChangeText={setPassword} onSubmitEditing={submit} returnKeyType="done" />
          {!!error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
          <AppButton title="Đăng nhập" onPress={submit} loading={loading} />
          <AppButton title="Tạo tài khoản mới" variant="ghost" onPress={() => navigation.navigate("Register")} />
        </View>
        <Text style={styles.hint}>Tài khoản thử: demo / demo1234</Text>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: "center" }, keyboard: { gap: 34 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 22, gap: 14 },
  heading: { color: colors.text, fontSize: 26, fontWeight: "900" }, caption: { color: colors.muted, marginBottom: 6 },
  input: { minHeight: 56, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, borderRadius: 14, paddingHorizontal: 16, color: colors.text, fontSize: 16 },
  error: { color: colors.danger, lineHeight: 20 }, hint: { color: colors.muted, textAlign: "center", fontSize: 13 },
});
