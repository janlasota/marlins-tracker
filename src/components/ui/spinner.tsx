import { cn } from "../../lib/utils";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-20 h-20 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin",
        className
      )}
    />
  );
};

export { Spinner };
