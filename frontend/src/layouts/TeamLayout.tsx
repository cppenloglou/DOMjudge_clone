// src/layouts/PageLayout.tsx
import { Outlet } from "react-router-dom";
import { TeamProvider } from "@/context/TeamContext";

const PageLayout = () => (
  <TeamProvider>
    <Outlet />
  </TeamProvider>
);

export default PageLayout;
