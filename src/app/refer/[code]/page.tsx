"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
//@ts-ignore
import { useZkLogin } from "@mysten/enoki/react";
import { Paper } from "@/components/general/Paper";
import { LoginForm } from "@/components/forms/LoginForm";

export default function Home() {
  const router = useRouter();
  const { address } = useZkLogin();

  const params = useParams();

  useEffect(() => {
    localStorage.setItem("referred_by", params.code as string);

    if (address) {
      router.push("/referral");
    }
  }, [address]);

  return (
    <Paper className="max-w-[600px] mx-auto">{!address && <LoginForm />}</Paper>
  );
}
