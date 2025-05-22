import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProblems } from "@/context/ProblemContext";
import { TeamInfo, useTeams } from "@/context/TeamContext";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [currentTeam, setCurrentTeam] = useState<TeamInfo>({} as TeamInfo);
  const { problemCount } = useProblems();
  const { getTeam, loading } = useTeams();

  useEffect(() => {
    const team = getTeam();
    if (team) {
      setCurrentTeam(team);
      console.log("Current Team Name:", team.name);
    }
  }, [currentTeam, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto w-350 px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to CodeJudge</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current Contest</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">ICPC Regional 2025</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {problemCount} problems
              </span>
              <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                Active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problem Set</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Practice your skills!</p>

            <span className="text-sm font-medium text-blue-600 px-2 py-1 rounded"></span>
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
            <p className="text-muted-foreground mb-4">{currentTeam.name}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {currentTeam.members}
              </span>
              <span className="text-sm font-medium bg-blue-500/10 text-blue-600 px-2 py-1 rounded">
                Rank {currentTeam.rank}
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
    </main>
  );
}
