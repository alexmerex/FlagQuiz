import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

export default function AppButton({ title, onPress, variant = "primary", loading = false, disabled = false, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, (disabled || loading) && styles.disabled, style]}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.text, variant === "ghost" && styles.ghostText]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 54, borderRadius: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, borderWidth: 1 },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  secondary: { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
  danger: { backgroundColor: colors.danger, borderColor: colors.danger },
  ghost: { backgroundColor: "transparent", borderColor: colors.border },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
  text: { color: colors.white, fontSize: 16, fontWeight: "800" },
  ghostText: { color: colors.muted },
});
