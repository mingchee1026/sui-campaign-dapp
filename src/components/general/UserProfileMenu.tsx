//@ts-ignore
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
//@ts-ignore
import { jwtDecode } from "jwt-decode";
//@ts-ignore
import { CopyIcon } from "@radix-ui/react-icons";
//@ts-ignore
import { formatAddress } from "@mysten/sui/utils";
//@ts-ignore
import toast from "react-hot-toast";

import {
  useEnokiFlow,
  useZkLogin,
  useZkLoginSession,
  //@ts-ignore
} from "@mysten/enoki/react";
import { useMemo } from "react";
import { formatString } from "@/helpers/formatString";
import Image from "next/image";

export const UserProfileMenu = () => {
  const { address } = useZkLogin();
  const enokiFlow = useEnokiFlow();
  const zkLoginSession = useZkLoginSession();

  const decodedJWT = useMemo(() => {
    if (!zkLoginSession?.jwt) return null;
    const decoded: any = jwtDecode(zkLoginSession?.jwt!);
    return decoded;
  }, [zkLoginSession?.jwt]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address!);
    toast.success("Address copied to clipboard");
  };

  if (!address) {
    return "";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {!!decodedJWT?.picture && (
          <button>
            <Image
              src={decodedJWT?.picture}
              alt="profile"
              width={40}
              height={40}
              className="pr-0 rounded-full"
            />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div>
            {decodedJWT?.given_name} {decodedJWT?.family_name}
          </div>
          <div className="text-xs text-black text-opacity-60">
            {decodedJWT?.email ? formatString(decodedJWT?.email, 25) : ""}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center justify-between w-full">
            <div>{formatAddress(address!)}</div>
            <button onClick={handleCopyAddress}>
              <CopyIcon className="w-4 h-4 text-black" />
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => enokiFlow.logout()}
          className="flex items-center justify-between w-full"
        >
          <div>Log out</div>
          <LogOut className="w-4 h-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
