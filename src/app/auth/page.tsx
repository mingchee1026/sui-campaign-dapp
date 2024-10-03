"use client";

import { useLayoutEffect, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
//@ts-ignore
import { jwtDecode } from "jwt-decode";
import { Spinner } from "@/components/general/Spinner";
//@ts-ignore
import toast from "react-hot-toast";
import { UserKeyData } from "@/types/UsefulTypes";
import { useZkLogin } from "@/hooks/useZkLogin";

const AuthPage = () => {
  const router = useRouter();
  const { isAuthenticated, decodeJwt } = useZkLogin();
  const { isLoading, handleRegisterUser } = useUsers();

  const [jwtEncoded, setJwtEncoded] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useLayoutEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const jwt_token_encoded = hash.get("id_token");

    console.log({ jwt_token_encoded });

    sessionStorage.setItem("sui_jwt_token", jwt_token_encoded!);

    const userKeyData: UserKeyData = JSON.parse(
      localStorage.getItem("userKeyData")!
    );

    if (!jwt_token_encoded) {
      toast.error("Could not retrieve a valid JWT Token!");
      return;
    }

    if (!userKeyData) {
      toast.error("user Data is null");
      return;
    }

    console.log({ userKeyData });

    setJwtEncoded(jwt_token_encoded);

    // const ephemeralPublicKey: PublicKey = userKeyData.ephemeralKeyPair;
    // setUserAddress(userKeyData.ephemeralPublicKey)

    // loadRequiredData(jwt_token_encoded);
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      handleRegisterUser().then(() => {
        router.push("/");
      });
    }
  }, []);

  return <Spinner />;
};

export default AuthPage;
