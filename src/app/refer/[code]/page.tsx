"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEnokiFlow, useZkLogin } from "@mysten/enoki/react";
import { Paper } from "@/components/general/Paper";
import { LoginForm } from "@/components/forms/LoginForm";

export default function Home() {
  const router = useRouter();
  const { address } = useZkLogin();

  const params = useParams<{ code: string }>();

  useEffect(() => {
    localStorage.setItem("refer_code", params.code);

    if (address) {
      router.push("/referral");
    }
  }, [address]);

  return (
    <Paper className="max-w-[600px] mx-auto">{!address && <LoginForm />}</Paper>
  );
}
