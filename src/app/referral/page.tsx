"use client";

import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import {
  useAuthCallback,
  useZkLogin,
  useZkLoginSession,
} from "@mysten/enoki/react";
import { Paper } from "@/components/general/Paper";
import { useUsers } from "@/hooks/useUsers";
import { GeneralTable } from "@/components/general/GeneralTable";
import { getSuiExplorerLink } from "@/helpers/getSuiExplorerLink";
import { SuiExplorerLink } from "@/components/general/SuiExplorerLink";

export default function Page() {
  const { address } = useZkLogin();
  const { isLoading, profile, referred, handleGetProfile, handleGetReferred } =
    useUsers();
  const [referralUri, setReferralUri] = useState("");
  const [tableRows, setTableRows] = useState([]);

  const tableHeaders = ["Email", "Referee Address", "Explorer"];
  const tableState = {
    page: 0,
    pageSize: 10,
    isLoading: false,
  };
  const tableCaption = "Referrals Table";

  useEffect(() => {
    const protocol = window.location.protocol;
    const host = window.location.host;

    setReferralUri(`${protocol}//${host}`);

    if (!profile) {
      handleGetProfile();
    }

    if (profile && !referred) {
      handleGetReferred(profile.attribution_code);
    }
  }, [profile]);

  useEffect(() => {
    if (referred) {
      const rows = referred.map((referral, index) => {
        return {
          id: referral.email,
          columns: [
            referral.email,
            referral.wallet_address,
            SuiExplorerLink({
              objectId: referral.wallet_address,
              moduleName: "",
              type: "address",
            }),
          ],
          isSelected: false,
        };
      });
      setTableRows(rows);
      // console.log({ referred });
    }
  }, [referred]);

  return (
    <Paper>
      <div className="flex flex-col items-center space-y-[24px]">
        <div className="p-2 min-h-[2vh] text-center font-bold text-white text-[24px]">
          This is the Referral Widget page
        </div>
        <div className="p-2 min-h-[2vh] text-center font-bold text-white text-[22px]">
          Your Referral URL:{" "}
          {`${referralUri}/refer/${profile?.attribution_code}`}
        </div>
        <div className="p-2 text-center font-bold text-white text-[22px]">
          Total Referred Users: {tableRows.length}
        </div>
        <div>
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
