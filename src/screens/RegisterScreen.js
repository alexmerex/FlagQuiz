import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import Screen from "../components/Screen";
import Brand from "../components/Brand";
import AppButton from "../components/AppButton";
import { api } from "../services/api";
import { useSession } from "../context/SessionContext";
import { colors } from "../theme/colors";

export default function RegisterScreen({ navigation }) {
  const { signIn } = useSession();
  const [username, setUsername] = useState(""); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (username.trim().length < 3) return setError("Tên người dùng cần ít nhất 3 ký tự.");
    if (password.length < 8) return setError("Mật khẩu cần ít nhất 8 ký tự.");
    if (password !== confirm) return setError("Mật khẩu xác nhận chưa khớp.");
    setLoading(true); setError("");
    try { await signIn(await api.register({ username: username.trim(), password })); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return (
    <Screen scroll contentStyle={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <Brand compact />
        <View style={styles.card}>
          <Text style={styles.heading}>Tạo tài khoản</Text><Text style={styles.caption}>Lưu thành tích và cạnh tranh trên bảng xếp hạng.</Text>
          <TextInput style={styles.input} placeholder="Tên người dùng" placeholderTextColor={colors.muted} autoCapitalize="none" autoCorrect={false} value={username} onChangeText={setUsername} />
          <TextInput style={styles.input} placeholder="Mật khẩu (tối thiểu 8 ký tự)" placeholderTextColor={colors.muted} secureTextEntry value={password} onChangeText={setPassword} />
          <TextInput style={styles.input} placeholder="Nhập lại mật khẩu" placeholderTextColor={colors.muted} secureTextEntry value={confirm} onChangeText={setConfirm} onSubmitEditing={submit} />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <AppButton title="Đăng ký" onPress={submit} loading={loading} />
          <AppButton title="Quay lại đăng nhập" variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
const styles = StyleSheet.create({ screen: { justifyContent: "center" }, keyboard: { gap: 28 }, card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 22, gap: 14 }, heading: { color: colors.text, fontSize: 26, fontWeight: "900" }, caption: { color: colors.muted, marginBottom: 6, lineHeight: 20 }, input: { minHeight: 56, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, borderRadius: 14, paddingHorizontal: 16, color: colors.text, fontSize: 16 }, error: { color: colors.danger } });
