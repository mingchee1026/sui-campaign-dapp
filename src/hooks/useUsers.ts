import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
//@ts-ignore
import toast from "react-hot-toast";
import { useZkLogin } from "./useZkLogin";

export const useUsers = () => {
  // const enokiFlow = useEnokiFlow();
  const { address, decodedJwt } = useZkLogin();
  // const zkLoginSession = useZkLoginSession();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState();
  const [referred, setReferred] = useState();

  const handleRegisterUser = useCallback(async () => {
    setIsLoading(true);

    const encodedJwt = sessionStorage.getItem("sui_jwt_token");

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${encodedJwt}`,
      },
    };

    const wallet_address = address();
    const referred_by = localStorage.getItem("referred_by");

    console.log({ wallet_address });

    const postData = {
      campaign_id: process.env.NEXT_PUBLIC_CAMPAIGN_DATA_ID,
      wallet_address,
      referred_by,
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

    const jwt = decodedJwt();
    if (!jwt) {
      setIsLoading(false);
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
