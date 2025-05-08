// src/context/ProblemContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "@/services/api";
import { usePage } from "@/context/PageContext";

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
  ) => void;
  problemCount: number;
  getProlemById: (id: string) => Problem | null;
};

export const ProblemContext = createContext<ProblemContextType>({
  problems: [],
  loading: true,
  teamId: null,
  fetchProblems: () => {},
  problemCount: 0,
  getProlemById: () => null,
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

  const API_URL = import.meta.env.VITE_APP_BASE_URL;

  const { currentPage, itemsPerPage } = usePage();

  useEffect(() => {
    fetchProblems(currentPage - 1, itemsPerPage, filter);
  }, []);

  const getProlemById = (id: string | null) => {
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
      setTeamId(id);

      setLoading(true);
      API.get(`${API_URL}/problems?teamId=${id}&filter=${filter}`)
        .then((res) => {
          setProblemCount(res.data);
          console.log("Problem count:", res.data);
        })
        .catch((err) => {
          console.error("Problem count fetch error:", err);
        });

      API.get(
        `${API_URL}/problems/team/${id}?page=${page}&size=${size}&filter=${filter}`
      )
        .then((res) => {
          setProblems(res.data);
          if (res.data.length < itemsPerPage && page === 0) {
            setProblemCount(res.data.length);
          }
          console.log("Problems fetched successfully:", res.data.length);
        })
        .catch((err) => {
          console.error("Problem fetch error:", err);
        })
        .finally(() => setLoading(false));
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
        getProlemById,
      }}
    >
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblems = () => useContext(ProblemContext);
