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
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const decoded = jwtDecode<{ team_id: number }>(token);
    const team_id = decoded.team_id;

    const res = await submissionsService.submit(
      problemId,
      selectedFile,
      (team_id || "").toString()
    );

    return res.data as Submission;
  }

  async function fetchSubmissions(problemId: string): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const decoded = jwtDecode<{ team_id: number }>(token);

    try {
      const res = await submissionsService.getSubmissionsByProblemAndTeam(
        problemId,
        decoded.team_id.toString()
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
