"use client";

import React, { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSui } from "@/hooks/useSui";
import { generateNonce, generateRandomness } from "@mysten/zklogin";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Keypair, PublicKey } from "@mysten/sui/dist/cjs/cryptography";
import {
  OpenIdProvider,
  OpenIdProviderObject,
  UserKeyData,
} from "@/types/UsefulTypes";
//@ts-ignore
import toast from "react-hot-toast";

const MAX_EPOCH = 2; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

export const LoginForm = () => {
  const router = useRouter();
  const { suiClient } = useSui();

  const [loginUrl, setLoginUrl] = useState("");

  /* zkLogin end-to-end */

  /**
   * Start the zkLogin process by getting a JWT token from an OpenID provider.
   * https://docs.sui.io/concepts/cryptography/zklogin#get-jwt-token
   */
  async function beginZkLogin(provider: OpenIdProvider) {
    // Create a nonce
    const { epoch } = await suiClient.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + MAX_EPOCH; // the ephemeral key will be valid for MAX_EPOCH from now

    const ephemeralKeyPair = new Ed25519Keypair();

    const ephemeralPrivateKeyB64 = ephemeralKeyPair.getSecretKey();
    const ephemeralPublicKey: PublicKey = ephemeralKeyPair.getPublicKey();
    const ephemeralPublicKeyB64 = ephemeralPublicKey.toBase64();

    const randomness = generateRandomness();

    const nonce = generateNonce(ephemeralPublicKey, maxEpoch, randomness);

    // Save data to session storage so completeZkLogin() can use it after the redirect
    const userKeyData: UserKeyData = {
      provider,
      randomness: randomness.toString(),
      nonce: nonce,
      ephemeralPublicKey: ephemeralPublicKeyB64,
      ephemeralPrivateKey: ephemeralPrivateKeyB64,
      maxEpoch: maxEpoch,
    };

    sessionStorage.setItem("userKeyData", JSON.stringify(userKeyData));

    const redirectUri = getRedirectUri();

    // Start the OAuth flow with the OpenID provider
    const urlParamsBase = {
      nonce: nonce,
      redirect_uri: redirectUri,
    };

    let loginUrl: string;
    switch (provider) {
      case "Google": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          response_type: "id_token",
          scope: "openid email profile",
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE!,
        });

        loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${urlParams.toString()}`;

        break;
      }
      case "Twitch": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          response_type: "id_token",
          scope: "openid",
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID_TWITCH!,
          force_verify: "true",
          lang: "en",
          login_type: "login",
        });

        loginUrl = `https://id.twitch.tv/oauth2/authorize?${urlParams.toString()}`;

        break;
      }
      case "Facebook": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          response_type: "id_token",
          scope: "openid",
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID_FACEBOOK!,
        });

        loginUrl = `https://www.facebook.com/v19.0/dialog/oauth?${urlParams.toString()}`;

        break;
      }
      case "Apple": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          response_mode: "form_post",
          response_type: "code id_token",
          scope: "email",
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID_APPLE!,
        });

        loginUrl = `https://appleid.apple.com/auth/authorize?${urlParams.toString()}`;

        break;
      }
    }

    window.location.replace(loginUrl);
  }
  /*
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

    sessionStorage.setItem("userKeyData", JSON.stringify(userKeyData));

    return userKeyData;
  }
*/
  function getRedirectUri() {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const customRedirectUri = protocol + "//" + host + "/auth";
    console.log({ customRedirectUri });
    return customRedirectUri;
  }

  // useLayoutEffect(() => {
  //   prepareLogin().then((userKeyData) => {
  //     const REDIRECT_URI = "https://mvp.dev.sui.6degrees.co/auth";
  //     const customRedirectUri = getRedirectUri();
  //     const params = new URLSearchParams({
  //       // When using the provided test client ID + redirect site, the redirect_uri needs to be provided in the state.
  //       state: new URLSearchParams({
  //         redirect_uri: customRedirectUri,
  //       }).toString(),
  //       // Test Client ID for devnet / testnet:
  //       client_id: process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE!,
  //       redirect_uri: customRedirectUri, //REDIRECT_URI,
  //       response_type: "id_token",
  //       scope: "openid email profile", // "openid", "email", "profile"
  //       nonce: userKeyData.nonce,
  //     });

  //     setLoginUrl(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  //   });
  // }, []);

  const openIdProviders: OpenIdProviderObject[] = [
    { provider: "Google", logo: "/assets/icon/google-logo.svg" },
    { provider: "Twitch", logo: "/assets/icon/google-logo.svg" },
    { provider: "Facebook", logo: "/assets/icon/facebook-logo.svg" },
    { provider: "Apple", logo: "/assets/icon/apple-logo.svg" },
  ];

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
              <p>Sign in with you account to view.</p>
            </div>
          </div>
          {/* <div className="flex flex-col items-center justify-center md:flex-row"> */}
          {/* <button
              onClick={onSignInClick}
              className="flex items-center w-full px-4 py-2 space-x-2 text-white transition duration-300 ease-in-out transform bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 md:w-auto hover:-translate-y-1"
            >
              <Image src="/google.svg" alt="Google" width={34} height={34} />
              <div>Sign in with Google</div>
            </button> */}
          {openIdProviders.map((providerObj) => (
            <div
              className="flex flex-col items-center justify-center md:flex-row"
              key={providerObj.provider}
            >
              <button
                className="flex items-center w-full px-4 py-2 space-x-2 text-white transition duration-300 ease-in-out transform bg-blue-300 rounded-lg shadow-md hover:bg-blue-600 md:w-auto hover:-translate-y-1"
                onClick={() => {
                  beginZkLogin(providerObj.provider);
                }}
              >
                <Image
                  src={providerObj.logo}
                  alt={providerObj.provider}
                  width={34}
                  height={34}
                />
                Sign in with {providerObj.provider}
              </button>
            </div>
          ))}
          {/* </div> */}
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
