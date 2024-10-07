"use client";

import { useLayoutEffect, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { generateRandomness } from "@mysten/zklogin";
//@ts-ignore
import { jwtDecode } from "jwt-decode";
import { Spinner } from "@/components/general/Spinner";
//@ts-ignore
import toast from "react-hot-toast";
import { UserKeyData } from "@/types/UsefulTypes";
import { useZkLogin } from "@/hooks/useZkLogin";
import { LoginResponse } from "@/types/UsefulTypes";

const AuthPage = () => {
  const router = useRouter();
  const { isAuthenticated, address } = useZkLogin();
  const { isLoading, handleRegisterUser } = useUsers();
  const [userSalt, setUserSalt] = useState("");

  const getSalt = async (jwtEncoded: string) => {
    const decodedJwt: LoginResponse = (await jwtDecode(
      jwtEncoded!
    )) as LoginResponse;

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${jwtEncoded}`,
      },
    };

    const postData = {
      subject: decodedJwt.sub,
      salt: generateRandomness(),
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/salt`,
      postData,
      axiosConfig
    );

    console.log("getSalt response = ", response);

    if (response?.data.success) {
      const salt = response.data.responseObject.salt;
      console.log("Salt fetched! Salt = ", salt);
      sessionStorage.setItem("sui_user_salt", salt);
      setUserSalt(salt);
    } else {
      console.log("Error Getting SALT");
    }
  };

  useLayoutEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const jwt_token_encoded = hash.get("id_token");

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

    getSalt(jwt_token_encoded);
  }, []);

  useEffect(() => {
    if (userSalt) {
      handleRegisterUser().then(() => {
        router.push("/");
      });
    }
  }, [userSalt]);

  return <Spinner />;
};

export default AuthPage;
