import Home from "./screens/Home";
import Login from "./screens/Login";
import ProblemsPage from "./screens/Problems";
import RegisterPage from "./screens/Register";
import TeamRegistrationPage from "./screens/Register";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { Route, Routes } from "react-router-dom";
import ProblemPage from "./screens/ProblemPage";
import PageLayout from "./layouts/PageLayout";
import SubmissionLayout from "./layouts/SubmissionLayout";
import NavbarLayout from "./layouts/NavBarLayout";
import ScoreboardPage from "./screens/Scoreboard";
import TeamLayout from "./layouts/TeamLayout";
import AdminPage from "./screens/AdminPage";
import AdminRoute from "./utils/AdminRoute";

function App() {
  return (
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
          <Route path="/" element={<Home />} />
          <Route element={<PageLayout />}>
            <Route path="/problems" element={<ProblemsPage />} />
            <Route element={<TeamLayout />}>
              <Route path="/scoreboard" element={<ScoreboardPage />} />
            </Route>
            <Route element={<SubmissionLayout />}>
              <Route path="/problems/:id" element={<ProblemPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/team-registration" element={<TeamRegistrationPage />} />
      </Route>
    </Routes>
  );
}

export default App;
