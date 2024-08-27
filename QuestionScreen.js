import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_ENDPOINT = "http://192.168.1.163:3000/questions";

const QuestionScreen = ({ route, navigation }) => {
  const { levelID, username } = route.params;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsLimit] = useState(10);
  const [timer, setTimer] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const timerRef = useRef();

  useEffect(() => {
    fetch(`${API_ENDPOINT}?LevelID_FK=${levelID}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (typeof data === "object" && data !== null) {
          const dataArray = Object.values(data);

          const questionsWithShuffledAnswers = dataArray.map((question) => {
            const shuffledAnswers = shuffleArray([
              question.AnswerA,
              question.AnswerB,
              question.AnswerC,
              question.AnswerD,
            ]);
            return {
              ...question,
              Answers: shuffledAnswers,
            };
          });

          const shuffledQuestions = shuffleArray(
            questionsWithShuffledAnswers
          ).slice(0, questionsLimit);
          setQuestions(shuffledQuestions);
          startTimer();
        } else {
          console.error("Dữ liệu không phải là object.");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy câu hỏi:", error);
      });

    return () => {
      clearInterval(timerRef.current);
    };
  }, [levelID]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimer(30);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
      if (timer <= 0) {
        clearInterval(timerRef.current);
        handleAnswer(null);
      }
    }, 1000);
  };

  const handleAnswer = (selectedAnswer) => {
    clearInterval(timerRef.current);

    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      if (selectedAnswer === currentQuestion.CorrectAnswer) {
        const questionScore = Math.max(100 - (30 - timer), 10);
        setScore(score + questionScore);
      }

      if (currentQuestionIndex < questionsLimit - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimer(30);
        timerRef.current = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
          if (timer <= 0) {
            clearInterval(timerRef.current);
            handleAnswer(null);
          }
        }, 1000);
        setSelectedAnswer(null);
      } else {
        const finalScore = score / (questionsLimit * 10);
        navigation.navigate("ResultScreen", {
          score: finalScore,
          username,
          levelID,
        });
      }
    } else {
      console.error("Không có câu hỏi hiện tại");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.timerText}>{timer} giây</Text>
      {questions.length > 0 ? (
        <View style={styles.questionImageContainer}>
          {questions[currentQuestionIndex] &&
          questions[currentQuestionIndex].QuestionType === "1" ? (
            <Image
              style={styles.questionImage}
              source={{
                uri: questions[currentQuestionIndex].QuestionText,
              }}
            />
          ) : (
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex]
                ? questions[currentQuestionIndex].QuestionText
                : ""}
            </Text>
          )}
          {questions[currentQuestionIndex] &&
          questions[currentQuestionIndex].QuestionType === "1" ? (
            <View style={styles.answerContainerType1}>
              {questions[currentQuestionIndex].Answers.map((answer, index) => (
                <TouchableOpacity
                  key={answer}
                  style={[
                    answerStyles.answerButtonType1,
                    selectedAnswer === answer
                      ? answerStyles.selectedAnswerButtonType1
                      : null,
                  ]}
                  onPress={() => handleAnswer(answer)}
                >
                  <Text
                    style={[
                      selectedAnswer === answer
                        ? answerStyles.selectedAnswerText
                        : answerStyles.answerText,
                    ]}
                  >
                    {String.fromCharCode(65 + index)}. {answer}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.answerContainerType2}>
              {questions[currentQuestionIndex]
                ? questions[currentQuestionIndex].Answers.map(
                    (answer, index) => (
                      <TouchableOpacity
                        key={answer}
                        style={[
                          styles.answerButtonType2,
                          selectedAnswer === answer
                            ? styles.selectedAnswerButtonType2
                            : null,
                        ]}
                        onPress={() => handleAnswer(answer)}
                      >
                        <Image
                          style={styles.AnswerImage}
                          source={{ uri: answer }}
                        />
                      </TouchableOpacity>
                    )
                  )
                : null}
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.loadingText}>Đang tải...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000E56",
    alignItems: "center",
  },
  scoreContainer: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  scoreText: {
    fontSize: 18,
    color: "white",
  },
  timerText: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
  },
  answerContainerType1: {
    marginTop: "10%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  answerContainerType2: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
  },
  answerText: {
    fontSize: 20,
    color: "white",
  },
  selectedAnswerText: {
    fontSize: 20,
    color: "black",
  },
  answerButtonType2: {
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 8,
    margin: 3,
  },
  selectedAnswerButtonType2: {
    backgroundColor: "black",
    color: "white",
  },
  questionText: {
    marginTop: "15%",
    fontSize: 18,
    marginBottom: "10%",
    textAlign: "center",
    color: "white",
    fontFamily: "Nunito",
  },
  questionImageContainer: {
    alignItems: "center",
  },

  questionImage: {
    top: 20,
    height: 230,
    resizeMode: "stretch",
    width: 300,
  },

  AnswerImage: {
    top: 20,
    height: 120,
    resizeMode: "stretch",
    width: 240,
    borderWidth: 2,
    borderColor: "#5200FF",
  },
  loadingText: {
    fontSize: 20,
    color: "white",
    fontFamily: "Nunito",
  },
});

const answerStyles = StyleSheet.create({
  // Khi câu hỏi có QuestionType === 1
  answerText: {
    fontSize: 20,
    color: "white",
    fontFamily: "Nunito",
  },
  selectedAnswerText: {
    fontSize: 20,
    color: "black",
    fontFamily: "Nunito",
  },
  answerButtonType1: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0073D6",
    width: 167,
    height: 107,
    borderRadius: 8,
    margin: 5,
  },
  selectedAnswerButtonType1: {
    backgroundColor: "black",
    color: "white",
  },
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default QuestionScreen;
