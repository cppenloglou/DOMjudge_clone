import { Navbar } from "@/components/Navbar";
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
      <Navbar />
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
    </div>
  );
}
