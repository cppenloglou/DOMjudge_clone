import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Search, SlidersHorizontal } from "lucide-react"
import { Navbar } from "@/components/Navbar"
// Sample problem data
const problems = [
  {
    id: "A",
    name: "Two Sum",
    difficulty: "Easy",
    categories: ["Arrays", "Hash Table"],
    solved: 85,
    attempts: 120,
    acceptance: "70.8%",
    status: "Solved",
  },
  {
    id: "B",
    name: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    categories: ["String", "Sliding Window"],
    solved: 65,
    attempts: 110,
    acceptance: "59.1%",
    status: "Attempted",
  },
  {
    id: "C",
    name: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    categories: ["Array", "Binary Search", "Divide and Conquer"],
    solved: 30,
    attempts: 80,
    acceptance: "37.5%",
    status: null,
  },
  {
    id: "D",
    name: "Valid Parentheses",
    difficulty: "Easy",
    categories: ["String", "Stack"],
    solved: 90,
    attempts: 120,
    acceptance: "75.0%",
    status: "Solved",
  },
  {
    id: "E",
    name: "Merge K Sorted Lists",
    difficulty: "Hard",
    categories: ["Linked List", "Divide and Conquer", "Heap"],
    solved: 25,
    attempts: 75,
    acceptance: "33.3%",
    status: "Attempted",
  },
  {
    id: "F",
    name: "LRU Cache",
    difficulty: "Medium",
    categories: ["Hash Table", "Linked List", "Design"],
    solved: 55,
    attempts: 100,
    acceptance: "55.0%",
    status: null,
  },
  {
    id: "G",
    name: "Number of Islands",
    difficulty: "Medium",
    categories: ["DFS", "BFS", "Union Find", "Matrix"],
    solved: 70,
    attempts: 110,
    acceptance: "63.6%",
    status: "Solved",
  },
  {
    id: "H",
    name: "Trapping Rain Water",
    difficulty: "Hard",
    categories: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    solved: 35,
    attempts: 90,
    acceptance: "38.9%",
    status: null,
  },
]

export default function ProblemsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Problem Set</h1>
            <p className="text-muted-foreground">
              Browse and solve programming problems from various categories and difficulty levels.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <TabsList>
                  <TabsTrigger value="all">All Problems</TabsTrigger>
                  <TabsTrigger value="contest">Contest Problems</TabsTrigger>
                  <TabsTrigger value="practice">Practice Problems</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-[260px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search problems..." className="w-full pl-8" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                        <span className="sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Solved</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Attempted</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Unsolved</DropdownMenuCheckboxItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Easy</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Medium</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Hard</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="sr-only">Sort</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>Problem ID (A-Z)</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Problem ID (Z-A)</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Difficulty (Easy-Hard)</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Difficulty (Hard-Easy)</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Acceptance Rate (High-Low)</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Acceptance Rate (Low-High)</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <TabsContent value="all" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {problems.map((problem) => (
                    <Card key={problem.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                              {problem.id}
                            </div>
                            <h3 className="font-semibold truncate" title={problem.name}>
                              {problem.name}
                            </h3>
                          </div>
                          <Badge
                            className={
                              problem.difficulty === "Easy"
                                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700"
                                : problem.difficulty === "Medium"
                                  ? "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 hover:text-yellow-700"
                                  : "bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700"
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {problem.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Acceptance: {problem.acceptance}</span>
                          <span>
                            {problem.solved}/{problem.attempts} solved
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <div>
                          {problem.status && (
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
                          )}
                        </div>
                        <Button size="sm">Solve</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TabsContent>

              <TabsContent value="contest" className="mt-6">
                <div className="flex items-center justify-center h-40 border rounded-md">
                  <p className="text-muted-foreground">No active contest problems available.</p>
                </div>
              </TabsContent>

              <TabsContent value="practice" className="mt-6">
                <div className="flex items-center justify-center h-40 border rounded-md">
                  <p className="text-muted-foreground">Switch to the "All Problems" tab to view practice problems.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
