import Home from "./screens/Home";
import Login from "./screens/Login";
import ProblemsPage from "./screens/Problems";
import RegisterPage from "./screens/Register";
import TeamRegistrationPage from "./screens/Register";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/team-registration" element={<TeamRegistrationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
