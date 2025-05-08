"use client";

import * as React from "react";
import {
  Award,
  Bell,
  ChevronDown,
  Clock,
  Code,
  FileText,
  Menu,
  MessageSquare,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTimer } from "@/context/TimerContext";

export function Navbar() {
  const { logout } = useContext(AuthContext);
  const { setIsCountdownActive } = useTimer();
  const navigate = useNavigate();
  const { remainingSeconds, formatSeconds } = useTimer();

  const handleLogout = () => {
    logout();
    setIsCountdownActive(false);
    navigate("/login");
  };

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center w-full justify-between">
        {/* Mobile menu trigger - always visible on small screens */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Link
                    to="/"
                    className="flex items-center gap-2 font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    <Award className="h-6 w-6 text-primary" />
                    <span>CodeJudge</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Code className="h-4 w-4" />
                      <span>Problems</span>
                    </div>
                  </div>
                  <Link
                    to="/scoreboard"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <Award className="h-4 w-4" />
                    <span>Scoreboard</span>
                  </Link>
                  <Link
                    to="/clarifications"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Clarifications</span>
                  </Link>
                  <Link
                    to="/teams"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    <span>Teams</span>
                  </Link>
                  <Link
                    to="/docs"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Docs</span>
                  </Link>
                </nav>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        JS
                      </div>
                      <span className="text-sm font-medium">Team Alpha</span>
                    </div>
                    <div className="flex flex-col gap-2 pl-8">
                      <Link
                        to="/profile"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        className="text-left text-sm text-muted-foreground hover:text-foreground"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Award className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">CodeJudge</span>
          </Link>

          {/* Main navigation - visible on large screens */}
          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-4 xl:gap-6">
              <li>
                <Link
                  to="/problems"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Award className="h-4 w-4" />
                  <span>Problems</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/scoreboard"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Award className="h-4 w-4" />
                  <span>Scoreboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/clarifications"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Clarifications</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/teams"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-4 w-4" />
                  <span>Teams</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <FileText className="h-4 w-4" />
                  <span>Docs</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Right side section with clock and user info */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Timer - always visible on the right */}
          <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium">
            <Clock className="h-3 w-3" />
            <span>
              {remainingSeconds
                ? formatSeconds(remainingSeconds)
                : "Countdown has finished!"}
            </span>
          </div>

          {/* Notification bell - hidden on smallest screens */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hidden sm:flex"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User dropdown - adaptive display */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 h-9">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  JS
                </div>
                <span className="hidden md:inline">Team Alpha</span>
                <ChevronDown className="h-3 w-3 hidden md:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Team Alpha</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
