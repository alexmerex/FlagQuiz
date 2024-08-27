import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";

function ChooseLevelScreen({ route }) {
  const navigation = useNavigation();
  const { username } = route.params;

  let [] = useFonts({
    Nunito: require("../assets/fonts/Nunito-SemiBold.ttf"),
  });

  const goToQuestionScreen = (levelID) => {
    navigation.navigate("QuestionScreen", { levelID, username });
  };

  const goBackToMainScreen = () => {
    navigation.navigate("MainScreen", { username });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundLogo}>
        <ImageBackground
          style={styles.background}
          source={require("../image/Vector2.png")}
        >
          <Image style={styles.Logo} source={require("../image/logo.png")} />
        </ImageBackground>
      </View>

      <View style={styles.levelButtonContainer}>
        <TouchableOpacity
          style={styles.levelButton}
          onPress={() => goToQuestionScreen("0000000001")}
        >
          <Text style={styles.levelButtonText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.levelButton}
          onPress={() => goToQuestionScreen("0000000002")}
        >
          <Text style={styles.levelButtonText}>Normal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.levelButton}
          onPress={() => goToQuestionScreen("0000000003")}
        >
          <Text style={styles.levelButtonText}>Hard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBackToMainScreen}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000E56",
  },
  backgroundLogo: {
    alignItems: "center",
  },
  background: {
    // Your background styles
  },
  Logo: {
    width: 388,
    marginTop: "20%",
  },
  levelButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  levelButton: {
    backgroundColor: "#5200FF",
    padding: 15,
    borderRadius: 55,
    margin: 10,
    width: "100%",
    alignItems: "center",
    height: 70,
  },
  levelButtonText: {
    color: "white",
    fontSize: 25,
    fontFamily: "Nunito",
  },
  backButton: {
    backgroundColor: "#b22222",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 55,
    margin: 10,
    width: "100%",
    alignItems: "center",
    height: 70,
    justifyContent: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 25,
    fontFamily: "Nunito",
  },
});

export default ChooseLevelScreen;
