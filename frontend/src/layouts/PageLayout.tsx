// src/layouts/PageLayout.tsx
import { Outlet } from "react-router-dom";
import { PageProvider } from "@/context/PageContext";
import { ProblemProvider } from "@/context/ProblemContext";

const PageLayout = () => (
  <PageProvider>
    <ProblemProvider>
      <Outlet />
    </ProblemProvider>
  </PageProvider>
);

export default PageLayout;
