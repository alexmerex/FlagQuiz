import { ActivityIndicator, StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSession } from "../context/SessionContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import LevelScreen from "../screens/LevelScreen";
import QuizScreen from "../screens/QuizScreen";
import ResultScreen from "../screens/ResultScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { session, isRestoring } = useSession();
  if (isRestoring) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={colors.accent} /></View>;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      {session ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Levels" component={LevelScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background } });
