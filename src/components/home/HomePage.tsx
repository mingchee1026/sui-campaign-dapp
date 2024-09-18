import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { GeneralTable } from "../general/GeneralTable";

export const HomePage = () => {
  const router = useRouter();

  const tableHeaders = ["ID", "Referee Address", "Explorer"];
  const tableRows = [
    {
      id: "1",
      columns: [
        "1",
        "0xb66d3400281501a1278c09d6dc9bde4b3741a5de7629898ba0278964ea82109e",
        "View",
      ],
      isSelected: false,
    },
    {
      id: "2",
      columns: [
        "2",
        "0xb66d3400281501a1278c09d6dc9bde4b3741a5de7629898ba0278964ea82109e",
        "View",
      ],
      isSelected: false,
    },
    {
      id: "3",
      columns: [
        "3",
        "0xb66d3400281501a1278c09d6dc9bde4b3741a5de7629898ba0278964ea82109e",
        "View",
      ],
      isSelected: false,
    },
  ];
  const tableState = {
    page: 0,
    pageSize: 10,
    isLoading: false,
  };
  const tableCaption = "Referrals Table";

  const onLoginClick = async () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center space-y-[20px]">
      <div className="p-10 min-h-[10vh] text-center font-bold text-white text-[24px]">
        This is the Referral Campaign Home Page
      </div>
      <div className="p-10 min-h-[10vh] text-center font-bold text-white text-[24px]">
        Campaign ID: {process.env.NEXT_PUBLIC_CAMPAIGN_DATA_ID}
      </div>
      <div className="flex flex-col items-center justify-center md:flex-row">
        <button
          onClick={onLoginClick}
          // className="w-[164px] h-[64px] px-4 py-2 space-x-2 text-white transition duration-300 ease-in-out transform bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:-translate-y-1"
          className="w-[164px] h-[64px] bg-[inherit] rounded-[10px] border-[1px] border-[#CCCCCC] hover:bg-gray-300"
        >
          <div>Login</div>
        </button>
      </div>
      <div className="min-h-[50vh] flex flex-col items-center justify-center md:flex-row">
        <Image
          src="/general/sui-logo-white.svg"
          alt="Info"
          width={160}
          height={20}
        />
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
  );
};
