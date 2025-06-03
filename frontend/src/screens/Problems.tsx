import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { usePage } from "@/context/PageContext";
import { useProblems } from "@/context/ProblemContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ProblemsPage() {
  const [filter, setFilter] = useState<"all" | "solved" | "unsolved">("all");

  const { problems, loading, fetchProblems, problemCount } = useProblems();

  const { currentPage, setCurrentPage, itemsPerPage } = usePage();

  useEffect(() => {
    fetchProblems(currentPage - 1, itemsPerPage, filter);
  }, [currentPage, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(problemCount / itemsPerPage);
  const maxPagesToShow = 10;

  // Calculate the range of pages to display in the pagination
  const getVisiblePages = () => {
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 sm:px-6 md:px-6">
        <main className="flex-1 container py-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Problem Set</h1>
              <p className="text-muted-foreground">
                Browse and solve programming problems from various categories
                and difficulty levels.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Tabs
                value={filter}
                onValueChange={(newValue) =>
                  setFilter(newValue as "all" | "solved" | "unsolved")
                }
                className="w-full"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                  <TabsList>
                    <TabsTrigger value="all">All Problems</TabsTrigger>
                    <TabsTrigger value="solved">Solved Problems</TabsTrigger>
                    <TabsTrigger value="unsolved">
                      Unsolved Problems
                    </TabsTrigger>
                  </TabsList>
                </div>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <TabsContent value={filter} className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {problems.map((problem) => (
                        <Link
                          to={`/problems/${problem.id}`}
                          key={problem.id}
                          className="block group"
                        >
                          <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50 cursor-pointer">
                            <div className="p-4 flex flex-col h-full">
                              <div className="flex items-start gap-3 mb-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                  {problem.id}
                                </div>
                                <h3 className="font-semibold line-clamp-1">
                                  {problem.name}
                                </h3>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-grow">
                                <ReactMarkdown
                                  children={problem.description}
                                  remarkPlugins={[remarkGfm]}
                                />
                              </p>

                              <div className="mt-auto">
                                {problem.status ? (
                                  <Badge
                                    variant="outline"
                                    className={
                                      problem.status === "Solved"
                                        ? "border-green-500 text-green-600"
                                        : "border-yellow-500 text-yellow-600"
                                    }
                                  >
                                    {problem.status}
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-muted-foreground"
                                  >
                                    Not Attempted
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>

                    <Pagination className="mt-8">
                      <PaginationContent className="flex items-center space-x-2">
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1)
                                setCurrentPage((prev) => prev - 1);
                            }}
                          />
                        </PaginationItem>

                        {visiblePages.map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={page === currentPage}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        {/* Add ellipsis if there are more pages */}
                        {totalPages > maxPagesToShow &&
                          currentPage < totalPages - 3 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages)
                                setCurrentPage((prev) => prev + 1);
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
