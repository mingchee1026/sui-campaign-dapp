"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useAuthCallback,
  useZkLogin,
  useZkLoginSession,
  //@ts-ignore
} from "@mysten/enoki/react";
import { useUsers } from "@/hooks/useUsers";
//@ts-ignore
import { jwtDecode } from "jwt-decode";
import { Spinner } from "@/components/general/Spinner";

const AuthPage = () => {
  const router = useRouter();
  const { handled } = useAuthCallback();
  const { isLoading, handleRegisterUser } = useUsers();

  useEffect(() => {
    if (handled) {
      handleRegisterUser().then(() => {
        router.push("/");
      });
    }
  }, [handled]);

  return <Spinner />;
};

export default AuthPage;
