import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
//@ts-ignore
import toast from "react-hot-toast";
import { useSui } from "./useSui";
import { useBalance } from "@/contexts/BalanceContext";
import { useZkLogin } from "./useZkLogin";

export const useRequestSui = () => {
  const { suiClient } = useSui();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const { encodedJwt } = useZkLogin();
  const { handleRefreshBalance } = useBalance();

  const handleRequestSui = useCallback(async () => {
    setIsLoading(true);
    await axios
      .get("https://pocs-faucet.vercel.app/api/faucet", {
        headers: {
          Authorization: `Bearer ${encodedJwt()}`,
        },
      })
      .then(async (resp) => {
        setIsLoading(false);
        await suiClient.waitForTransaction({
          digest: resp.data.txDigest,
        });
        handleRefreshBalance();
        toast.success("SUI received");
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.error(err);
        toast.error("Faucet limitation reached. Try again later.");
      });
  }, []);

  return {
    isLoading,
    balance,
    handleRequestSui,
  };
};
