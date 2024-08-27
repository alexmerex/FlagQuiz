import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Pressable,
} from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const navigation = useNavigation();

  let [] = useFonts({
    Nunito: require("../assets/fonts/Nunito-SemiBold.ttf"),
  });

  const handleRegister = async () => {
    try {
      if (!username || !password) {
        setErrorModalVisible(true);
        return;
      }

      // Gọi API để kiểm tra thông tin đăng ký
      const response = await fetch("http://192.168.1.163:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Chuyển hướng đến màn hình đăng nhập
          navigation.navigate("LoginScreen");
        } else {
          setMessage("Lỗi đăng ký: " + result.message);
        }
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundLogo}>
        <ImageBackground
          style={styles.background}
          source={require("../image/Vector2.png")}
        >
          <Image style={styles.Logo} source={require("../image/logo.png")} />
        </ImageBackground>
      </View>

      <View style={styles.screen}>
        <View style={styles.Register}>
          <Text style={styles.letPlayFont}>Register</Text>
        </View>
        <TextInput
          style={styles.User}
          placeholder="Username"
          placeholderTextColor={"#B7B7B7"}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.User}
          placeholder="Password"
          placeholderTextColor={"#B7B7B7"}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />

        {/* <Button title="Register" onPress={handleRegister} /> */}
        <TouchableOpacity style={styles.play} onPress={handleRegister}>
          <View style={styles.buttonPlay}>
            <Text style={styles.btnPlayFont}>Register</Text>
          </View>
        </TouchableOpacity>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <TouchableOpacity
          style={styles.signuplink}
          onPress={() => navigation.navigate("LoginScreen")}
        >
<Text style={styles.signuplink}>Đã có tài khoản? Đăng nhập ngay</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Closed.");
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Account have already exists</Text>
            <Pressable
              style={[styles.button, styles.buttonScoreClose]}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => {
          Alert.alert("Closed.");
          setErrorModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Username and password must not be left blank
            </Text>
            <Pressable
              style={[styles.button, styles.buttonScoreClose]}
              onPress={() => {
                setErrorModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "auto",
    flex: 1,
    backgroundColor: "#000E56",
  },

  Register: {
    alignItems: "center",
  },

  backgroundLogo: {
    width: "100%",
    alignItems: "center",
  },

  Logo: {
    width: 388,
    marginTop: "20%",
  },

  letPlay: {
    alignItems: "center",
  },

  letPlayFont: {
    color: "white",
    fontSize: 40,
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

  User: {
    borderColor: "#5200FF",
    borderWidth: 2,
    borderRadius: 55,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontSize: 25,
    color: "white",
    fontFamily: "Nunito",
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
    gap: 20,
  },

  signup: {
    color: "#B7B7B7",
    fontSize: 15,
    fontFamily: "Nunito",
  },

  signuplink: {
    color: "#5200FF",
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Nunito",
  },

  signupRow: {
    flexDirection: "row",
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

  buttonScoreClose: {
    backgroundColor: "#3D05B5",
    width: 256,
    borderRadius: 55,
    borderColor: "white",
    borderWidth: 3,
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Nunito",
    fontSize: 25,
    color: "white",
  },

  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Nunito",
    fontSize: 25,
    color: "white",
  },
});
export default RegisterScreen;