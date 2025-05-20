"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { timerService } from "@/services/apiServices";
import { useAuth } from "./AuthContext";

type TimerContextType = {
  remainingSeconds: number;
  setIsCountdownActive: React.Dispatch<React.SetStateAction<boolean>>;
  isCountdownActive: boolean;
  formatSeconds: (totalSeconds: number) => string;
  startTimer: (h: number, m: number) => {};
  cancelTimer: () => {};
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);

  const { logout } = useAuth();

  // Fetch status from backend
  const getRemainingSeconds = () => {
    timerService
      .getRemainingTime()
      .then((response) => {
        const data = response.data;
        setRemainingSeconds(data);
        if (response.data <= 0) {
          setIsCountdownActive(false);
          logout();
        }
      })
      .catch((error) => {
        console.error("Error fetching timer status:", error);
      });
  };

  const cancelTimer = async () => {
    timerService.canclelCountdown().then(() => {
      setIsCountdownActive(false);
    });
  };

  const startTimer = async (h: number, m: number) => {
    timerService
      .startCountdown(h, m)
      .then(() => {
        getRemainingSeconds();
        setIsCountdownActive(true);
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  };

  useEffect(() => {
    if (!isCountdownActive) {
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
  }, [isCountdownActive]);

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
        remainingSeconds,
        setIsCountdownActive,
        isCountdownActive,
        formatSeconds,
        startTimer,
        cancelTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
