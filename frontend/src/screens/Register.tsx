// import type { Metadata } from "next"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award } from "lucide-react";
import { useState } from "react";

const API_URL = import.meta.env.VITE_APP_BASE_URL + "/auth";

export const registerUser = async (
  username: string,
  password: string,
  team: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Login failed");
  }
};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format.");
      return;
    }

    if (!team || team.trim() === "") {
      alert("Team name is required.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await registerUser(email, password, team);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 flex items-center gap-2 text-2xl font-bold"
        >
          <Award className="h-8 w-8 text-primary" />
          <span>CodeJudge</span>
        </Link>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Register</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Team Name</Label>
              <Input
                id="team"
                required
                type="email"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Confirm Password</Label>
              </div>
              <Input
                id="password"
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" onClick={handleRegister}>
              Register
            </Button>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
