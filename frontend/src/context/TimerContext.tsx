"use client";

import API from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";

type TimerContextType = {
  remainingSeconds: number;
  setIsCountdownActive: React.Dispatch<React.SetStateAction<boolean>>;
  isCountdownActive: boolean;
  formatSeconds: (totalSeconds: number) => string;
  startTimer: (h: number, m: number) => {};
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_APP_BASE_URL;

  // Fetch status from backend
  const getRemainingSeconds = () => {
    API.get(`${API_URL}/clock/remaining-time`)
      .then((response) => {
        const data = response.data;
        setRemainingSeconds(data);
      })
      .catch((error) => {
        console.error("Error fetching timer status:", error);
      });
  };

  const startTimer = async (h: number, m: number) => {
    await API.post(`${API_URL}/clock/start-countdown?h=${h}&m=${m}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }).catch((err) => {
      console.error(err);
      return;
    });
    getRemainingSeconds();
    setIsCountdownActive(true);
  };

  useEffect(() => {
    API.get(`${API_URL}/clock/is-countdown-active`)
      .then((response) => {
        setIsCountdownActive(response.data);
      })
      .catch((error) => {
        console.error("Error fetching timer status:", error);
      });
  }, []);

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
