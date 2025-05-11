"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { timerService } from "@/services/apiServices";
import { useAuth } from "./AuthContext";

type TimerContextType = {
  remainingSeconds: number;
  setIsCountdownActive: React.Dispatch<React.SetStateAction<boolean>>;
  isCountdownActive: boolean;
  formatSeconds: (totalSeconds: number) => string;
  startTimer: (h: number, m: number) => {};
  loading: boolean;
  getRemainingSeconds: () => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const token = useAuth();
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch remaining seconds from backend
  // This function fetches the remaining seconds from the backend and sets the
  // remainingSeconds state with the response data. It also handles loading
  // state and errors. It uses the timerService to make the API call.
  const getRemainingSeconds = () => {
    // Only make API call if authenticated
    if (!token) return;

    timerService
      .getRemainingTime()
      .then((response) => {
        const data = response.data;
        setRemainingSeconds(data);
        if (data > 0) {
          if (isCountdownActive) {
            setIsCountdownActive(true);
          }
        } else {
          setIsCountdownActive(false);
        }
      })
      .catch((error: unknown) => {
        console.error("Error fetching timer status:", error);
      });
  };

  // Start timer function
  // This function starts the timer with the given hours and minutes. It sets
  // the loading state to true while the timer is starting. It uses the
  // timerService to make the API call. It also handles errors and sets the
  // loading state to false when the timer is started. It also fetches the
  // remaining seconds from the backend and sets the isCountdownActive state
  // to true.
  const startTimer = async (h: number, m: number) => {
    // Only start timer if authenticated
    if (!token) return {};

    setLoading(true);
    await timerService
      .startCountdown(h, m)
      .catch((err: unknown) => {
        console.error(err);
        return;
      })
      .finally(() => {
        setLoading(false);
      });
    getRemainingSeconds();
    setIsCountdownActive(true);
  };

  useLayoutEffect(() => {
    // Only fetch timer data if user is authenticated
    if (token) {
      setLoading(true);
      timerService
        .isCountdownActive()
        .then((response) => {
          console.log("isCountdownActive", response.data);
          setIsCountdownActive(response.data);
        })
        .catch((error: unknown) => {
          console.error("Error fetching timer status:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token]);

  useEffect(() => {
    // Don't run timer logic if not authenticated or timer is not active
    if (!token || !isCountdownActive) {
      return;
    }

    getRemainingSeconds();

    // Update clock every second
    const clockInterval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(clockInterval);
          return 0;
        }
      });
    }, 1000);

    // Poll backend every 5 seconds to sync
    const pollInterval = setInterval(() => {
      getRemainingSeconds();
    }, 5000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(pollInterval);
    };
  }, [isCountdownActive, token]);

  const formatSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  return (
    <TimerContext.Provider
      value={{
        getRemainingSeconds,
        remainingSeconds,
        setIsCountdownActive,
        isCountdownActive,
        formatSeconds,
        startTimer,
        loading,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

// Define the hook separately from export to help with Fast Refresh compatibility
function useTimerHook() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}

export const useTimer = useTimerHook;
