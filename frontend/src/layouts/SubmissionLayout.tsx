// src/layouts/PageLayout.tsx
import { Outlet } from "react-router-dom";
import { SubmissionProvider } from "@/context/SubmissionContext";

const PageLayout = () => (
  <SubmissionProvider>
    <Outlet />
  </SubmissionProvider>
);

export default PageLayout;
