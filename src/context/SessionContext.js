import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "flagQuiz.session";
const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => value && setSession(JSON.parse(value)))
      .catch(() => AsyncStorage.removeItem(STORAGE_KEY))
      .finally(() => setIsRestoring(false));
  }, []);

  const value = useMemo(
    () => ({
      session,
      isRestoring,
      signIn: async (nextSession) => {
        setSession(nextSession);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      },
      signOut: async () => {
        setSession(null);
        await AsyncStorage.removeItem(STORAGE_KEY);
      },
    }),
    [session, isRestoring]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside SessionProvider");
  return context;
}
