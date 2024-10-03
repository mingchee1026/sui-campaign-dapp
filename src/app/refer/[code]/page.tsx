"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useZkLogin } from "@/hooks/useZkLogin";
import { Paper } from "@/components/general/Paper";
import { LoginForm } from "@/components/forms/LoginForm";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useZkLogin();

  const params = useParams();

  useEffect(() => {
    localStorage.setItem("referred_by", params.code as string);

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
