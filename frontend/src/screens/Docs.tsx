"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Code,
  FileText,
  HelpCircle,
  Search,
  Shield,
  Trophy,
  Upload,
  Zap,
  Copy,
} from "lucide-react";

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("python");

  const quickLinks = [
    { title: "Getting Started", icon: BookOpen, href: "#getting-started" },
    { title: "Contest Rules", icon: Trophy, href: "#contest-rules" },
    { title: "Language Docs", icon: Code, href: "#language-docs" },
    { title: "Submission Guide", icon: Upload, href: "#submission-guide" },
    { title: "Judging System", icon: Shield, href: "#judging" },
    { title: "FAQ", icon: HelpCircle, href: "#faq" },
  ];

  const languageExamples = {
    python: {
      name: "Python",
      version: "3.11",
      basicExample: `# Basic input/output
n = int(input())
numbers = list(map(int, input().split()))
print(sum(numbers))`,
      arrayExample: `# Working with arrays
arr = [1, 2, 3, 4, 5]
print(len(arr))  # Length
arr.append(6)    # Add element
arr.sort()       # Sort in place
print(max(arr))  # Maximum element`,
      stringExample: `# String operations
s = "Hello World"
print(s.lower())           # hello world
print(s.split())           # ['Hello', 'World']
print(s.replace("o", "0")) # Hell0 W0rld
print(len(s))              # 11`,
      mathExample: `# Math operations
import math

print(math.sqrt(16))    # 4.0
print(math.pow(2, 3))   # 8.0
print(math.floor(3.7))  # 3
print(math.ceil(3.2))   # 4
print(math.gcd(12, 8))  # 4`,
      commonLibraries: [
        "math - Mathematical functions",
        "collections - Counter, deque, defaultdict",
        "itertools - Permutations, combinations",
        "heapq - Priority queue operations",
        "bisect - Binary search functions",
        "sys - System-specific parameters",
      ],
    },
    cpp: {
      name: "C++",
      version: "17",
      basicExample: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int sum = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        sum += x;
    }
    
    cout << sum << endl;
    return 0;
}`,
      arrayExample: `#include <vector>
#include <algorithm>
using namespace std;

vector<int> arr = {1, 2, 3, 4, 5};
cout << arr.size() << endl;        // Size
arr.push_back(6);                  // Add element
sort(arr.begin(), arr.end());      // Sort
cout << *max_element(arr.begin(), arr.end()); // Max`,
      stringExample: `#include <string>
#include <algorithm>
using namespace std;

string s = "Hello World";
transform(s.begin(), s.end(), s.begin(), ::tolower);
cout << s << endl;                 // hello world
cout << s.length() << endl;        // 11
cout << s.substr(0, 5) << endl;    // hello`,
      mathExample: `#include <cmath>
#include <algorithm>
using namespace std;

cout << sqrt(16) << endl;          // 4
cout << pow(2, 3) << endl;         // 8
cout << floor(3.7) << endl;        // 3
cout << ceil(3.2) << endl;         // 4
cout << __gcd(12, 8) << endl;      // 4`,
      commonLibraries: [
        "iostream - Input/output operations",
        "vector - Dynamic arrays",
        "algorithm - Sorting, searching",
        "string - String operations",
        "map/set - Associative containers",
        "queue/stack - Container adaptors",
        "cmath - Mathematical functions",
      ],
    },
    c: {
      name: "C",
      version: "C17",
      basicExample: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    
    int sum = 0;
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        sum += x;
    }
    
    printf("%d\\n", sum);
    return 0;
}`,
      arrayExample: `#include <stdio.h>
#include <stdlib.h>

int arr[1000];
int size = 5;

// Initialize array
for (int i = 0; i < size; i++) {
    arr[i] = i + 1;
}

// Find maximum
int max_val = arr[0];
for (int i = 1; i < size; i++) {
    if (arr[i] > max_val) {
        max_val = arr[i];
    }
}`,
      stringExample: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

char s[] = "Hello World";
printf("Length: %lu\\n", strlen(s));

// Convert to lowercase
for (int i = 0; s[i]; i++) {
    s[i] = tolower(s[i]);
}
printf("%s\\n", s);`,
      mathExample: `#include <math.h>
#include <stdio.h>

printf("%.0f\\n", sqrt(16));       // 4
printf("%.0f\\n", pow(2, 3));      // 8
printf("%.0f\\n", floor(3.7));     // 3
printf("%.0f\\n", ceil(3.2));      // 4

// GCD function (not built-in)
int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}`,
      commonLibraries: [
        "stdio.h - Input/output functions",
        "stdlib.h - Memory allocation, conversion",
        "string.h - String manipulation",
        "math.h - Mathematical functions",
        "ctype.h - Character classification",
        "limits.h - Implementation limits",
      ],
    },
    java: {
      name: "Java",
      version: "17",
      basicExample: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        int sum = 0;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            sum += x;
        }
        
        System.out.println(sum);
        sc.close();
    }
}`,
      arrayExample: `import java.util.*;

ArrayList<Integer> arr = new ArrayList<>();
arr.add(1); arr.add(2); arr.add(3);

System.out.println(arr.size());        // Size
arr.add(4);                            // Add element
Collections.sort(arr);                 // Sort
System.out.println(Collections.max(arr)); // Maximum`,
      stringExample: `String s = "Hello World";
System.out.println(s.toLowerCase());   // hello world
System.out.println(s.length());        // 11
System.out.println(s.substring(0, 5)); // Hello
String[] words = s.split(" ");         // Split by space
System.out.println(Arrays.toString(words));`,
      mathExample: `System.out.println(Math.sqrt(16));     // 4.0
System.out.println(Math.pow(2, 3));    // 8.0
System.out.println(Math.floor(3.7));   // 3.0
System.out.println(Math.ceil(3.2));    // 4.0

// GCD (Java 17+)
System.out.println(Math.gcd(12, 8));   // 4`,
      commonLibraries: [
        "java.util.Scanner - Input reading",
        "java.util.ArrayList - Dynamic arrays",
        "java.util.Collections - Utility methods",
        "java.util.Arrays - Array utilities",
        "java.util.HashMap - Hash maps",
        "java.lang.Math - Mathematical functions",
      ],
    },
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-6 sm:px-8 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Documentation
              </h1>
              <p className="text-muted-foreground">
                Everything you need to know about using CodeJudge for
                competitive programming
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Navigation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickLinks.map((link) => (
                      <Button
                        key={link.href}
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={() => scrollToSection(link.href)}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.title}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Getting Started */}
                <section id="getting-started">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Getting Started
                      </CardTitle>
                      <CardDescription>
                        Learn the basics of using CodeJudge
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">
                          Welcome to CodeJudge
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          CodeJudge is a competitive programming platform
                          designed for contests, practice, and skill
                          development. Here's how to get started:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Register your team and login to participate</li>
                          <li>Browse the problem set</li>
                          <li>Submit solutions and track your progress</li>
                          <li>Check the scoreboard to see your ranking</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Contest Rules */}
                <section id="contest-rules">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Contest Rules
                      </CardTitle>
                      <CardDescription>
                        Important rules and guidelines for contests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="general">
                            General Rules
                          </TabsTrigger>
                          <TabsTrigger value="scoring">Scoring</TabsTrigger>
                          <TabsTrigger value="conduct">
                            Code of Conduct
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="general" className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">
                              Contest Duration
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Most contests run for 5 hours. The timer is
                              visible at all times during the contest.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              Team Composition
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Teams can have 1-3 members. All team members must
                              be registered before the contest starts.
                            </p>
                          </div>
                        </TabsContent>
                        <TabsContent value="scoring" className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Scoring System</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Teams are ranked by the number of problems solved,
                              with ties broken by total time.
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              <li>Each solved problem is worth 1 point</li>
                              <li>
                                Time penalty: submission time + 20 minutes per
                                wrong submission
                              </li>
                              <li>No penalty for problems not attempted</li>
                            </ul>
                          </div>
                        </TabsContent>
                        <TabsContent value="conduct" className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Fair Play</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              <li>
                                No communication with other teams during the
                                contest
                              </li>
                              <li>No external help or collaboration</li>
                              <li>
                                Use only approved resources and documentation
                              </li>
                              <li>Report any technical issues immediately</li>
                            </ul>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </section>

                {/* Language Documentation */}
                <section id="language-docs">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Programming Language Documentation
                      </CardTitle>
                      <CardDescription>
                        Comprehensive guides for supported programming languages
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs
                        value={activeLanguage}
                        onValueChange={setActiveLanguage}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="python">Python</TabsTrigger>
                          <TabsTrigger value="cpp">C++</TabsTrigger>
                          <TabsTrigger value="c">C</TabsTrigger>
                          <TabsTrigger value="java">Java</TabsTrigger>
                        </TabsList>

                        {Object.entries(languageExamples).map(([key, lang]) => (
                          <TabsContent
                            key={key}
                            value={key}
                            className="space-y-6"
                          >
                            <div className="flex items-center gap-2 mb-4">
                              <h3 className="text-xl font-semibold">
                                {lang.name}
                              </h3>
                              <Badge variant="outline">
                                Version {lang.version}
                              </Badge>
                            </div>

                            {/* Basic Input/Output */}
                            <div>
                              <h4 className="font-medium mb-3">
                                Basic Input/Output
                              </h4>
                              <div className="relative">
                                <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                                  <code>{lang.basicExample}</code>
                                </pre>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="absolute top-2 right-2"
                                  onClick={() =>
                                    copyToClipboard(lang.basicExample)
                                  }
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Arrays/Collections */}
                            <div>
                              <h4 className="font-medium mb-3">
                                Arrays and Collections
                              </h4>
                              <div className="relative">
                                <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                                  <code>{lang.arrayExample}</code>
                                </pre>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="absolute top-2 right-2"
                                  onClick={() =>
                                    copyToClipboard(lang.arrayExample)
                                  }
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* String Operations */}
                            <div>
                              <h4 className="font-medium mb-3">
                                String Operations
                              </h4>
                              <div className="relative">
                                <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                                  <code>{lang.stringExample}</code>
                                </pre>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="absolute top-2 right-2"
                                  onClick={() =>
                                    copyToClipboard(lang.stringExample)
                                  }
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Math Operations */}
                            <div>
                              <h4 className="font-medium mb-3">
                                Mathematical Operations
                              </h4>
                              <div className="relative">
                                <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                                  <code>{lang.mathExample}</code>
                                </pre>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="absolute top-2 right-2"
                                  onClick={() =>
                                    copyToClipboard(lang.mathExample)
                                  }
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Common Libraries */}
                            <div>
                              <h4 className="font-medium mb-3">
                                Common Libraries and Functions
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {lang.commonLibraries.map((lib, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                                  >
                                    <Code className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-mono">
                                      {lib}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </CardContent>
                  </Card>
                </section>

                {/* Submission Guide */}
                <section id="submission-guide">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Submission Guidelines
                      </CardTitle>
                      <CardDescription>
                        How to submit your solutions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">
                          Input/Output Format
                        </h3>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm font-mono">
                            • Read input from standard input (stdin)
                            <br />• Write output to standard output (stdout)
                            <br />• Follow the exact output format specified in
                            the problem
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Judging System */}
                <section id="judging">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Judging System
                      </CardTitle>
                      <CardDescription>
                        How your submissions are evaluated
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Resource Limits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <div className="font-medium">Time Limit</div>
                            <div className="text-sm text-muted-foreground">
                              1-5 seconds per test case
                            </div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <div className="font-medium">Memory Limit</div>
                            <div className="text-sm text-muted-foreground">
                              256 MB RAM
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* FAQ */}
                <section id="faq">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Frequently Asked Questions
                      </CardTitle>
                      <CardDescription>
                        Common questions and answers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            How do I register for a contest?
                          </AccordionTrigger>
                          <AccordionContent>
                            Go to the registration page, create or join a team,
                            and provide the required information including team
                            name, member details, and university affiliation.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>
                            Can I use external libraries?
                          </AccordionTrigger>
                          <AccordionContent>
                            Only standard libraries for each programming
                            language are allowed. Custom libraries or external
                            dependencies are not permitted.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
