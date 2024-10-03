import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
//@ts-ignore
import toast from "react-hot-toast";
//@ts-ignore
import { jwtDecode } from "jwt-decode";
import { useZkLogin } from "./useZkLogin";

export const useUsers = () => {
  // const enokiFlow = useEnokiFlow();
  const { address, jwtData, decodeJwt } = useZkLogin();
  // const zkLoginSession = useZkLoginSession();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState();
  const [referred, setReferred] = useState();

  const handleRegisterUser = useCallback(async () => {
    setIsLoading(true);

    // const signer = await enokiFlow.getKeypair({ network: "testnet" });
    // await enokiFlow.getProof();
    // const session = await enokiFlow.getSession();

    // const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
    //   fromB64(session?.ephemeralKeyPair)
    // );
    // console.log({ sessionKey: session?.ephemeralKeyPair });
    // console.log({ base64Key: fromB64(session?.ephemeralKeyPair) });
    // console.log({ ephemeralKeyPair });
    // console.log({
    //   ephemeralAddress: signer.getPublicKey().toSuiAddress(),
    // });
    // console.log({ ephemeralKeypair: signer });

    const referred_by = localStorage.getItem("referred_by");
    const postData = {
      campaign_id: process.env.NEXT_PUBLIC_CAMPAIGN_DATA_ID,
      wallet_address: address(),
      referred_by,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${jwtData()}`,
      },
    };

    console.log({ postData, axiosConfig });

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register`,
        postData,
        axiosConfig
      )
      .then(async (resp: any) => {
        if (resp.data.success) {
          console.log({ ret: resp.data });
          setProfile(resp.data.responseObject.user);
        }

        setIsLoading(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.error(err);
        toast.error(
          "An error occurred while registering the user. Try again later."
        );
      });

    localStorage.removeItem("referred_by");
  }, []);

  const handleGetProfile = useCallback(async () => {
    setIsLoading(true);

    const jwt = decodeJwt();
    if (!jwt) {
      return;
    }

    const campaign_id = process.env.NEXT_PUBLIC_CAMPAIGN_DATA_ID;
    const subject = jwt.sub;

    await axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile/${campaign_id}/${subject}`
      )
      .then((resp) => {
        if (resp.data.success) {
          setProfile(resp.data.responseObject);
        }

        setIsLoading(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.error(err);
        toast.error(
          "An error occurred while retrieving the user. Try again later."
        );
      });
  }, []);

  const handleGetReferred = useCallback(async (attribution_code: string) => {
    setIsLoading(true);

    await axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/referred/${attribution_code}`
      )
      .then((resp) => {
        if (resp.data.success) {
          setReferred(resp.data.responseObject);
        }

        setIsLoading(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.error(err);
        toast.error(
          "An error occurred while retrieving the user. Try again later."
        );
      });
  }, []);

  return {
    isLoading,
    profile,
    referred,
    handleRegisterUser,
    handleGetProfile,
    handleGetReferred,
  };
};
