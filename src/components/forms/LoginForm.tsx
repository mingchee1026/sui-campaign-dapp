"use client";

import React, { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSui } from "@/hooks/useSui";
import { generateNonce, generateRandomness } from "@mysten/zklogin";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Keypair, PublicKey } from "@mysten/sui/dist/cjs/cryptography";
import { UserKeyData } from "@/types/UsefulTypes";
//@ts-ignore
import toast from "react-hot-toast";

export const LoginForm = () => {
  const router = useRouter();
  const { suiClient } = useSui();

  const [loginUrl, setLoginUrl] = useState("");

  const onSignInClick = async () => {
    router.push(loginUrl);
  };

  async function prepareLogin() {
    const { epoch, epochDurationMs, epochStartTimestampMs } =
      await suiClient.getLatestSuiSystemState();

    const maxEpoch = parseInt(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.
    const ephemeralKeyPair: Keypair = new Ed25519Keypair();
    const ephemeralPrivateKeyB64 = ephemeralKeyPair.getSecretKey(); //.export().privateKey;

    const ephemeralPublicKey: PublicKey = ephemeralKeyPair.getPublicKey();
    const ephemeralPublicKeyB64 = ephemeralPublicKey.toBase64();
    const walletAddress = ephemeralPublicKey.toSuiAddress();

    const jwt_randomness = generateRandomness();
    const nonce = generateNonce(ephemeralPublicKey, maxEpoch, jwt_randomness);

    console.log("current epoch = " + epoch);
    console.log("maxEpoch = " + maxEpoch);
    console.log("jwt_randomness = " + jwt_randomness);
    console.log("ephemeral public key = " + ephemeralPublicKeyB64);
    console.log("wallet address = " + walletAddress);
    console.log("nonce = " + nonce);

    const userKeyData: UserKeyData = {
      randomness: jwt_randomness.toString(),
      nonce: nonce,
      ephemeralPublicKey: ephemeralPublicKeyB64,
      ephemeralPrivateKey: ephemeralPrivateKeyB64,
      maxEpoch: maxEpoch,
    };
    localStorage.setItem("userKeyData", JSON.stringify(userKeyData));
    return userKeyData;
  }

  function getRedirectUri() {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const customRedirectUri = protocol + "//" + host + "/auth";
    console.log({ customRedirectUri });
    return customRedirectUri;
  }

  useLayoutEffect(() => {
    prepareLogin().then((userKeyData) => {
      const REDIRECT_URI = "https://mvp.dev.sui.6degrees.co/auth";
      const customRedirectUri = getRedirectUri();
      const params = new URLSearchParams({
        // When using the provided test client ID + redirect site, the redirect_uri needs to be provided in the state.
        state: new URLSearchParams({
          redirect_uri: customRedirectUri,
        }).toString(),
        // Test Client ID for devnet / testnet:
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirect_uri: customRedirectUri, //REDIRECT_URI,
        response_type: "id_token",
        scope: "profile", // "openid", "email", "profile"
        nonce: userKeyData.nonce,
      });

      setLoginUrl(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
    });
  }, []);

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
