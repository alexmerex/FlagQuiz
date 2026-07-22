import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export default function Screen({ children, scroll = false, contentStyle }) {
  const content = <View style={[styles.content, contentStyle]}>{children}</View>;
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "right", "bottom", "left"]}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, width: "100%", maxWidth: 720, alignSelf: "center", padding: 24 },
  scroll: { flexGrow: 1 },
});
