import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useZkLogin, useZkLoginSession } from "@mysten/enoki/react";
import { jwtDecode } from "jwt-decode";

export const useUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState();
  const [referred, setReferred] = useState();
  const { address, salt } = useZkLogin();
  const zkLoginSession = useZkLoginSession();

  const handleRegisterUser = useCallback(async () => {
    setIsLoading(true);

    const attribution_code = localStorage.getItem("refer_code");
    const postData = {
      campaign_id: process.env.NEXT_PUBLIC_CAMPAIGN_DATA_ID,
      wallet_address: address,
      salt: salt,
      jwt: jwtDecode(zkLoginSession?.jwt!),
      attribution_code,
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
      .then(async (resp) => {
        if (resp.data.success) {
          setProfile(resp.data.responseObject);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        toast.error(
          "An error occurred while registering the user. Try again later."
        );
      });

    localStorage.removeItem("refer_code");
  }, [zkLoginSession?.jwt]);

  const handleGetProfile = useCallback(async () => {
    setIsLoading(true);

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
      .catch((err) => {
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
        .catch((err) => {
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
