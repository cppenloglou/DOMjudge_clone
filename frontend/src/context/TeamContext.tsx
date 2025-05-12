import API from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import { teamsService } from "@/services/apiServices";

export type TeamInfo = {
  id: number;
  rank: number;
  name: string;
  university: string;
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

  const API_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    // setTeams(temp_teams);
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    teamsService
      .getScoreboard()
      .then((reponse) => {
        setTeams(reponse.data);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calculateTotalProblemsTime = (team: TeamInfo): number => {
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
