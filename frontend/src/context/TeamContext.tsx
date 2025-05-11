import { createContext, useContext, useEffect, useState } from "react";
import { teamsService } from "@/services/apiServices";
import { useAuth } from "./AuthContext";

export type TeamInfo = {
  team_id: number;
  rank: number;
  name: string;
  university: string;
  members: string;
  solved: number;
  problems: ProblemScroreboard[];
};

export type ProblemScroreboard = {
  id: string;
  status: "Solved" | "Attempted" | null;
  attempts: number;
  time: number;
};

type TeamContextType = {
  teams: TeamInfo[];
  loading: boolean;
  fetchTeams: () => void;
  calculateTotalProblemsTime: (team: TeamInfo) => number;
};

export const TeamContext = createContext<TeamContextType>({
  teams: [],
  loading: true,
  fetchTeams: () => {},
  calculateTotalProblemsTime: () => 0,
});

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);
    if (!token) return;
    fetchTeams();
    setLoading(false);
  }, []);

  // Fetch teams from backend
  // This function fetches the teams from the backend and sets the teams state
  // with the response data. It also handles loading state and errors.
  // It uses the teamsService to make the API call.
  // The function is called when the component mounts and whenever the
  // fetchTeams function is called.
  const fetchTeams = async () => {
    setLoading(true);
    if (!token) return;
    console.log("Fetching teams...");
    teamsService
      .getScoreboard()
      .then((response) => {
        // Sort teams by rank first
        const sortedTeams = [...response.data].sort((a, b) => a.rank - b.rank);
        setTeams(sortedTeams);
        console.log("Teams fetched successfully:", sortedTeams);
      })
      .catch((error: unknown) => {
        console.error("Error fetching teams:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calculateTotalProblemsTime = (team: TeamInfo): number => {
    if (!token) return 0;
    return team.problems.reduce((sum, problem) => sum + problem.time, 0);
  };

  return (
    <TeamContext.Provider
      value={{ teams, loading, fetchTeams, calculateTotalProblemsTime }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => useContext(TeamContext);
