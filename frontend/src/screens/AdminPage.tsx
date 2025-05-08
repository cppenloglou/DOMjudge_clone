"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useTimer } from "@/context/TimerContext";
import { useNavigate } from "react-router-dom";
import API from "@/services/api";

// Sample contests
const contests = [
  { id: "icpc2025", name: "ICPC Regional 2025" },
  { id: "spring", name: "CodeJudge Spring Challenge" },
  { id: "algo2024", name: "Algorithmic Battle 2024" },
  { id: "winter", name: "Winter Coding Cup" },
];

export default function AdminPage() {
  const [selectedContest, setSelectedContest] = useState("icpc2025");
  const [hours, setHours] = useState("5");
  const [minutes, setMinutes] = useState("0");
  const [isPublic, setIsPublic] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const {
    setIsCountdownActive,
    remainingSeconds,
    isCountdownActive,
    formatSeconds,
    startTimer,
  } = useTimer();

  const handleLogout = () => {
    logout();
    setIsCountdownActive(false);
    navigate("/login");
  };

  // Handle timer start
  const handleStartTimer = async () => {
    const totalMinutes = Number.parseInt(hours) * 60 + Number.parseInt(minutes);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    startTimer(h, m);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Handle timer pause
  const handlePauseTimer = () => {
    setIsCountdownActive(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-6 sm:px-8 md:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Admin Control Panel</h1>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
              onClick={handleLogout}
            >
              <div>
                Logout
                <LogOut className="h-4 w-4" />
              </div>
            </Button>
          </div>

          {showSuccess && (
            <Alert className="mb-6 bg-green-500/10 text-green-600 border-green-500/20">
              <Clock className="h-4 w-4" />
              <AlertTitle>Timer Started Successfully</AlertTitle>
              <AlertDescription>
                The contest timer has been started and is now visible to all
                participants.
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Contest Timer Control
              </CardTitle>
              <CardDescription>
                Start or pause the timer for the selected contest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    disabled={isCountdownActive}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    disabled={isCountdownActive}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                {remainingSeconds && (
                  <div className="text-lg font-mono font-medium">
                    {formatSeconds(remainingSeconds)}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              {!isCountdownActive ? (
                <Button
                  className="w-full sm:w-auto flex items-center gap-2"
                  onClick={handleStartTimer}
                  disabled={!hours && !minutes}
                >
                  <Play className="h-4 w-4" />
                  Start Timer
                </Button>
              ) : (
                <Button
                  className="w-full sm:w-auto flex items-center gap-2"
                  variant="outline"
                  onClick={handleStartTimer}
                  disabled={!remainingSeconds}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Timer
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contest Status</CardTitle>
              <CardDescription>
                Current status of the selected contest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contest:</span>
                  <span className="font-medium">
                    {contests.find((c) => c.id === selectedContest)?.name || ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">
                    {isCountdownActive ? (
                      <span className="text-green-600">Running</span>
                    ) : remainingSeconds ? (
                      <span className="text-yellow-600">Paused</span>
                    ) : (
                      <span className="text-muted-foreground">Not Started</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {hours}h {minutes}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Timer Visibility:
                  </span>
                  <span className="font-medium">
                    {isPublic ? "Public" : "Admin Only"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
