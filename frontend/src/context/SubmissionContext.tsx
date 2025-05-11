import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState } from "react";
import { submissionsService } from "@/services/apiServices";

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
  loading: boolean;
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
  loading: false,
});

export const SubmissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Submission function
  async function submit(
    problemId: string,
    selectedFile: File
  ): Promise<Submission> {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decoded = jwtDecode<{ team_id: number }>(token);
      const team_id = decoded.team_id;

      const response = await submissionsService.submit(
        problemId,
        selectedFile,
        team_id.toString()
      );

      return response.data as Submission;
    } catch (error) {
      console.error("Error submitting solution:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Fetch submissions function by problemId
  async function fetchSubmissions(problemId: string): Promise<void> {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const decoded = jwtDecode<{ team_id: number }>(token);

      const res = await submissionsService.getSubmissionsByProblemAndTeam(
        problemId,
        decoded.team_id.toString()
      );
      console.log("Submissions fetched successfully:", res.data);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SubmissionContext.Provider
      value={{ submissions, setSubmissions, fetchSubmissions, submit, loading }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmission = () => useContext(SubmissionContext);
