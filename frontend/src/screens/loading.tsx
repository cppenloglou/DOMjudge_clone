import { cn } from "../lib/utils";

interface LoadingProps {
  className?: string;
  size?: "small" | "medium" | "large";
  text?: string;
  overlay?: boolean;
}

export default function Loading({
  className,
  size = "medium",
  text = "Loading...",
  overlay = false,
}: LoadingProps = {}) {
  const sizes = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4",
  };

  const sizeClass = sizes[size];

  // Basic spinner with optional text
  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-primary",
          sizeClass
        )}
      />
      {text && (
        <p className="text-muted-foreground text-sm font-medium">{text}</p>
      )}
    </div>
  );

  // If overlay is true, render the spinner with a blurred background overlay
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
        <div className="bg-background/80 rounded-lg p-6 shadow-lg">
          {spinner}
        </div>
      </div>
    );
  }

  // Otherwise just return the spinner
  return spinner;
}
