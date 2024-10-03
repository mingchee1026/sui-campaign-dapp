"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Paper } from "@/components/general/Paper";
import { HomePage } from "@/components/home/HomePage";
import { useZkLogin } from "@/hooks/useZkLogin";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useZkLogin();

  useEffect(() => {
    localStorage.removeItem("referred_by");

    if (isAuthenticated()) {
      // router.push("/referral");
      router.replace("/referral");
    }
  }, []);

  return (
    <Paper className="max-w-[600px] mx-auto">
      <HomePage />
    </Paper>
  );
}
