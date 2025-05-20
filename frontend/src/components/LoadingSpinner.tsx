import { Loader } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="w-238.5 h-140 flex items-center justify-center">
      <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
