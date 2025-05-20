"use client";

import type React from "react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  School,
  User,
  Users,
} from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { authService } from "@/services/apiServices";

// Initial empty team member
const emptyMember = { name: "" };

export default function RegisterPage() {
  // Account information
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // Team information
  const [teamName, setTeamName] = useState("");
  const [university, setUniversity] = useState("");
  const [members, setMembers] = useState([
    { ...emptyMember },
    { ...emptyMember },
  ]);

  const registerUser = async (
    email: string,
    password: string,
    teamName: string,
    members: string,
    university: string
  ) => {
    try {
      await authService.register(
        email,
        password,
        teamName,
        members,
        university
      );
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      // Determine which section has errors and open it
      const accountFields = [
        "fullName",
        "email",
        "password",
        "confirmPassword",
      ];
      const teamFields = ["teamName", "university"];

      const hasAccountErrors = Object.keys(errors).some((key) =>
        accountFields.includes(key)
      );
      const hasTeamErrors = Object.keys(errors).some(
        (key) => teamFields.includes(key) || key.startsWith("members")
      );

      if (hasAccountErrors) {
        setActiveSection("account");
      } else if (hasTeamErrors) {
        setActiveSection("team");
      }

      return;
    }

    try {
      const memberNames = members
        .map((m) => m.name.trim())
        .filter((name) => name)
        .join(", ");

      await registerUser(email, password, teamName, memberNames, university);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  // Form state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<string>("account");

  const addMember = () => {
    if (members.length < 4) {
      // Max 4 additional members (5 total including the registrant)
      setMembers([...members, { ...emptyMember }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > 0) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    }
  };

  const updateMember = (index: number, name: string) => {
    const newMembers = [...members];
    newMembers[index] = { name };
    setMembers(newMembers);

    // Clear error for this field if it exists
    if (errors[`members.${index}.name`]) {
      const newErrors = { ...errors };
      delete newErrors[`members.${index}.name`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate account information
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate team information
    if (!teamName.trim()) {
      newErrors.teamName = "Team name is required";
    }

    if (!university.trim()) {
      newErrors.university = "University name is required";
    }

    // Validate team members
    members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`members.${index}.name`] = "Name is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

        <Card className="w-full max-w-3xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Create Account & Register Team
            </CardTitle>
            <CardDescription>
              Set up your account and register your team for programming
              contests
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <Accordion
              type="single"
              collapsible
              value={activeSection}
              onValueChange={setActiveSection}
            >
              {/* Account Information Section */}
              <AccordionItem value="account">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <User className="h-5 w-5" />
                    <span>Account Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="full-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="m@example.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? "border-red-500" : ""}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters long
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={
                          errors.confirmPassword ? "border-red-500" : ""
                        }
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => setActiveSection("team")}
                        className="flex items-center gap-1"
                      >
                        Next: Team Information
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>

              {/* Team Information Section */}
              <AccordionItem value="team">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-5 w-5" />
                    <span>Team Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-6 pt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="team-name">
                          Team Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="team-name"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="Enter your team name"
                          className={errors.teamName ? "border-red-500" : ""}
                        />
                        {errors.teamName && (
                          <p className="text-red-500 text-sm">
                            {errors.teamName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="university">
                          University/Institution{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              id="university"
                              value={university}
                              onChange={(e) => setUniversity(e.target.value)}
                              placeholder="Enter your university or institution"
                              className={
                                errors.university ? "border-red-500" : ""
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0"
                          >
                            <School className="h-4 w-4" />
                            <span className="sr-only">Search University</span>
                          </Button>
                        </div>
                        {errors.university && (
                          <p className="text-red-500 text-sm">
                            {errors.university}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-medium">Team Members</h3>
                        <div className="text-sm text-muted-foreground">
                          You ({fullName || "you"}) will be automatically added
                          as a team member
                        </div>
                      </div>

                      {members.map((member, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg relative"
                        >
                          <div className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium">
                            Additional Member {index + 1}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`member-${index}-name`}>
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id={`member-${index}-name`}
                                value={member.name}
                                onChange={(e) =>
                                  updateMember(index, e.target.value)
                                }
                                placeholder="Enter full name"
                                className={`flex-1 ${
                                  errors[`members.${index}.name`]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="flex-shrink-0"
                                onClick={() => removeMember(index)}
                              >
                                <Minus className="h-4 w-4" />
                                <span className="sr-only">Remove Member</span>
                              </Button>
                            </div>
                            {errors[`members.${index}.name`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`members.${index}.name`]}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}

                      {members.length < 4 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={addMember}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Team Member
                        </Button>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveSection("account")}
                        className="flex items-center gap-1"
                      >
                        <ChevronUp className="h-4 w-4" />
                        Back to Account
                      </Button>
                    </div>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    privacy policy
                  </Link>
                </Label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button variant="outline" className="sm:flex-1" asChild>
                  <Link to="/login">Already have an account? Login</Link>
                </Button>
                <Button type="submit" className="sm:flex-1">
                  Create Account & Register Team
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
