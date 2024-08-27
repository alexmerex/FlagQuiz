const express = require("express");
const firebase = require("firebase-admin");
const serviceAccount = require("./flagquiz-7f7c5-firebase-adminsdk-d4rit-b5911b1f4c.json"); // Đường dẫn đến tệp JSON chứa thông tin xác thực Firebase Admin
const cors = require("cors");
const app = express();

app.use(cors());

const firebaseConfig = {
  credential: firebase.credential.cert(serviceAccount),
  databaseURL:
    "https://flagquiz-7f7c5-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

app.use(express.json());

function updateLeaderboard() {
  const scoreboardRef = db.ref("Scoreboard");

  scoreboardRef
    .orderByChild("Score")
    .once("value")
    .then((snapshot) => {
      const leaderboard = snapshot.val();

      // Sắp xếp lại mảng theo điểm số giảm dần
      const sortedLeaderboard = Object.values(leaderboard).sort(
        (a, b) => b.Score - a.Score
      );

      // Cập nhật lại vị trí cho từng bản ghi
      sortedLeaderboard.forEach((entry, index) => {
        scoreboardRef.child(entry.ScoreID).update({
          Position: index + 1,
        });
      });
    })
    .catch((err) => {
      console.error("Lỗi truy vấn:", err);
    });
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const usersRef = db.ref("users");

  usersRef
    .orderByChild("Username")
    .equalTo(username)
    .once("value")
    .then((snapshot) => {
      const user = snapshot.val();

      if (user) {
        const savedPassword = user[Object.keys(user)[0]].Password;

        if (password === savedPassword) {
          res.json({ success: true, message: "Đăng nhập thành công" });
        } else {
          res.json({ success: false, message: "Mật khẩu không đúng" });
        }
      } else {
        res.json({ success: false, message: "Tài khoản không tồn tại" });
      }
    })
    .catch((err) => {
      console.error("Lỗi truy vấn:", err);
      res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    });
});

app.get("/questions", (req, res) => {
  const { LevelID_FK } = req.query; // Sử dụng req.query để lấy tham số từ query string

  if (!LevelID_FK) {
    return res.status(400).json({ error: "Thiếu tham số LevelID_FK" });
  }

  const questionsRef = db.ref("questions");

  questionsRef
    .orderByChild("LevelID_FK")
    .equalTo(LevelID_FK)
    .once("value")
    .then((snapshot) => {
      const questions = snapshot.val();
      res.json(questions);
    })
    .catch((err) => {
      console.error("Lỗi truy vấn:", err);
      res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    });
});

app.get("/get-user-id/:Username", (req, res) => {
  const { Username } = req.params;
  const usersRef = db.ref("users");

  usersRef
    .orderByChild("Username")
    .equalTo(Username)
    .once("value")
    .then((snapshot) => {
      const userInfo = snapshot.val();

      if (userInfo) {
        const userID = Object.keys(userInfo)[0];
        res.json({ success: true, UserID: userID });
      } else {
        res.json({ success: false, message: "User not found" });
      }
    })
    .catch((err) => {
      console.error("Query error:", err);
      res.status(500).json({ success: false, message: "Database query error" });
    });
});

app.get("/users", (req, res) => {
  const usersRef = firebase.database().ref("users");

  usersRef
    .once("value")
    .then((snapshot) => {
      const users = snapshot.val();
      res.json(users);
    })
    .catch((err) => {
      console.error("Error querying database:", err);
      res.status(500).json({ error: "Error querying database" });
    });
});

app.get("/check-username/:username", (req, res) => {
  const { username } = req.params;
  const usersRef = db.ref("users");

  usersRef
    .orderByChild("Username")
    .equalTo(username)
    .once("value")
    .then((snapshot) => {
      const user = snapshot.val();
      res.json(user);
    })
    .catch((err) => {
      console.error("Lỗi truy vấn:", err);
      res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    });
});

// Rest of your routes...

// Route API để lấy thông tin xếp hạng dựa trên LevelID
app.get("/scoreboard", (req, res) => {
  const { LevelID } = req.query;

  if (!LevelID) {
    return res.status(400).json({ error: "Thiếu tham số LevelID" });
  }

  const questionsRef = db.ref("scoreboard");

  questionsRef
    .orderByChild("LevelID")
    .equalTo(LevelID)
    .once("value")
    .then((snapshot) => {
      const questions = snapshot.val();

      const sortedData = Object.values(questions).sort(
        (a, b) => b.Score - a.Score
      );

      // Chuyển đổi Position thành số nguyên
      sortedData.forEach((item, index) => {
        item.Position = index + 1;
      });

      res.json(sortedData);
    })
    .catch((err) => {
      console.error("Lỗi truy vấn:", err);
      res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const usersRef = db.ref("users");

  // Tạo một bản ghi mới và lấy khóa (key) của nó
  const newRecordRef = usersRef.push({
    Username: username,
    Password: password
  });

  const generatedUserID = newRecordRef.key;

  // Thêm trường UserID vào bản ghi với giá trị giống với generatedUserID
  newRecordRef.update({
    UserID: generatedUserID
  })
  .then(() => {
    res.json({ success: true, message: "Đăng ký thành công" });
  })
  .catch((err) => {
    console.error("Lỗi thêm trường UserID:", err);
    res.status(500).json({ error: "Lỗi đăng ký" });
  });
});


app.post("/add-score", (req, res) => {
  const { LevelID, Score, UserID } = req.body;

  // Chuyển đổi Score thành số thực
  const numericScore = parseFloat(Score);

  const scoreboardRef = db.ref("scoreboard");

  scoreboardRef
    .push({
      LevelID: LevelID,
      Score: numericScore,
      UserID: UserID,
      Position: 0,
    })
    .then(() => {
      res.json({ success: true, message: "Thêm điểm thành công" });
    })
    .catch((err) => {
      console.error("Lỗi thêm điểm:", err);
      res.status(500).json({ error: "Lỗi thêm điểm vào cơ sở dữ liệu" });
    });
});

app.post("/update-score", (req, res) => {
  const { Username, NewScore } = req.body;
  const usersRef = db.ref("users");
  const scoreboardRef = db.ref("Scoreboard");

  usersRef
    .orderByChild("Username")
    .equalTo(Username)
    .once("value")
    .then((snapshot) => {
      const user = snapshot.val();

      if (user) {
        const UserID = Object.keys(user)[0];

        scoreboardRef
          .orderByChild("UserID")
          .equalTo(UserID)
          .once("value")
          .then((scoreSnapshot) => {
            const scoreData = scoreSnapshot.val();
            const scoreID = Object.keys(scoreData)[0];

            scoreboardRef.child(scoreID).update({ Score: NewScore });

            res.json({ success: true, message: "Cập nhật điểm số thành công" });
          })
          .catch((err) => {
            console.error("Lỗi truy vấn:", err);
            res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
          });
      } else {
        res.status(400).json({ error: "Username không tồn tại" });
      }
    })
    .catch((err) => {
      console.error("Lỗi truy vấn:", err);
      res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    });
});

// Thêm các route khác tại đây nếu cần

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server is running on port: ${PORT}`);
});
