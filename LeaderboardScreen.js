import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";

function LeaderboardScreen() {
  const [fontsLoaded] = useFonts({
    Nunito: require("../assets/fonts/Nunito-SemiBold.ttf"),
  });

  const [scores, setScores] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("1");
  const [loading, setLoading] = useState(true); // Sử dụng biến loading để kiểm tra trạng thái của fonts
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params || {};

  const levelOptions = [
    { label: "Easy", value: "1" },
    { label: "Normal", value: "2" },
    { label: "Hard", value: "3" },
  ];

  useEffect(() => {
    const fetchScoreboard = fetch(
      `http://192.168.1.163:3000/scoreboard?LevelID=000000000${selectedLevel}`
    ).then((response) => response.json());

    const fetchUsers = fetch("http://192.168.1.163:3000/users").then((response) =>
      response.json()
    );

    Promise.all([fetchScoreboard, fetchUsers])
      .then(([scoreboardData, userData]) => {
        // Kiểm tra xem scoreboardData có phải là mảng không
        if (Array.isArray(scoreboardData)) {
          const userArray = Object.values(userData);

          const combinedData = scoreboardData.map((score) => {
            const user = userArray.find((u) => u.UserID === score.UserID);
            return {
              ...score,
              Username: user ? user.Username : "Unknown",
            };
          });
          setScores(combinedData);
        } else {
          console.error(
            "Dữ liệu từ server không phải là mảng:",
            scoreboardData
          );
        }
      })
      .catch((error) => console.error(error));
  }, [selectedLevel]);
  // Kiểm tra nếu fonts chưa tải xong, thì hiển thị Loading
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  // Sau khi fonts tải xong, hiển thị nội dung màn hình
  return (
    <ImageBackground
      style={styles.container}
      source={require("../image/Vector2.png")}
    >
      <Text style={styles.title}>LeaderBoard</Text>

      <View style={styles.picker}>
        {levelOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.levelButton,
              selectedLevel === option.value && styles.selectedLevelButton,
              option.value === "0000000001" && styles.easyButton,
              option.value === "0000000002" && styles.mediumButton,
              option.value === "0000000003" && styles.hardButton,
            ]}
            onPress={() => setSelectedLevel(option.value)}
          >
            <Text style={styles.levelText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.LeaderboardTable}>
        <View style={styles.leaderboardItem}>
          <Text style={styles.leaderboardItemTextHeader}>Position</Text>
          <Text style={styles.leaderboardItemTextHeader}>UserName</Text>
          <Text style={styles.leaderboardItemTextHeader}>Score</Text>
        </View>
        {scores.map((player, index) => (
          <View key={index} style={styles.leaderboardItem}>
            <Text style={styles.leaderboardItemText}>{player.Position}</Text>
            <Text style={styles.leaderboardItemText}>{player.Username}</Text>
            <Text style={styles.leaderboardItemText}>{player.Score}</Text>
          </View>
        ))}
      </View>

      <View style={styles.logoView}>
        <Image style={styles.logo} source={require("../image/logo.png")} />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MainScreen", { username })}
      >
        <Text style={styles.buttonText}>Quay lại màn hình chính</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
    backgroundColor: "#000E56",
    justifyContent: "center", // Để căn giữa nội dung
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
    fontFamily: "Nunito",
    textAlign: "center",
  },
  picker: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  levelButton: {
    backgroundColor: "#5200FF",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    margin: 4,
  },
  selectedLevelButton: {
    backgroundColor: "#3D00CC",
  },
  levelText: {
    color: "white",
    fontSize: 18,
  },
  leaderboard: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  leaderboardItemText: {
    fontSize: 16,
    color: "white",
  },
  leaderboardItemTextHeader: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },

  logo: {
    width: 120,
    resizeMode: "stretch",
    height: 120,
    alignSelf: "center", // Để căn giữa logo
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#5200FF",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  LeaderboardTable: {
    marginLeft: "5%",
    marginRight: "5%",
    height: "43%",
    flex: 1,
    borderColor: "#5200FF",
    borderWidth: 2,
    borderRadius: 55,
    padding: 20,
  },
  easyButton: {
    backgroundC2olor: "red",
    borderRadius: 55,
    padding: 12,
  },
  mediumButton: {
    backgroundColor: "darkgreen",
    borderRadius: 55,
    padding: 12,
  },
  hardButton: {
    backgroundColor: "saddlebrown",
    borderRadius: 55,
    padding: 12,
  },
});

export default LeaderboardScreen;
