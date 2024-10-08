"use client";

import React from "react";
import { ChildrenProps } from "@/types/ChildrenProps";
import { InfoIcon } from "./InfoIcon";
import { TopNavbar } from "./navbars/TopNavbar";

const NAVBAR_WIDTH = 350;

export const LargeScreenLayout = ({ children }: ChildrenProps) => {
  return (
    <div className="static flex-col items-center justify-center w-full h-full role-admin">
      <TopNavbar />
      <div>{children}</div>
      <div className="absolute bottom-0 left-0 p-8">
        <InfoIcon />
      </div>
    </div>
  );
};
