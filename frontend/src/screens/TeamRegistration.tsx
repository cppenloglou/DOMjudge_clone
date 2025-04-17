"use client";

import type React from "react";

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Award, Minus, Plus, School, Users } from "lucide-react";
import API from "@/services/api";

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
import { AuthContext } from "@/context/AuthContext";

// Initial empty team member
const emptyMember = { name: "" };

export default function TeamRegistrationPage() {
  const [teamName, setTeamName] = useState("");
  const [university, setUniversity] = useState("");
  const [members, setMembers] = useState([
    { ...emptyMember },
    { ...emptyMember },
    { ...emptyMember },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { logout, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      alert("User not authenticated.");
      return;
    }

    if (!validateForm()) return;

    try {
      const payload = {
        name: teamName, // changed from teamName to name
        university,
        members: members.map((m) => m.name).join(", "), // comma-separated string
        userId: user.id,
      };

      const response = await API.post("/team/register", payload);

      if (response.status === 201 || response.status === 200) {
        const temp_user = { ...user, hasRegisteredTeam: true };
        setUser(temp_user);
        localStorage.setItem("user", JSON.stringify(temp_user));
        navigate("/");
      } else {
        alert("Something went wrong with team registration.");
      }
    } catch (error: any) {
      console.error("Team registration failed:", error);
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  const addMember = () => {
    if (members.length < 5) {
      setMembers([...members, { ...emptyMember }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
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

    // Validate team name
    if (!teamName.trim()) {
      newErrors.teamName = "Team name is required";
    }

    // Validate university
    if (!university.trim()) {
      newErrors.university = "University name is required";
    }

    // Validate members
    members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`members.${index}.name`] = "Name is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Team Registration</h1>
            <p className="text-muted-foreground mt-2">
              Register your team for upcoming programming contests
            </p>
          </div>

          <form onSubmit={handleRegister}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Information
                </CardTitle>
                <CardDescription>
                  Provide details about your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">
                    Team Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="team-name"
                    value={teamName}
                    onChange={(e) => {
                      setTeamName(e.target.value);
                      if (errors.teamName) {
                        const newErrors = { ...errors };
                        delete newErrors.teamName;
                        setErrors(newErrors);
                      }
                    }}
                    placeholder="Enter your team name"
                    className={errors.teamName ? "border-red-500" : ""}
                  />
                  {errors.teamName && (
                    <p className="text-red-500 text-sm">{errors.teamName}</p>
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
                        onChange={(e) => {
                          setUniversity(e.target.value);
                          if (errors.university) {
                            const newErrors = { ...errors };
                            delete newErrors.university;
                            setErrors(newErrors);
                          }
                        }}
                        placeholder="Enter your university or institution"
                        className={errors.university ? "border-red-500" : ""}
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
                    <p className="text-red-500 text-sm">{errors.university}</p>
                  )}
                </div>
              </CardContent>

              <Separator className="my-2" />

              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  Add between 1-5 members to your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {members.map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg relative">
                    <div className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium">
                      Member {index + 1}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`member-${index}-name`}>
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`member-${index}-name`}
                          value={member.name}
                          onChange={(e) => updateMember(index, e.target.value)}
                          placeholder="Enter full name"
                          className={`flex-1 ${
                            errors[`members.${index}.name`]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {members.length > 1 && (
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
                        )}
                      </div>
                      {errors[`members.${index}.name`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`members.${index}.name`]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {members.length < 5 && (
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
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">
                  By registering a team, you agree to the competition rules and
                  code of conduct.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button variant="outline" className="sm:flex-1" asChild>
                    <Link to="/" onClick={logout}>
                      {" "}
                      Cancel
                    </Link>
                  </Button>
                  <Button
                    type="submit"
                    className="sm:flex-1"
                    onClick={handleRegister}
                  >
                    Register Team
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}
