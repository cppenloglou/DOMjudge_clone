import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTimer } from "@/context/TimerContext";
import { useProblems } from "@/context/ProblemContext";
import { useTeams } from "@/context/TeamContext";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const { isCountdownActive, formatSeconds, remainingSeconds } = useTimer();
  const { problemCount, fetchProblems } = useProblems();
  const { teams } = useTeams();
  const [userTeam, setUserTeam] = useState<any>(null);
  const contestName = "ICPC Regional 2025";

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProblems(0, problemCount, "all");
    // Get current user's team from JWT token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ team_id: number }>(token);
        const teamId = decoded.team_id;
        const currentTeam = teams.find((team) => team.team_id === teamId);
        if (currentTeam) {
          setUserTeam(currentTeam);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    // Set loading to false after checking for user team
    setIsLoading(false);
  }, [teams]);

  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to CodeJudge</h1>
      {isLoading ? (
        <div className="text-center py-8">Loading dashboard data...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Current Contest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{contestName}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {problemCount || "Loading..."} problems
                </span>
                <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                  {isCountdownActive ? (
                    <>
                      <Clock className="h-3 w-3" />
                      {formatSeconds(remainingSeconds)}
                    </>
                  ) : (
                    "Not Active"
                  )}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-center w-full text-sm font-medium text-muted-foreground">
                Have fun! 🎉 Good luck! 🍀
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Problem Set</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Practice your skills</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {problemCount || "120+"} problems
                </span>
                <span className="text-sm font-medium bg-green-500/10 text-green-600 px-2 py-1 rounded">
                  {problemCount || "120+"} solved
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/problems">
                  Browse Problems <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {userTeam ? userTeam.name : "Team Alpha"}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {userTeam
                    ? userTeam.members.split(",").length > 0
                      ? userTeam.members.split(",").length
                      : userTeam.members.length > 0
                      ? userTeam.members.length
                      : "3"
                    : "3"}{" "}
                  members
                </span>
                <span className="text-sm font-medium bg-blue-500/10 text-blue-600 px-2 py-1 rounded">
                  Rank #{userTeam ? userTeam.rank : "5"}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/profile">
                  Team Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </main>
  );
}
