import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSui } from "./useSui";
import { useBalance } from "@/contexts/BalanceContext";
import { fromB64 } from "@mysten/sui/utils";
import {
  useEnokiFlow,
  useZkLogin,
  useZkLoginSession,
} from "@mysten/enoki/react";

export const useMoveTransaction = () => {
  const { suiClient } = useSui();
  const enokiFlow = useEnokiFlow();
  const { address } = useZkLogin();
  const zkLoginSession = useZkLoginSession();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const { handleRefreshBalance } = useBalance();

  const handleActivityTx = useCallback(async () => {
    setIsLoading(true);

    const postData = {
      sender: address,
    };

    const axiosConfig = {
      headers: {
        "Enoki-api-key": process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
        Authorization: `Bearer ${zkLoginSession?.jwt}`,
      },
    };

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/txs/buildActivitySponsoredtx`,
        postData,
        axiosConfig
      )
      .then(async (sponsorshipResp) => {
        const sponsorTx = sponsorshipResp.data.txBytes;

        const signer = await enokiFlow.getKeypair();

        const senderSignature = await signer.signTransaction(
          fromB64(sponsorTx)
        );

        const postData = {
          tx: sponsorshipResp.data.txBytes,
          sponsorSig: sponsorshipResp.data.signature,
          senderSig: senderSignature,
        };

        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/txs/executeActivitySponsoredtx`,
            postData,
            axiosConfig
          )
          .then(async (txResp) => {
            if (txResp.data.digest) {
              await suiClient.waitForTransactionBlock({
                digest: txResp.data.digest,
              });

              toast.success("Transaction was executed successfully.");
            } else {
              toast.error("Unable to find a digest returned from the backend.");
            }

            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            console.error(err);
            toast.error(
              "An error occurred while executing tx. Try again later."
            );
          });
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        toast.error("An error occurred while executing tx. Try again later.");
      });
  }, [zkLoginSession?.jwt]);

  return {
    isLoading,
    handleActivityTx,
  };
};
