import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useZkLogin } from "@mysten/enoki/react";
import { UserProfileMenu } from "@/components/general/UserProfileMenu";
import { Balance } from "@/components/general/Balance";
import useScroll from "@/lib/hooks/use-scroll";

export const TopNavbar = () => {
  const { address } = useZkLogin();
  const scrolled = useScroll(10);

  return (
    <>
      <div
        className={`sticky top-0 flex flex-col w-full justify-evenly z-50 ${
          scrolled
            ? "border-b border-gray-200 bg-transparent/50 backdrop-blur-xl"
            : "bg-white/0"
        }`}
      >
        <div className="grid grid-cols-6 mx-5 my-5">
          <Link
            href="/"
            className="col-span-3 w-[min-content] md:w-[300px] text-2xl font-bold text-white"
          >
            <Image
              src="/general/6degrees-logo.png"
              alt="6degrees"
              width={160}
              height={20}
            />
          </Link>
          <div className="flex items-center justify-end col-span-3 space-x-1">
            {!!address && (
              <div className="flex items-center space-x-2">
                <Balance />
                <UserProfileMenu />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};