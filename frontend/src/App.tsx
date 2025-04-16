import { AuthProvider } from "./context/AuthContext";
import Home from "./screens/Home";
import Login from "./screens/Login";
import ProblemsPage from "./screens/Problems";
import RegisterPage from "./screens/Register";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/problems" element={<ProblemsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
