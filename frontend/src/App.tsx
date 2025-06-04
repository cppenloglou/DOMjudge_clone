import { lazy, Suspense } from "react";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { Route, Routes } from "react-router-dom";
import AdminRoute from "./utils/AdminRoute";
import PageLayout from "./layouts/PageLayout";
import SubmissionLayout from "./layouts/SubmissionLayout";
import NavbarLayout from "./layouts/NavBarLayout";
import TeamLayout from "./layouts/TeamLayout";
import DocsPage from "./screens/Docs";

const Home = lazy(() => import("./screens/Home"));
const Login = lazy(() => import("./screens/Login"));
const ProblemsPage = lazy(() => import("./screens/Problems"));
const RegisterPage = lazy(() => import("./screens/Register"));
const TeamRegistrationPage = lazy(() => import("./screens/Register"));
const ProblemPage = lazy(() => import("./screens/ProblemPage"));
const ScoreboardPage = lazy(() => import("./screens/Scoreboard"));
const AdminPage = lazy(() => import("./screens/AdminPage"));
const ProfilePage = lazy(() => import("./screens/Profile"));

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoutes />}>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route element={<NavbarLayout />}>
              <Route element={<PageLayout />}>
                <Route path="/problems" element={<ProblemsPage />} />
                <Route element={<TeamLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/docs" element={<DocsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/scoreboard" element={<ScoreboardPage />} />
                </Route>
                <Route element={<SubmissionLayout />}>
                  <Route path="/problems/:id" element={<ProblemPage />} />
                </Route>
              </Route>
            </Route>

            <Route
              path="/team-registration"
              element={<TeamRegistrationPage />}
            />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
