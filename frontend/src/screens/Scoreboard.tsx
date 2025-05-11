"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Clock, Medal, Trophy, XCircle } from "lucide-react";
import { useProblems } from "@/context/ProblemContext";
import { useTeams } from "@/context/TeamContext";
import { useEffect } from "react";
import Loading from "@/screens/loading";
import { useTimer } from "@/context/TimerContext";

export default function ScoreboardPage() {
  const { problems, problemCount, fetchProblems } = useProblems();
  const { teams, loading, calculateTotalProblemsTime, fetchTeams } = useTeams();
  const { isCountdownActive, remainingSeconds, formatSeconds } = useTimer();

  useEffect(() => {
    fetchProblems(0, problemCount, "all");
    const interval = setInterval(() => {
      fetchTeams();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchTeams]);

  // Format time (minutes) to hours and minutes with a max of 3 digits after decimal
  const formatTime = (minutes: number) => {
    // Ensure the number has a maximum of 3 digits after decimal point
    const formattedMinutes = parseFloat(minutes.toFixed(3));

    const hours = Math.floor(formattedMinutes / 60);
    const mins = formattedMinutes % 60;

    // Format mins to have a maximum of 3 decimal places
    const formattedMins = mins.toFixed(
      Math.min(3, (mins.toString().split(".")[1] || "").length)
    );

    return hours > 0 ? `${hours}h ${formattedMins}m` : `${formattedMins}m`;
  };

  // Get cell color based on problem status
  const getCellColor = (status: string | null, isFirst: boolean) => {
    switch (status) {
      case "Solved":
        return isFirst ? "bg-green-500/20" : "bg-green-500/10";
      case "Attempted":
        return "bg-red-500/10";
      case null:
        return "";
    }
  };

  if (loading) return <Loading size="large" overlay={true} />;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-6 sm:px-8 md:px-10">
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Scoreboard</h1>
            <p className="text-muted-foreground">
              Live rankings and results for all teams in the competition
            </p>
          </div>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span>ICPC Regional 2025 - Final Standings</span>
              </CardTitle>
              <CardDescription className="text-sm flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="font-medium">Contest duration:</span>
                  {isCountdownActive ? (
                    <>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatSeconds(remainingSeconds)}</span>
                    </>
                  ) : (
                    <span className="italic">Not Active</span>
                  )}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">Problems:</span>
                  <span>1-{problemCount}</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">Teams:</span>
                  <span>{teams.length}</span>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[60px] text-center">
                        Rank
                      </TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">Solved</TableHead>
                      <TableHead className="text-center">Time</TableHead>
                      {/* Problem columns */}
                      {problems.map((problem) => (
                        <TableHead
                          key={problem.id}
                          className="text-center w-[60px]"
                        >
                          {problem.id}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow
                        key={team.team_id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium text-center">
                          {team.rank <= 3 ? (
                            <div className="flex justify-center">
                              <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                  team.rank === 1
                                    ? "bg-yellow-500/20 text-yellow-600"
                                    : team.rank === 2
                                    ? "bg-gray-300/30 text-gray-600"
                                    : "bg-amber-600/20 text-amber-700"
                                }`}
                              >
                                <Medal className="h-4 w-4" />
                              </div>
                            </div>
                          ) : (
                            team.rank
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {team.university}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {team.solved}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatTime(calculateTotalProblemsTime(team))}
                        </TableCell>
                        {/* Problem results */}
                        {team.problems.map((problem) => {
                          // Find if this is the first team to solve this problem
                          const isFirstToSolve =
                            problem.status === "Solved" &&
                            team.rank ===
                              Math.min(
                                ...teams
                                  .filter((t) =>
                                    t.problems.some(
                                      (p) =>
                                        p.id === problem.id &&
                                        p.status === "Solved"
                                    )
                                  )
                                  .map((t) => t.rank)
                              );

                          return (
                            <TableCell
                              key={problem.id}
                              className={`text-center ${getCellColor(
                                problem.status,
                                isFirstToSolve
                              )}`}
                            >
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="w-full h-full flex items-center justify-center">
                                    {problem.status === "Solved" ? (
                                      <div className="flex flex-col items-center">
                                        <span className="text-green-600 font-medium">
                                          {problem.attempts > 1
                                            ? `+${problem.attempts - 1}`
                                            : ""}
                                        </span>
                                        <span className="text-xs flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {parseFloat(problem.time.toFixed(3))}
                                        </span>
                                      </div>
                                    ) : problem.status === "Attempted" ? (
                                      <span className="text-red-500 font-medium">
                                        -{problem.attempts}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {problem.status === "Solved" ? (
                                      <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>
                                          Solved in{" "}
                                          {parseFloat(problem.time.toFixed(3))}{" "}
                                          minutes
                                          {problem.attempts > 1
                                            ? ` with ${problem.attempts} attempts`
                                            : ""}
                                          {isFirstToSolve
                                            ? " (First to solve!)"
                                            : ""}
                                        </span>
                                      </div>
                                    ) : problem.status === "Attempted" ? (
                                      <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span>
                                          {problem.attempts} unsuccessful
                                          attempts
                                        </span>
                                      </div>
                                    ) : (
                                      <span>Not attempted</span>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-green-500/20"></div>
                <span>First to solve</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-green-500/10"></div>
                <span>Solved</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-red-500/10"></div>
                <span>Attempted</span>
              </div>
            </div>
            <div>
              Last updated: {new Date().toLocaleTimeString()} • Auto-refresh: 1
              minute
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
