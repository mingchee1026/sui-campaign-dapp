//@ts-ignore
import { Loader2 } from "lucide-react";
import React from "react";

export const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
};
