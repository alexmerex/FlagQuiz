import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
} from "react-native";
import axios from "axios";

const ResultScreen = ({ route, navigation }) => {
  const { score, username, levelID } = route.params;

  useEffect(() => {
    // Gửi điểm của người chơi lên cơ sở dữ liệu mỗi khi hoàn thành màn hình
    addScoreToDatabase(username, levelID, score);
  }, [username, levelID, score]);

  const addScoreToDatabase = async (username, levelID, score) => {
    try {
      // Gọi endpoint mới để lấy UserID
      const userResponse = await axios.get(
        `http://192.168.1.11:3000/get-user-id/${username}`
      );

      if (userResponse.data.success) {
        const userID = userResponse.data.UserID;

        // Sử dụng UserID để gửi điểm của người chơi lên cơ sở dữ liệu
        const response = await axios.post(
          "http://192.168.1.11:3000/add-score",
          {
            LevelID: levelID,
            Position: 1,
            Score: score,
            UserID: userID,
          }
        );

        // In ra console để kiểm tra dữ liệu được gửi lên
        console.log("Data sent to Firebase:", {
          LevelID: levelID,
          Position: 1,
          Score: score,
          UserID: userID,
        });

        if (response.data.success) {
          console.log("Score updated successfully");
        } else {
          console.error("Error updating score:", response.data.message);
        }
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../image/logo.png")} style={styles.img} />
      <View style={styles.form}>
        <Text style={styles.text}>Quiz Completed!</Text>
        <Text style={styles.modalText}>Your Score</Text>
        <Text style={styles.modalText}>{score}</Text>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => {
            navigation.navigate("MainScreen", { username });
          }}
        >
          <Text style={styles.textStyle}>Return to Menu</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000E56",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#3D05B5",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#5200FF",
    marginBottom: 20,
  },
buttonOpen: {
    backgroundColor: "red",
    width: 256,
    borderRadius: 55,
  },
  buttonScoreClose: {
    backgroundColor: "#3D05B5",
    width: 256,
    borderRadius: 55,
    borderColor: "white",
    borderWidth: 3,
  },
  buttonClose: {
    backgroundColor: "#b22222",
    width: 256,
    borderRadius: 55,
    borderRadius: 55,
    borderColor: "white",
    borderWidth: 3,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Nunito",
    fontSize: 25,
    color: "white",
  },
  text: {
    color: "white",
    textAlign: "center",
    fontFamily: "Nunito",
    fontSize: 30,
    marginBottom: 20,
  },

  form: {
    top: -50,
    margin: 20,
    backgroundColor: "#3D05B5",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Nunito",
    fontSize: 30,
    color: "white",
  },
});

export default ResultScreen;
