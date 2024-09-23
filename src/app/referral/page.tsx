"use client";

import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { useZkLogin } from "@mysten/enoki/react";
import { formatAddress } from "@mysten/sui/utils";
import Image from "next/image";
import { Paper } from "@/components/general/Paper";
import { useUsers } from "@/hooks/useUsers";
import { GeneralTable } from "@/components/general/GeneralTable";
import { getSuiExplorerLink } from "@/helpers/getSuiExplorerLink";
import { SuiExplorerLink } from "@/components/general/SuiExplorerLink";
import { LoadingButton } from "@/components/general/LoadingButton";

export default function Page() {
  const { address } = useZkLogin();
  const { isLoading, profile, referred, handleGetProfile, handleGetReferred } =
    useUsers();
  const [referralUri, setReferralUri] = useState("");
  const [tableRows, setTableRows] = useState([]);
  const [attributionCode, setAttributionCode] = useState("");

  const tableHeaders = [
    "Email",
    "Referee Address",
    "Custodial Address",
    "Explorer",
  ];
  const tableState = {
    page: 0,
    pageSize: 10,
    isLoading: false,
  };
  const tableCaption = "Referrals Table";

  useEffect(() => {
    const protocol = window.location.protocol;
    const host = window.location.host;

    if (!profile) {
      handleGetProfile();
    }

    //@ts-ignore
    const attribution_code = profile?.attribution_code;
    setAttributionCode(attribution_code);
    setReferralUri(`${protocol}//${host}/refer/${attribution_code}`);

    if (profile && !referred) {
      handleGetReferred(attribution_code);
    }
  }, [profile]);

  useEffect(() => {
    if (referred) {
      //@ts-ignore
      const rows = referred.map((referral, index) => {
        return {
          id: referral.email,
          columns: [
            referral.email,
            formatAddress(referral.wallet_address),
            formatAddress(referral.custodial_address),
            SuiExplorerLink({
              objectId: referral.custodial_address,
              moduleName: "",
              type: "address",
            }),
          ],
          isSelected: false,
        };
      });
      setTableRows(rows);
    }
  }, [referred]);

  const onReloadClick = () => {
    handleGetReferred(attributionCode);
  };

  return (
    <Paper>
      <div className="flex flex-col items-center space-y-[24px]">
        <div className="p-2 min-h-[2vh] text-center font-bold text-white text-[24px]">
          This is the Referral Widget page
        </div>
        <div className="p-2 min-h-[2vh] text-center font-bold text-white text-[22px]">
          Your Referral URL: {referralUri}
        </div>
        <div className="p-2 text-center font-bold text-white text-[22px]">
          Total Referred Users: {tableRows.length}
        </div>
        <div>
          <div className="flex justify-end">
            <LoadingButton
              onClick={onReloadClick}
              isLoading={isLoading}
              className="flex space-x-0 md:space-x-2 items-center border-[1px] border-custom-border rounded-[36px] px-[10px] bg-[inherit] hover:bg-[#12BF77]"
            >
              <Image
                src="/general/plus.svg"
                alt="plus"
                width={20}
                height={20}
              />
              <div className="hidden font-semibold md:block">
                Reload Referred Users
              </div>
            </LoadingButton>
          </div>
          <GeneralTable
            rows={tableRows}
            headers={tableHeaders}
            state={tableState}
            caption={tableCaption}
          />
        </div>
      </div>
    </Paper>
  );
}
