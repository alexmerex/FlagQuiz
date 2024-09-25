## Overview
This project is a quiz application built using React Native for the frontend and Node.js with Firebase Realtime Database for the backend. It supports user authentication, level selection, question handling, score submission, and leaderboard management. The frontend includes several screens for user interactions, while the backend handles data storage, retrieval, and updates in the Firebase database.

## Prerequisites

### Backend (Node.js)
1. **Node.js**: Ensure Node.js is installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
2. **Firebase Admin SDK**: Used for server-side interactions with Firebase Realtime Database.
3. **Firebase Realtime Database**: Make sure you have a Firebase project set up with Realtime Database enabled.
4. **Service Account Key**: A JSON file for Firebase Admin SDK authentication.

### Frontend (React Native)
1. **React Native**: Ensure you have React Native installed. You can follow the setup guide from [React Native Documentation](https://reactnative.dev/docs/environment-setup).
2. **Expo CLI**: Used to run and build React Native projects. Install it using:
   ```bash
   npm install -g expo-cli
   ```
3. **Dependencies**: The project uses various libraries like `react-navigation`, `axios`, `expo-font`, etc.

## Backend Setup

1. **Install Dependencies**:
   Navigate to the backend directory and install the necessary packages using:
   ```bash
   npm install
   ```

2. **Firebase Configuration**:
   - Place your Firebase service account key file (`flagquiz-7f7c5-firebase-adminsdk-d4rit-b5911b1f4c.json`) in the root of the backend project directory.
   - Ensure your Firebase Realtime Database URL is correctly set in the `firebaseConfig` object in the `server.js` file.

3. **Start the Server**:
   Start the Node.js server using:
   ```bash
   node server.js
   ```
   The server will run on the specified port (default is 3000).

## Frontend Setup

1. **Install Dependencies**:
   Navigate to the frontend directory and install the necessary packages using:
   ```bash
   npm install
   ```
   or
   ```bash
   expo install
   ```

2. **Run the Application**:
   Start the React Native application using Expo:
   ```bash
   expo start
   ```
   Use a mobile emulator or scan the QR code with the Expo Go app on your mobile device to see the app in action.

## Project Structure

### Backend (Node.js)
- **`server.js`**: Main server file with all API routes defined for user authentication, score management, and leaderboard updates.
- **`flagquiz-7f7c5-firebase-adminsdk-d4rit-b5911b1f4c.json`**: Firebase service account key file for authentication.

### Frontend (React Native)
- **`LoginScreen.js`**: Handles user login functionality.
- **`RegisterScreen.js`**: Manages user registration.
- **`MainScreen.js`**: Main menu screen with options to play, view leaderboard, or log out.
- **`LevelSelectionScreen.js`**: Allows users to select the quiz level (Easy, Normal, Hard).
- **`QuestionScreen.js`**: Displays questions based on the selected level, handles user answers, and manages the quiz timer.
- **`ResultScreen.js`**: Shows the final score and updates the leaderboard in the backend.
- **`LeaderboardScreen.js`**: Displays the top scores for each level.

## API Endpoints

### User Authentication
- **POST `/login`**: Authenticates a user with `username` and `password`.
- **POST `/register`**: Registers a new user.

### Question Handling
- **GET `/questions?LevelID_FK=level_id`**: Retrieves questions based on the specified level.

### Score Management
- **POST `/add-score`**: Adds a new score to the leaderboard.
- **POST `/update-score`**: Updates an existing score for a user.

### Leaderboard
- **GET `/scoreboard?LevelID=level_id`**: Retrieves the leaderboard based on the specified level.

## Error Handling
- The backend includes basic error handling to catch and log issues during database queries or data processing.
- Errors are logged to the console, and a relevant error message is returned to the client.

## Customization
- **Firebase Configuration**: Modify the Firebase configuration in the `server.js` file as needed.
- **UI Customization**: You can modify the styles and layouts in the React Native screens to suit your requirements.

## Deployment
- **Backend**: Deploy the Node.js server to a platform like Heroku, AWS, or Google Cloud.
- **Frontend**: Build and deploy the React Native app using Expo or build a standalone APK/IPA.
  
## Acknowledgments
Thanks to the developers of the open-source libraries used in this project, such as Express, Firebase, React Native, and Expo.

---
