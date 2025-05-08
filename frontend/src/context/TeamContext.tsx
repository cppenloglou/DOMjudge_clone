import API from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";

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

// Sample team data
// const temp_teams: TeamInfo[] = [
//   {
//     id: 1,
//     rank: 1,
//     name: "Code Wizards",
//     university: "MIT",
//     Solved: 8,
//     problems: [
//       { id: "A", status: "Solved", attempts: 1, time: 45 },
//       { id: "B", status: "Solved", attempts: 1, time: 62 },
//       { id: "C", status: "Solved", attempts: 2, time: 95 },
//       { id: "D", status: "Solved", attempts: 1, time: 30 },
//       { id: "E", status: "Solved", attempts: 3, time: 120 },
//       { id: "F", status: "Solved", attempts: 1, time: 75 },
//       { id: "G", status: "Solved", attempts: 1, time: 87 },
//       { id: "H", status: "Solved", attempts: 1, time: 20 },
//     ],
//   },
//   {
//     id: 2,
//     rank: 2,
//     name: "Binary Beasts",
//     university: "Stanford",
//     Solved: 7,
//     problems: [
//       { id: "A", status: "Solved", attempts: 1, time: 50 },
//       { id: "B", status: "Solved", attempts: 1, time: 75 },
//       { id: "C", status: "Solved", attempts: 1, time: 90 },
//       { id: "D", status: "Solved", attempts: 2, time: 110 },
//       { id: "E", status: "Solved", attempts: 1, time: 65 },
//       { id: "F", status: "Solved", attempts: 1, time: 55 },
//       { id: "G", status: "Solved", attempts: 1, time: 44 },
//       { id: "H", status: "Attempted", attempts: 2, time: 0 },
//     ],
//   },
//   {
//     id: 3,
//     rank: 3,
//     name: "Algorithm Aces",
//     university: "Carnegie Mellon",
//     Solved: 7,
//     problems: [
//       { id: "A", status: "Solved", attempts: 1, time: 48 },
//       { id: "B", status: "Solved", attempts: 1, time: 72 },
//       { id: "C", status: "Solved", attempts: 2, time: 105 },
//       { id: "D", status: "Solved", attempts: 1, time: 60 },
//       { id: "E", status: "Solved", attempts: 1, time: 95 },
//       { id: "F", status: "Solved", attempts: 1, time: 82 },
//       { id: "G", status: "Solved", attempts: 1, time: 50 },
//       { id: "H", status: "Attempted", attempts: 3, time: 0 },
//     ],
//   },
//   {
//     id: 4,
//     rank: 4,
//     name: "Byte Busters",
//     university: "UC Berkeley",
//     Solved: 6,
//     problems: [
//       { id: "A", status: "Solved", attempts: 1, time: 55 },
//       { id: "B", status: "Solved", attempts: 1, time: 80 },
//       { id: "C", status: "Solved", attempts: 1, time: 70 },
//       { id: "D", status: "Solved", attempts: 2, time: 95 },
//       { id: "E", status: "Solved", attempts: 1, time: 75 },
//       { id: "F", status: "Solved", attempts: 1, time: 50 },
//       { id: "G", status: "Attempted", attempts: 2, time: 0 },
//       { id: "H", status: null, attempts: 0, time: 0 },
//     ],
//   },
//   {
//     id: 5,
//     rank: 5,
//     name: "Logic Lords",
//     university: "Harvard",
//     Solved: 6,
//     problems: [
//       { id: "A", status: "Solved", attempts: 1, time: 60 },
//       { id: "B", status: "Solved", attempts: 1, time: 85 },
//       { id: "C", status: "Solved", attempts: 2, time: 110 },
//       { id: "D", status: "Solved", attempts: 1, time: 65 },
//       { id: "E", status: "Solved", attempts: 1, time: 70 },
//       { id: "F", status: "Solved", attempts: 1, time: 50 },
//       { id: "G", status: "Attempted", attempts: 3, time: 0 },
//       { id: "H", status: null, attempts: 0, time: 0 },
//     ],
//   },
//   {
//     id: 6,
//     rank: 6,
//     name: "Syntax Savants",
//     university: "Princeton",
//     Solved: 5,
//     problems: [
//       { id: "A", status: "Solved", attempts: 1, time: 65 },
//       { id: "B", status: "Solved", attempts: 1, time: 90 },
//       { id: "C", status: "Solved", attempts: 1, time: 75 },
//       { id: "D", status: "Solved", attempts: 2, time: 100 },
//       { id: "E", status: "Solved", attempts: 1, time: 50 },
//       { id: "F", status: "Attempted", attempts: 2, time: 0 },
//       { id: "G", status: "Attempted", attempts: 1, time: 0 },
//       { id: "H", status: null, attempts: 0, time: 0 },
//     ],
//   },
//   {
//     id: 7,
//     rank: 7,
//     name: "Data Dragons",
//     university: "Caltech",
//     Solved: 5,
//     problems: [
//       { id: "A", status: "Solved", attempts: 1, time: 70 },
//       { id: "B", status: "Solved", attempts: 1, time: 95 },
//       { id: "C", status: "Solved", attempts: 2, time: 115 },
//       { id: "D", status: "Solved", attempts: 1, time: 60 },
//       { id: "E", status: "Solved", attempts: 1, time: 55 },
//       { id: "F", status: "Attempted", attempts: 3, time: 0 },
//       { id: "G", status: "Attempted", attempts: 1, time: 0 },
//       { id: "H", status: null, attempts: 0, time: 0 },
//     ],
//   },
//   {
//     id: 8,
//     rank: 8,
//     name: "Quantum Coders",
//     university: "University of Washington",
//     Solved: 4,
//     problems: [
//       { id: "A", status: "Solved", attempts: 1, time: 75 },
//       { id: "B", status: "Solved", attempts: 1, time: 100 },
//       { id: "C", status: "Solved", attempts: 1, time: 85 },
//       { id: "D", status: "Solved", attempts: 2, time: 60 },
//       { id: "E", status: "Attempted", attempts: 2, time: 0 },
//       { id: "F", status: "Attempted", attempts: 1, time: 0 },
//       { id: "G", status: null, attempts: 0, time: 0 },
//       { id: "H", status: null, attempts: 0, time: 0 },
//     ],
//   },
//   {
//     id: 9,
//     rank: 9,
//     name: "Recursion Rangers",
//     university: "University of Michigan",
//     Solved: 4,
//     problems: [
//       { id: "A", status: "Solved", attempts: 1, time: 80 },
//       { id: "B", status: "Solved", attempts: 1, time: 105 },
//       { id: "C", status: "Solved", attempts: 2, time: 90 },
//       { id: "D", status: "Solved", attempts: 1, time: 60 },
//       { id: "E", status: "Attempted", attempts: 3, time: 0 },
//       { id: "F", status: "Attempted", attempts: 1, time: 0 },
//       { id: "G", status: null, attempts: 0, time: 0 },
//       { id: "H", status: null, attempts: 0, time: 0 },
//     ],
//   },
//   {
//     id: 10,
//     rank: 10,
//     name: "Function Fanatics",
//     university: "University of Illinois",
//     Solved: 3,
//     problems: [
//       { id: "A", status: "Solved", attempts: 1, time: 85 },
//       { id: "B", status: "Solved", attempts: 1, time: 110 },
//       { id: "C", status: "Solved", attempts: 2, time: 65 },
//       { id: "D", status: "Attempted", attempts: 3, time: 0 },
//       { id: "E", status: "Attempted", attempts: 2, time: 0 },
//       { id: "F", status: "Attempted", attempts: 1, time: 0 },
//       { id: "G", status: null, attempts: 0, time: 0 },
//       { id: "H", status: null, attempts: 0, time: 0 },
//     ],
//   },
// ];

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
    API.get(`${API_URL}/scoreboard`)
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
