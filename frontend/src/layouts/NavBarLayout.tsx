import { Navbar } from "@/components/Navbar";
import { TeamProvider } from "@/context/TeamContext";
import { useTimer } from "@/context/TimerContext";
import { timerService } from "@/services/apiServices";
import { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";

export default function NavbarLayout() {
  const { setIsCountdownActive } = useTimer();
  useLayoutEffect(() => {
    timerService.isCountdownActive().then((res) => {
      setIsCountdownActive(res.data);
    });
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <TeamProvider>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </main>
      </TeamProvider>
    </div>
  );
}
