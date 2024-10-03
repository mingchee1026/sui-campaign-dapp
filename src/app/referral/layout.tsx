"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useZkLogin } from "@/hooks/useZkLogin";
import { ChildrenProps } from "@/types/ChildrenProps";

export default function AdminRootLayout({ children }: ChildrenProps) {
  const router = useRouter();
  const { isAuthenticated } = useZkLogin();

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("No address found, taking you back to '/'");
      router.push("/");
    }
  }, []);

  if (!isAuthenticated()) {
    return ""; //"Not allowed";
  }

  return children;
}
