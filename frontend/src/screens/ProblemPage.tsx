/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  Send,
  CheckCircle,
  XCircle,
  FileText,
  History,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSubmission } from "@/context/SubmissionContext";
import { type Problem, useProblems } from "@/context/ProblemContext";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

export default function RefactoredProblemPage() {
  const { id } = useParams<{ id: string }>();
  const { getProblemById, loading } = useProblems();
  const { submissions, setSubmissions, fetchSubmissions, submit } =
    useSubmission();

  // Existing state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [submissionDetails, setSubmissionDetails] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [problem, setProblem] = useState<Problem | null>(null);

  // New state for code editor
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [submissionMode, setSubmissionMode] = useState<"file" | "editor">(
    "editor"
  );

  const submissionsPerPage = 5;
  const totalPages = Math.ceil(submissions.length / submissionsPerPage);
  const currentSubs = submissions.slice(
    (currentPage - 1) * submissionsPerPage,
    currentPage * submissionsPerPage
  );

  const codeTemplates = {
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`,
    c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Your code here
    
    return 0;
}`,
    java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
    python: `# Your code here
n = int(input())
# Read input and solve the problem`,
  };

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
    setCode(codeTemplates[selectedLanguage as keyof typeof codeTemplates]);
  }, [selectedLanguage]);

  const handleFileUpload = async (selectedFile: File | null) => {
    if (!selectedFile || !problem) return;

    const res = await submit(problem.id, selectedFile);
    if (res) {
      setSubmissionDetails(res);
      setUploadFeedback("✅ File uploaded successfully");
      setSubmissions((prev) => [res, ...prev]);

      // Show success toast
      toast.success("Submission successful!", {});
      if (res.status === "PASSED") {
        toast.success("All test cases passed!", {});
      } else if (res.status === "FAILED") {
        toast.error("Some test cases failed. Check the details.", {});
      } else if (res.status === "ERROR") {
        toast.warning(
          "There was an error during submission through unreachable executor server.",
          {}
        );
      }
    } else {
      setUploadFeedback("❌ File upload failed");

      // Show error toast
      toast.error("Code failed to upload!", {});
    }
  };

  const handleCodeSubmit = async () => {
    if (!code.trim() || !problem) return;

    // Convert code to file for submission
    const blob = new Blob([code], { type: "text/plain" });
    const file = new File(
      [blob],
      `solution.${getFileExtension(selectedLanguage)}`,
      { type: "text/plain" }
    );
    setSelectedFile(file);

    handleFileUpload(file);
  };

  const getFileExtension = (language: string) => {
    const extensions = {
      cpp: "cpp",
      c: "c",
      java: "java",
      python: "py",
    };
    return extensions[language as keyof typeof extensions] || "txt";
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Problem not found</h1>
      </div>
    );
  }

  const components: Record<string, React.ComponentType<any>> = {
    h2: ({ node, ...props }) => (
      <h2 className="text-xl font-bold mt-6 mb-3" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-xl font-bold mt-5 mb-2" {...props} />
    ),
    code: ({
      node,
      inline,
      className,
      children,
      ...props
    }: {
      node?: any;
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
    }) => {
      return !inline ? (
        <pre
          style={{
            backgroundColor: "#f6f8fa",
            padding: "1em",
            borderRadius: "6px",
            overflowX: "auto",
            margin: "1.2em 0",
          }}
        >
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code
          style={{
            backgroundColor: "#eee",
            padding: "0.2em 0.4em",
            borderRadius: "3px",
            fontSize: "0.9em",
            margin: "0 0.2em",
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
    hr: () => <hr style={{ borderColor: "#ddd", margin: "1.5em 0" }} />,
    p: ({ node, ...props }) => <p className="mb-4" {...props} />,
    ul: ({ node, ...props }) => (
      <ul className="mb-4 pl-6 list-disc" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="mb-4 pl-6 list-decimal" {...props} />
    ),
    // Add more component overrides if needed
  };

  return (
    <div className="flex h-screen bg-background gap-4">
      {/* Left Panel - Problem Description */}
      <div className="w-1/2">
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {problem.id}
              </div>
              <h1 className="text-2xl font-bold">{problem.name}</h1>
              <Badge className={getBadgeColor.difficulty(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>

            <Separator className="mb-6" />

            {/* Problem Description */}
            <section>
              <div className="text-muted-foreground leading-relaxed">
                <div className="prose prose-neutral max-w-none">
                  <ReactMarkdown
                    children={problem.description}
                    remarkPlugins={[remarkGfm]}
                    components={components}
                  />
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>

      <div className="border-l w-px h-full bg-border" />

      {/* Right Panel - Code Editor & Submissions */}
      <div className="w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Select
                value={submissionMode}
                onValueChange={(value: "file" | "editor") =>
                  setSubmissionMode(value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                </SelectContent>
              </Select>

              {submissionMode === "editor" && (
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex gap-2">
              {submissionMode === "editor" && (
                <>
                  <Button
                    size="sm"
                    onClick={handleCodeSubmit}
                    disabled={!code.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">
                {submissionMode === "editor" ? "Code" : "Upload"}
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="flex-1 mt-0">
              {submissionMode === "editor" ? (
                <div className="h-2/3 p-4">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full resize-none border rounded-md p-4 font-mono text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Write your code here..."
                    spellCheck={false}
                  />
                </div>
              ) : (
                <div className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Submit Solution File
                      </CardTitle>
                      <CardDescription>
                        Upload your solution file
                      </CardDescription>
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
                        onClick={() => handleFileUpload(selectedFile)}
                        disabled={!selectedFile}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Solution
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
              <ScrollArea className="h-full">
                <div className="p-4">
                  {submissionDetails ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {submissionDetails.status === "PASSED" ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          Latest Submission Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2 items-center">
                          <span className="font-medium">Status:</span>
                          <Badge
                            className={getBadgeColor.status(
                              submissionDetails.status
                            )}
                          >
                            {submissionDetails.status}
                          </Badge>
                        </div>

                        {submissionDetails.status !== "PASSED" && (
                          <div>
                            <span className="font-medium">
                              Test Cases Passed:{" "}
                            </span>
                            <span>{submissionDetails.testcasesPassed}</span>
                          </div>
                        )}

                        {submissionDetails.avgTime !== undefined && (
                          <div>
                            <span className="font-medium">
                              Average Execution Time:{" "}
                            </span>
                            <span>
                              {submissionDetails.avgTime.toFixed(3)} sec
                            </span>
                          </div>
                        )}

                        {submissionDetails.executionLog && (
                          <div>
                            <span className="font-medium mb-2 block">
                              Execution Log:
                            </span>
                            <pre className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap overflow-auto">
                              {submissionDetails.executionLog}
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No submission results yet</p>
                        <p className="text-sm">
                          Submit your solution to see results here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="history" className="flex-1 mt-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <History className="w-5 h-5" />
                    <h3 className="font-semibold">Submission History</h3>
                  </div>

                  {currentSubs.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center">
                        <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No submissions yet</p>
                        <p className="text-sm">
                          Your submission history will appear here
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {currentSubs.map((s, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  {s.status === "PASSED" ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                  <Badge
                                    className={getBadgeColor.status(s.status)}
                                  >
                                    {s.status}
                                  </Badge>
                                </div>

                                {/* Average Execution Time */}
                                <p className="text-sm text-muted-foreground">
                                  {s.submittedAt
                                    ? new Date(s.submittedAt).toLocaleString()
                                    : "Unknown date"}
                                </p>
                                {/* Test cases Passed */}
                                {s.testcasesPassed !== undefined && (
                                  <p className="text-sm text-muted-foreground">
                                    Test Cases Passed:{" "}
                                    <span className="font-medium">
                                      {s.status === "FAILED"
                                        ? s.testcasesPassed
                                        : "All"}
                                    </span>
                                  </p>
                                )}
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                {s.status !== "FAILED" &&
                                  s.avgTime !== undefined &&
                                  `${s.avgTime.toFixed(4)} sec`}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          {(() => {
                            let start = 0;
                            let end = totalPages;
                            const maxPages = 8;
                            if (totalPages > maxPages) {
                              if (currentPage <= Math.ceil(maxPages / 2)) {
                                start = 0;
                                end = maxPages;
                              } else if (
                                currentPage >
                                totalPages - Math.floor(maxPages / 2)
                              ) {
                                start = totalPages - maxPages;
                                end = totalPages;
                              } else {
                                start = currentPage - Math.ceil(maxPages / 2);
                                end = currentPage + Math.floor(maxPages / 2);
                              }
                            }
                            return Array.from(
                              { length: end - start },
                              (_, i) => {
                                const page = start + i + 1;
                                return (
                                  <Button
                                    key={page}
                                    size="sm"
                                    variant={
                                      currentPage === page
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </Button>
                                );
                              }
                            );
                          })()}
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
                    </>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
