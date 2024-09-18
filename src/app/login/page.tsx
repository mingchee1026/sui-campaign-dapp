"use client";

import { Paper } from "@/components/general/Paper";
import { LoginForm } from "@/components/forms/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEnokiFlow, useZkLogin } from "@mysten/enoki/react";

export default function Home() {
  const router = useRouter();
  const { address } = useZkLogin();

  useEffect(() => {
    if (address) {
      router.push("/referral");
    }
  }, [address]);

  return (
    <Paper className="max-w-[600px] mx-auto">{!address && <LoginForm />}</Paper>
  );
}
