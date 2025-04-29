import Home from "./screens/Home";
import Login from "./screens/Login";
import ProblemsPage from "./screens/Problems";
import RegisterPage from "./screens/Register";
import TeamRegistrationPage from "./screens/Register";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProblemPage from "./screens/ProblemPage";
import PageLayout from "./layouts/PageLayout";
import { PageProvider } from "./context/PageContext";

function App() {
  return (
    <PageProvider>
      {/* <ProblemProvider> */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />

            <Route element={<PageLayout />}>
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/problems/:id" element={<ProblemPage />} />
            </Route>

            <Route
              path="/team-registration"
              element={<TeamRegistrationPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* </ProblemProvider> */}
    </PageProvider>
  );
}

export default App;
