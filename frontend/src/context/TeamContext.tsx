import { createContext, useContext, useEffect, useState } from "react";
import { teamsService } from "@/services/apiServices";
import { jwtDecode } from "jwt-decode";
import { MyJwtPayload } from "./AuthContext";

export type TeamInfo = {
  team_id: number;
  id: number;
  rank: number;
  name: string;
  members: string;
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
  getTeam: () => TeamInfo | undefined;
};

export const TeamContext = createContext<TeamContextType>({
  teams: [],
  loading: true,
  fetchTeams: () => {},
  calculateTotalProblemsTime: () => 0,
  getTeam: () => undefined,
});

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // setTeams(temp_teams);
    fetchTeams();
  }, []);

  const getTeam = (): TeamInfo | undefined => {
    setLoading(true);
    if (token && teams.length > 0) {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        if (decoded && decoded.team_id) {
          const teamId = decoded.team_id;

          const team = teams.find((team) => team.team_id === teamId);

          return team;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      } finally {
        setLoading(false);
      }
      return undefined;
    }
  };

  const fetchTeams = async () => {
    setLoading(true);
    await teamsService
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
      value={{
        teams,
        loading,
        fetchTeams,
        calculateTotalProblemsTime,
        getTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => useContext(TeamContext);
