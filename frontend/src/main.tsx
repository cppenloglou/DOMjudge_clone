import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { PageProvider } from "./context/PageContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { TimerProvider } from "./context/TimerContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <TimerProvider>
      <PageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PageProvider>
    </TimerProvider>
  </AuthProvider>
);
