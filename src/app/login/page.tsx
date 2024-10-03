"use client";

import { Paper } from "@/components/general/Paper";
import { LoginForm } from "@/components/forms/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useZkLogin } from "@/hooks/useZkLogin";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useZkLogin();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/referral");
    }
  }, []);

  return (
    <Paper className="max-w-[600px] mx-auto">
      <LoginForm />
    </Paper>
  );
}
