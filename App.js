import { StatusBar } from "expo-status-bar";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider } from "./src/context/SessionContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/colors";

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <NavigationContainer
          theme={{
            ...DarkTheme,
            colors: {
              ...DarkTheme.colors,
              primary: colors.primary,
              background: colors.background,
              card: colors.surface,
              text: colors.text,
              border: colors.border,
              notification: colors.accent,
            },
          }}
        >
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
