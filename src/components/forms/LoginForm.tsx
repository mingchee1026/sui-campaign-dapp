"use client";

import React from "react";
import { useRouter } from "next/navigation";
//@ts-ignore
import { useEnokiFlow, useZkLogin } from "@mysten/enoki/react";
import Link from "next/link";
import Image from "next/image";
//@ts-ignore
import toast from "react-hot-toast";
import { stat } from "fs";

export const LoginForm = () => {
  const router = useRouter();
  const enokiFlow = useEnokiFlow();
  const { address } = useZkLogin();

  const onSignInClick = async () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const customRedirectUri = `${protocol}//${host}/auth`;

    enokiFlow
      .createAuthorizationURL({
        provider: "google",
        network: "testnet",
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirectUrl: customRedirectUri,
        extraParams: {
          scope: ["openid", "email", "profile"],
        },
      })
      .then((url: string) => {
        router.push(url);
      })
      .catch((error: any) => {
        console.error(error);
        toast.error("Failed to create authorization URL");
      });
  };

  return (
    <div className="flex flex-col items-center space-y-[20px]">
      <div className="bg-white flex flex-col p-[60px] max-w-[480px] mx-auto rounded-[24px] items-center space-y-[30px]">
        <Image
          src="/general/6degrees-logo.png"
          alt="6degrees"
          width={160}
          height={20}
        />
        <div className="flex flex-col space-y-[30px] items-center">
          <div className="flex flex-col space-y-[20px] items-center">
            <div className="font-[700] text-[20px] text-center">
              6Degrees <br />
            </div>
            <div className="text-center text-opacity-90 text-[14px] text-[#4F4F4F]">
              Welcome to Referral Campaign DApp.
              <p>Sign in with you google account to view.</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center md:flex-row">
            <button
              onClick={onSignInClick}
              className="flex items-center w-full px-4 py-2 space-x-2 text-white transition duration-300 ease-in-out transform bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 md:w-auto hover:-translate-y-1"
            >
              <Image src="/google.svg" alt="Google" width={34} height={34} />
              <div>Sign in with Google</div>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center text-white text-[12px]">
        <div className="text-center">Learn more about MySten Labs at</div>
        <Link
          href="https://mystenlabs.com"
          target="_blank"
          rel="noopenner noreferrer"
          className="underline"
        >
          MySten Labs
        </Link>
      </div>
    </div>
  );
};
