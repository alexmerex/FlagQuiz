import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useFonts } from "expo-font";

function MainScreen({ navigation, route }) {
  const { username } = route.params;
  let [] = useFonts({
    Nunito: require("../assets/fonts/Nunito-SemiBold.ttf"),
  });

  const handleLogout = async () => {
    await AsyncStorage.removeItem("username");
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  return (
    // <View style={styles.container}>
    //   <View style={styles.backgroundLogo}>
    //     <ImageBackground
    //       style={styles.background}
    //       source={require("../image/Vector2.png")}
    //     >
    //       <Image style={styles.Logo} source={require("../image/logo.png")} />
    //     </ImageBackground>
    //   </View>
    //   <View style={styles.screen}>
    //     <View style={styles.letPlay}>
    //       <Text style={styles.letPlayFont}>Let’s Play!</Text>
    //     </View>
    //     <View style={styles.buttonContainer}>
    //       <TouchableOpacity
    //         style={styles.play}
    //         onPress={() =>
    //           navigation.navigate("LevelSelectionScreen", { username })
    //         }
    //       >
    //         <View style={styles.buttonPlay}>
    //           <Text style={styles.btnPlayFont}>Play</Text>
    //         </View>
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //         style={styles.leaderboard}
    //         onPress={() =>
    //           navigation.navigate("LeaderboardScreen", { username })
    //         }
    //       >
    //         <View style={styles.buttonLeaderboard}>
    //           <Text style={styles.btnLeaderboardFont}>LeaderBoard</Text>
    //         </View>
    //       </TouchableOpacity>
    //     </View>
    //     <TouchableOpacity style={styles.exitButton} onPress={handleLogout}>
    //       <Text style={styles.exitButtonText}>Exit</Text>
    //     </TouchableOpacity>
    //   </View>
    // </View>

    <View style={styles.container}>
      <View style={styles.backgroundLogo}>
        <Image source={require("../image/Vector2.png")} />
        <Image style={styles.Logo} source={require("../image/logo.png")} />
      </View>
      <View style={styles.screen}>
        <View style={styles.letPlay}>
          <Text style={styles.letPlayFont}>Let’s Play!</Text>
        </View>
        <TouchableOpacity
          style={styles.play}
          onPress={() =>
            navigation.navigate("LevelSelectionScreen", { username })
          }
        >
          <View style={styles.buttonPlay}>
            <Text style={styles.btnPlayFont}>Play</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.leaderboard}
          onPress={() => navigation.navigate("LeaderboardScreen", { username })}
        >
          <View style={styles.buttonLeaderboard}>
            <Text style={styles.btnLeaderboardFont}>LeaderBoard</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitButton} onPress={handleLogout}>
          <Text style={styles.exitButtonText}>Exit</Text>
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

  Logo: {
    position: "absolute",
    marginTop: "20%",
  },

  letPlay: {
    alignItems: "center",
  },

  letPlayFont: {
    color: "white",
    fontSize: 40,
    fontFamily: "Nunito",
  },

  buttonPlay: {
    backgroundColor: "#5200FF",
    borderRadius: 55,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  btnPlayFont: {
    color: "white",
    fontSize: 30,
    fontFamily: "Nunito",
  },

  buttonLeaderboard: {
    borderColor: "#5200FF",
    borderWidth: 2,
    borderRadius: 55,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  btnLeaderboardFont: {
    color: "#5200FF",
    fontSize: 30,
    fontFamily: "Nunito",
  },

  screen: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },
  exitButton: {
    backgroundColor: "#b22222",
    borderColor: "##5200FF",
    borderWidth: 2,
    borderRadius: 55,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  exitButtonText: {
    color: "white",
    fontSize: 30,
    fontFamily: "Nunito",
  },
});

export default MainScreen;
