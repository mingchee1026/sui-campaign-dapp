import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
//@ts-ignore
import toast from "react-hot-toast";
import {
  useEnokiFlow,
  useZkLogin,
  useZkLoginSession,
  //@ts-ignore
} from "@mysten/enoki/react";
//@ts-ignore
import { jwtDecode } from "jwt-decode";
//@ts-ignore
import { Transaction } from "@mysten/sui/transactions";
import { useSui } from "./useSui";

export const useUsers = () => {
  const { suiClient } = useSui();
  const enokiFlow = useEnokiFlow();
  const { address, salt } = useZkLogin();
  const zkLoginSession = useZkLoginSession();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState();
  const [referred, setReferred] = useState();

  const handleRegisterUser = useCallback(async () => {
    setIsLoading(true);

    const signer = await enokiFlow.getKeypair({ network: "testnet" });
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
      wallet_address: address,
      wallet_keypair: "test",
      salt: salt,
      jwt: jwtDecode(zkLoginSession?.jwt!),
      referred_by,
    };

    const axiosConfig = {
      headers: {
        "Enoki-api-key": process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
        Authorization: `Bearer ${zkLoginSession?.jwt}`,
      },
    };

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

          const userSignedTxn = await signer.signTransaction(
            await Transaction.from(
              resp.data.responseObject.sponsoredSignedTxn.bytes
            ).build({
              client: suiClient,
            })
          );

          suiClient
            .executeTransactionBlock({
              transactionBlock:
                resp.data.responseObject.sponsoredSignedTxn.bytes,
              signature: [
                userSignedTxn.signature,
                resp.data.responseObject.sponsoredSignedTxn.signature,
              ],
              requestType: "WaitForLocalExecution",
              options: {
                showObjectChanges: true,
                showEffects: true,
              },
            })
            .then(async (res: any) => {
              // console.log({ res });
              const status = res?.effects?.status.status;
              if (status !== "success") {
                console.log(
                  "Activity Transaction failed: executeTransactionBlock"
                );
              }
              console.log({ txDigest: res.effects?.transactionDigest! });
            })
            .catch((error: any) => {
              console.error({ error });
              // toast.error("Failed to create authorization URL");
            });
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
  }, [zkLoginSession?.jwt]);

  const handleGetProfile = useCallback(async () => {
    setIsLoading(true);

    if (!zkLoginSession) {
      return;
    }

    const jwt = jwtDecode(zkLoginSession?.jwt!);
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
  }, [zkLoginSession?.jwt]);

  const handleGetReferred = useCallback(
    async (attribution_code: string) => {
      setIsLoading(true);

      const jwt = jwtDecode(zkLoginSession?.jwt!);
      const campaign_id = process.env.NEXT_PUBLIC_CAMPAIGN_DATA_ID;
      const subject = jwt.sub;

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
    },
    [zkLoginSession?.jwt]
  );

  return {
    isLoading,
    profile,
    referred,
    handleRegisterUser,
    handleGetProfile,
    handleGetReferred,
  };
};
