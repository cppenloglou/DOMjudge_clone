import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to CodeJudge</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current Contest</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">ICPC Regional 2025</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">12 problems</span>
              <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                Active
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/contests">
                Enter Contest <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problem Set</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Practice your skills</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                120+ problems
              </span>
              <span className="text-sm font-medium bg-green-500/10 text-green-600 px-2 py-1 rounded">
                Updated
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/problems">
                Browse Problems <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Team Alpha</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">3 members</span>
              <span className="text-sm font-medium bg-blue-500/10 text-blue-600 px-2 py-1 rounded">
                Rank #5
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/teams">
                Team Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
