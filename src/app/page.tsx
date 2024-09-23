"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useZkLogin } from "@mysten/enoki/react";
import { Paper } from "@/components/general/Paper";
import { HomePage } from "@/components/home/HomePage";

export default function Home() {
  const router = useRouter();
  const { address } = useZkLogin();

  useEffect(() => {
    localStorage.removeItem("refer_code");

    if (address) {
      // router.push("/referral");
      router.replace("/referral");
    }
  }, [address]);

  return (
    <Paper className="max-w-[600px] mx-auto">{!address && <HomePage />}</Paper>
  );
}
