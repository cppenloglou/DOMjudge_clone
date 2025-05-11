import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { PageProvider } from "./context/PageContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { TimerProvider } from "./context/TimerContext.tsx";
import { TeamProvider } from "./context/TeamContext.tsx";
import { ProblemProvider } from "./context/ProblemContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <PageProvider>
      <TimerProvider>
        <TeamProvider>
          <ProblemProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ProblemProvider>
        </TeamProvider>
      </TimerProvider>
    </PageProvider>
  </AuthProvider>
);
