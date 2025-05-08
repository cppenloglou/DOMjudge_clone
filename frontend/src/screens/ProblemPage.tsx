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
import { useProblems } from "@/context/ProblemContext";

type SubmissionDetails = {
  status: string;
  testcasesPassed: number;
  avgTime: number;
  executionLog: string;
  submittedAt?: string;
};

// Helper functions
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-500/10 text-green-600";
    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-600";
    case "HARD":
      return "bg-red-500/10 text-red-600";
    default:
      return "";
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "PASSED":
      return "bg-green-100 text-green-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
    case "PARTIAL":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function ProblemPage() {
  const { submissions, setSubmissions, fetchSubmissions, submit } =
    useSubmission();
  const { getProlemById } = useProblems();
  const { id } = useParams<{ id: string }>();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [submissionDetails, setSubmissionDetails] =
    useState<SubmissionDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const submissionsPerPage = 5;
  const totalPages = Math.ceil(submissions.length / submissionsPerPage);
  const paginatedSubmissions = submissions.slice(
    (currentPage - 1) * submissionsPerPage,
    currentPage * submissionsPerPage
  );

  const problem = id ? getProlemById(id) : null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (problem && id) {
      fetchSubmissions(id);
    }
  }, [problem]);

  const handleFileUpload = () => {
    if (!selectedFile || !problem) return;

    submit(problem.id, selectedFile).then((response) => {
      if (response) {
        setSubmissionDetails(response);
        setUploadFeedback("✅ File uploaded successfully");
        setSubmissions((prev) => [response, ...prev]);
      } else {
        setUploadFeedback("❌ File upload failed");
      }
    });
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
      <main className="flex-1 container p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {problem.id}
              </div>
              <h1 className="text-2xl font-bold">{problem.name}</h1>
            </div>

            <div className="flex flex-wrap gap-2 mt-1">
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Problem Description</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <div className="whitespace-pre-line">
                    {problem.description}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Solution</CardTitle>
                  <CardDescription>Upload your solution file</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <input
                      type="file"
                      onChange={handleFileChange}
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
              {submissionDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Submission Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <Badge
                        className={getStatusBadgeColor(
                          submissionDetails.status
                        )}
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

              <Card>
                <CardHeader>
                  <CardTitle>Submission History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {paginatedSubmissions.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No submissions yet.
                    </p>
                  )}

                  {paginatedSubmissions.map((submission, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border p-2 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {submission.submittedAt
                            ? new Date(submission.submittedAt).toLocaleString()
                            : "Unknown date"}
                        </span>
                        <Badge
                          className={getStatusBadgeColor(submission.status)}
                        >
                          {submission.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {submission.avgTime?.toFixed(2)} sec
                      </div>
                    </div>
                  ))}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={
                            currentPage === i + 1 ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
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
        </div>
      </main>
    </div>
  );
}
