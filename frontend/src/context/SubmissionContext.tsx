import API from "@/services/api";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState } from "react";

const API_URL = import.meta.env.VITE_APP_BASE_URL;

export type Submission = {
  avgTime: number;
  status: "PASSED" | "FAILED" | "ERROR";
  submittedAt: string;
  testcasesPassed: number;
  executionLog: string;
};

type SubmissionContextType = {
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
  fetchSubmissions: (problemId: string) => Promise<void>;
  submit: (problemId: string, selectedFile: File) => Promise<Submission>;
};

// ✅ Fix: Provide correct default functions that match types
export const SubmissionContext = createContext<SubmissionContextType>({
  submissions: [],
  setSubmissions: () => {},
  fetchSubmissions: async () => {},
  submit: async () => {
    return {
      avgTime: 0,
      status: "FAILED",
      submittedAt: new Date().toISOString(),
      testcasesPassed: 0,
      executionLog: "",
    };
  },
});

export const SubmissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  //   useEffect(() => {
  //     fetchSubmissions();
  //   }, []);

  // ✅ Fixed: This now returns Promise<Submission>
  async function submit(
    problemId: string,
    selectedFile: File
  ): Promise<Submission> {
    const formData = new FormData();
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const decoded = jwtDecode<{ team_id: number }>(token);
    const team_id = decoded.team_id;

    formData.append("problemId", problemId);
    formData.append("codeFile", selectedFile);
    formData.append("teamId", (team_id || "").toString());

    const response = await API.post(`${API_URL}/submissions/submit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ Ensure response data matches Submission type
    return response.data as Submission;
  }

  // ✅ Fixed: return Promise<void>
  async function fetchSubmissions(problemId: string): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const decoded = jwtDecode<{ team_id: number }>(token);

    try {
      const res = await API.get(
        `${API_URL}/submissions/problem/${problemId}/team/${decoded.team_id}`
      );
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  }

  return (
    <SubmissionContext.Provider
      value={{ submissions, setSubmissions, fetchSubmissions, submit }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmission = () => useContext(SubmissionContext);
