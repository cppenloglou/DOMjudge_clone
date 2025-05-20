import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useTeams } from "@/context/TeamContext";
import { AuthContext, MyJwtPayload } from "@/context/AuthContext";
import { Award, Code, User, Users, School, Mail } from "lucide-react";

interface CurrentUserTeam {
  name: string;
  university: string;
  solved: number;
  rank: number;
  email?: string;
  members?: string[];
}

export default function ProfilePage() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const { teams, fetchTeams, loading } = useTeams();
  const [currentTeam, setCurrentTeam] = useState<CurrentUserTeam | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  // Only run fetchTeams once on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  // This effect will run whenever the teams array changes
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (teams.length > 0) {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        if (decoded && decoded.team_id) {
          const teamId = decoded.team_id;

          const team = teams.find((team) => team.team_id === teamId);
          console.log("Found team:", team);

          if (team) {
            setCurrentTeam({
              name: team.name,
              university: team.university,
              solved: team.solved,
              rank: team.rank,
              email: decoded.sub,
            });

            setTeamMembers(
              team.members.split(",").map((member) => member.trim())
            );
          } else {
            console.log("Team not found for ID:", teamId);
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token, teams, navigate]);

  if (loading) return <LoadingSpinner />;

  if (!currentTeam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
        <p className="mb-4">We couldn't find your profile information.</p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Team Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Team Information</CardTitle>
                <CardDescription>
                  Your team details and statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-medium text-primary mx-auto mb-4">
                  {currentTeam.name.substring(0, 1).toUpperCase() +
                    currentTeam.name
                      .charAt(currentTeam.name.length - 1)
                      .toUpperCase()}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{currentTeam.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span>{currentTeam.university}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{currentTeam.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {role === "ROLE_ADMIN" ? "Administrator" : "Participant"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics and Members Card */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Team Statistics</CardTitle>
                <CardDescription>Your contest performance</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Current Rank
                    </span>
                    <div className="flex items-end gap-1">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-2xl font-bold">
                        #{currentTeam.rank}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Problems Solved
                    </span>
                    <div className="flex items-end gap-1">
                      <Code className="h-4 w-4 text-green-500" />
                      <span className="text-2xl font-bold">
                        {currentTeam.solved}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Member Count
                    </span>
                    <div className="flex items-end gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-2xl font-bold">
                        {teamMembers.length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team members list */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Members in your team</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-4">
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {member.substring(0, 1).toUpperCase()}
                        </div>
                        <div>{member}</div>
                      </div>
                    ))
                  ) : (
                    <p>No team members found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
