import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { usePage } from "@/context/PageContext";
import { problemsService } from "@/services/apiServices";

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
    page?: number,
    size?: number,
    filter?: "all" | "solved" | "unsolved"
  ) => void;
  problemCount: number;
  getProblemById: (id: string) => Problem | null;
};

export const ProblemContext = createContext<ProblemContextType>({
  problems: [],
  loading: true,
  teamId: null,
  fetchProblems: () => {},
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

  const { itemsPerPage } = usePage();

  useEffect(() => {
    const fetchProblemsBeforeRender = async () => {
      await fetchProblems().catch((err) => {
        console.error("Error fetching problems:", err);
      });
    };
    fetchProblemsBeforeRender();
  }, []);

  const getProblemById = (id: string | null): Problem | null => {
    if (!id) return null;
    const problem = problems.find((problem) => problem.id == id);
    if (!problem) console.error(`Problem with ID ${id} not found`);
    return problem ?? null;
  };

  const getTeamIdFromToken = (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage");
      return null;
    }

    try {
      const decoded = jwtDecode<{ team_id: number }>(token);
      return decoded.team_id;
    } catch (err) {
      console.error("Token decode failed:", err);
      return null;
    }
  };

  const fetchProblems = async (
    page = 0,
    size?: number,
    filter: "all" | "solved" | "unsolved" = "all"
  ) => {
    const id = getTeamIdFromToken();
    if (id === null) return;

    if (teamId === null) setTeamId(id);
    setLoading(true);

    try {
      const countRes = await problemsService.getProblemsSize(id, filter);
      const count = countRes.data;
      setProblemCount(count);

      const problemRes = await problemsService.getProblems(
        id,
        page,
        size ?? count,
        filter
      );

      const fetchedProblems = problemRes.data;
      setProblems(fetchedProblems);

      if (fetchedProblems.length < itemsPerPage && page === 0) {
        setProblemCount(fetchedProblems.length);
      }
    } catch (err) {
      console.error("Error fetching problems:", err);
    } finally {
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
