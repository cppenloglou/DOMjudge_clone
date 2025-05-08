import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function NavbarLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
    </div>
  );
}
