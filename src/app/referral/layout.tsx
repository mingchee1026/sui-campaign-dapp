"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useZkLogin } from "@mysten/enoki/react";
import { ChildrenProps } from "@/types/ChildrenProps";

export default function AdminRootLayout({ children }: ChildrenProps) {
  const router = useRouter();
  const { address } = useZkLogin();

  useEffect(() => {
    if (!address) {
      console.log("No address found, taking you back to '/'");
      router.push("/");
    }
  }, [address]);

  if (!address) {
    return "Not allowed";
  }

  return children;
}
