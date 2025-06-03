import { Outlet } from "react-router-dom";
import { SubmissionProvider } from "@/context/SubmissionContext";
import { Toaster } from "sonner";

const PageLayout = () => (
  <SubmissionProvider>
    <div className="min-h-screen bg-background">
      <Outlet />
      <Toaster
        position="bottom-right"
        richColors
        expand={false}
        duration={4000}
        // toastOptions={{
        //   style: {
        //     background: "hsl(var(--background))",
        //     border: "1px solid hsl(var(--border))",
        //     color: "hsl(var(--foreground))",
        //   },
        // }}
      />
    </div>
  </SubmissionProvider>
);

export default PageLayout;
