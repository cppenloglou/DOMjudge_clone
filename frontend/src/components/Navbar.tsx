"use client"

import * as React from "react"
import { Award, Bell, ChevronDown, Clock, Code, FileText, Home, Menu, MessageSquare, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 font-bold">
            <Award className="h-6 w-6 text-primary" />
            <span>CodeJudge</span>
          </a>
          <nav className="hidden md:flex">
            <ul className="flex gap-6">
              <li>
                <a
                  href="/contests"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                      <Code className="h-4 w-4" />
                      <span>Problems</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild>
                      <a href="/problems">All Problems</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/problems/categories">Categories</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/problems/submissions">My Submissions</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li>
                <a
                  href="/scoreboard"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Award className="h-4 w-4" />
                  <span>Scoreboard</span>
                </a>
              </li>
              <li>
                <a
                  href="/clarifications"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Clarifications</span>
                </a>
              </li>
              <li>
                <a
                  href="/teams"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-4 w-4" />
                  <span>Teams</span>
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <FileText className="h-4 w-4" />
                  <span>Docs</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium">
              <Clock className="h-3 w-3" />
              <span>02:45:30</span>
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    JS
                  </div>
                  <span>Team Alpha</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Team Alpha</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile">Profile</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings">Settings</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <a href="/" className="flex items-center gap-2 font-bold" onClick={() => setIsOpen(false)}>
                    <Award className="h-6 w-6 text-primary" />
                    <span>CodeJudge</span>
                  </a>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-4">
                  <a
                    href="/contests"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </a>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Code className="h-4 w-4" />
                      <span>Problems</span>
                    </div>
                    <div className="flex flex-col gap-2 pl-6">
                      <a
                        href="/problems"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        All Problems
                      </a>
                      <a
                        href="/problems/categories"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        Categories
                      </a>
                      <a
                        href="/problems/submissions"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        My Submissions
                      </a>
                    </div>
                  </div>
                  <a
                    href="/scoreboard"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <Award className="h-4 w-4" />
                    <span>Scoreboard</span>
                  </a>
                  <a
                    href="/clarifications"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Clarifications</span>
                  </a>
                  <a
                    href="/teams"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    <span>Teams</span>
                  </a>
                  <a
                    href="/docs"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Docs</span>
                  </a>
                </nav>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium">
                      <Clock className="h-3 w-3" />
                      <span>02:45:30</span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Bell className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        JS
                      </div>
                      <span className="text-sm font-medium">Team Alpha</span>
                    </div>
                    <div className="flex flex-col gap-2 pl-8">
                      <a
                        href="/profile"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </a>
                      <a
                        href="/settings"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        Settings
                      </a>
                      <button className="text-left text-sm text-muted-foreground hover:text-foreground">Logout</button>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
