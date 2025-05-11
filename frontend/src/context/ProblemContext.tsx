import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { problemsService } from "@/services/apiServices";
import { usePage } from "@/context/PageContext";
import { useAuth } from "./AuthContext";

export type Problem = {
  id: string;
  name: string;
  description: string;
  status: "Solved" | "Attemtped" | null;
  testcaset: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
};

type ProblemContextType = {
  problems: Problem[];
  loading: boolean;
  teamId: number | null;
  fetchProblems: (
    page: number,
    size: number,
    filter: "all" | "solved" | "unsolved"
  ) => Promise<boolean | undefined>;
  problemCount: number;
  getProblemById: (id: string) => Problem | null;
};

export const ProblemContext = createContext<ProblemContextType>({
  problems: [],
  loading: true,
  teamId: null,
  fetchProblems: () => Promise.resolve(false),
  problemCount: 0,
  getProblemById: () => null,
});

export const ProblemProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [problemCount, setProblemCount] = useState<number>(0);
  const [filter, setFilter] = useState<"all" | "solved" | "unsolved">("all");
  const token = useAuth();

  const { currentPage, itemsPerPage } = usePage();

  useEffect(() => {
    if (!token) return;
    fetchProblems(currentPage - 1, itemsPerPage, filter);
  }, []);

  const getProblemById = (id: string | null) => {
    if (!token) return null;
    console.log("problems:", problems);

    const problem = problems.find((problem) => problem.id == id);
    if (!problem) {
      console.error(`Problem with ID ${id} not found`);
      return null;
    }
    console.log("Problem found:", problem);
    return problem;
  };

  const fetchProblems = async (
    page: number = 0,
    size: number,
    filter: "all" | "solved" | "unsolved" = "all"
  ) => {
    setFilter(filter);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<{ team_id: number }>(token);
      const id = decoded.team_id;
      console.log("Decoded token:", decoded);
      console.log("Team ID:", id);
      setTeamId(id);
      setLoading(true);

      // Fetch total problems size from backend
      // This function fetches the total number of problems from the backend
      // and sets the problemCount state with the response data. It also handles
      // loading state and errors. It uses the problemsService to make the API call.
      await problemsService
        .getProblemsSize(id, filter)
        .then((res) => {
          setProblemCount(res.data);
        })
        .catch((err) => {
          console.error("Error fetching total problems:", err);
          return false;
        });

      // Fetch problems from backend
      // This function fetches the problems from the backend and sets the
      // problems state with the response data. It also handles loading
      // state and errors. It uses the problemsService to make the API call.
      await problemsService
        .getProblems(id, page, size, filter)
        .then((res) => {
          setProblems(res.data);
          console.log("Problems fetched successfully:", problemCount);
        })
        .catch((err) => {
          console.error("Problem fetch error:", err);
          return false;
        })
        .finally(() => setLoading(false));
      return true;
    } catch (err) {
      console.error("Token decode failed:", err);
      setLoading(false);
    }
  };

  return (
    <ProblemContext.Provider
      value={{
        problems,
        loading,
        teamId,
        fetchProblems,
        problemCount,
        getProblemById,
      }}
    >
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblems = () => useContext(ProblemContext);
