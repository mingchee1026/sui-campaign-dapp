"use client";

import React from "react";
import { useZkLogin } from "@mysten/enoki/react";
import { ChildrenProps } from "@/types/ChildrenProps";
import { TopNavbar } from "./navbars/TopNavbar";
import { InfoIcon } from "@/components/layouts/InfoIcon";

export const MobileLayout = ({ children }: ChildrenProps) => {
  const { address } = useZkLogin();

  return (
    <div
      // className={`static w-full h-full flex-col items-center justify-center ${
      //   address ? "role-admin" : "role-anonymous"
      // }`}
      className={`static w-full h-full flex-col items-center justify-center role-admin`}
    >
      <TopNavbar />
      {children}
      <div className="px-4">
        <InfoIcon />
      </div>
    </div>
  );
};
