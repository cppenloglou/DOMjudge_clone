import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
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
import { ArrowLeft, Upload } from "lucide-react";

// Sample problem data
import { useProblems } from "@/context/ProblemContext";

export default function ProblemPage() {
  const { getProlemById } = useProblems();

  const { id } = useParams<{ id: string }>();

  // Find the problem with the matching ID
  const problem = id ? getProlemById(id) : null;
  console.log("Problem ID:", id);
  console.log("Problem data:", problem);

  // Function to determine badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 hover:text-yellow-700";
      case "HARD":
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700";
      default:
        return "";
    }
  };

  // Function to determine status badge color
  const getStatusColor = (status: string | null) => {
    if (!status) return "";
    return status === "Solved"
      ? "border-green-500 text-green-600"
      : "border-yellow-500 text-yellow-600";
  };
  if (problem) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/problems" className="flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Problems
                </Link>
              </Button>
            </div>

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
                {problem.status && (
                  <Badge
                    variant="outline"
                    className={getStatusColor(problem.status)}
                  >
                    {problem.status}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Problem Description</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <div className="whitespace-pre-line">
                      {problem.description || problem.description}
                    </div>
                  </CardContent>
                </Card>

                {/* {(problem.inputFormat || problem.outputFormat) && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Input/Output Format</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {problem.inputFormat && (
                        <div>
                          <h3 className="font-semibold mb-2">Input</h3>
                          <p className="whitespace-pre-line text-sm">
                            {problem.inputFormat}
                          </p>
                        </div>
                      )}
                      {problem.inputFormat && problem.outputFormat && (
                        <Separator />
                      )}
                      {problem.outputFormat && (
                        <div>
                          <h3 className="font-semibold mb-2">Output</h3>
                          <p className="whitespace-pre-line text-sm">
                            {problem.outputFormat}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )} */}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Problem Details</CardTitle>
                  </CardHeader>
                  {/* <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Limit:</span>
                      <span>{problem.timeLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Memory Limit:
                      </span>
                      <span>{problem.memoryLimit}</span>
                    </div>
                  </CardContent> */}
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Submit Solution</CardTitle>
                    <CardDescription>Upload your solution file</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        Drag and drop your file here
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or click to browse
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Submit Solution</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Problem not found</h1>
      </div>
    );
  }
}
