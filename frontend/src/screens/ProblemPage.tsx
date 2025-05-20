import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useSubmission } from "@/context/SubmissionContext";
import { Problem, useProblems } from "@/context/ProblemContext";

const getBadgeColor = {
  difficulty: (d: string) =>
    ({
      EASY: "bg-green-500/10 text-green-600",
      MEDIUM: "bg-yellow-500/10 text-yellow-600",
      HARD: "bg-red-500/10 text-red-600",
    }[d] ?? ""),
  status: (s: string) =>
    ({
      PASSED: "bg-green-100 text-green-700",
      FAILED: "bg-red-100 text-red-700",
      PARTIAL: "bg-yellow-100 text-yellow-700",
    }[s] ?? "bg-gray-100 text-gray-700"),
};

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const { getProblemById, loading } = useProblems();
  const { submissions, setSubmissions, fetchSubmissions, submit } =
    useSubmission();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [submissionDetails, setSubmissionDetails] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const submissionsPerPage = 5;
  const totalPages = Math.ceil(submissions.length / submissionsPerPage);
  const currentSubs = submissions.slice(
    (currentPage - 1) * submissionsPerPage,
    currentPage * submissionsPerPage
  );

  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    if (!loading && id) {
      const found = getProblemById(id);
      if (found) {
        setProblem(found);
        fetchSubmissions(id);
      }
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && id && problem) {
      const found = getProblemById(id);
      if (found) {
        setProblem(found);
        fetchSubmissions(id);
      }
    }
  }, [loading]);

  const handleFileUpload = async () => {
    if (!selectedFile || !problem) return;
    const res = await submit(problem.id, selectedFile);
    if (res) {
      setSubmissionDetails(res);
      setUploadFeedback("✅ File uploaded successfully");
      setSubmissions((prev) => [res, ...prev]);
    } else {
      setUploadFeedback("❌ File upload failed");
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Problem not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container p-6 space-y-6">
        {/* HEADER */}
        <div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {problem.id}
            </div>
            <h1 className="text-2xl font-bold">{problem.name}</h1>
          </div>
          <div className="mt-2 flex gap-2">
            <Badge className={getBadgeColor.difficulty(problem.difficulty)}>
              {problem.difficulty}
            </Badge>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Problem Description */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Problem Description</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap">{problem.description}</pre>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Upload + Results + History */}
          <div className="space-y-6">
            {/* Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Solution</CardTitle>
                <CardDescription>Upload your solution file</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center">
                  <input
                    type="file"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">
                      Drag and drop or click to browse
                    </p>
                  </label>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Selected file: {selectedFile.name}
                    </p>
                  )}
                </div>
                {uploadFeedback && (
                  <p className="mt-2 text-sm">{uploadFeedback}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleFileUpload}
                  disabled={!selectedFile}
                >
                  Submit Solution
                </Button>
              </CardFooter>
            </Card>

            {/* Results */}
            {submissionDetails && (
              <Card>
                <CardHeader>
                  <CardTitle>Latest Submission Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <span className="font-medium">Status:</span>
                    <Badge
                      className={getBadgeColor.status(submissionDetails.status)}
                    >
                      {submissionDetails.status}
                    </Badge>
                  </div>
                  {submissionDetails.status !== "PASSED" && (
                    <p className="text-sm">
                      Test Cases Passed: {submissionDetails.testcasesPassed}
                    </p>
                  )}
                  {submissionDetails.avgTime !== undefined && (
                    <p className="text-sm">
                      Average Execution Time:{" "}
                      {submissionDetails.avgTime.toFixed(3)} sec
                    </p>
                  )}
                  {submissionDetails.executionLog && (
                    <div className="text-sm bg-gray-100 p-3 rounded-lg whitespace-pre-wrap">
                      {submissionDetails.executionLog}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submission History */}
            <Card>
              <CardHeader>
                <CardTitle>Submission History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentSubs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No submissions yet.
                  </p>
                ) : (
                  currentSubs.map((s, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border p-2 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {s.submittedAt
                            ? new Date(s.submittedAt).toLocaleString()
                            : "Unknown date"}
                        </span>
                        <Badge className={getBadgeColor.status(s.status)}>
                          {s.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.avgTime?.toFixed(2)} sec
                      </div>
                    </div>
                  ))
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
