import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export const InfoIcon = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {/* <Button className="w-[40px] h-[40px] relative bg-white hover:bg-gray-100 h-rounded-[10px] border-[1px] border-[#CCCCCC] opacity-80">
            <Image src="/general/info.svg" alt="Info" fill={true} />
          </Button> */}
        </DialogTrigger>
        <DialogContent className="w-3/4 h-1/2">
          <DialogHeader>
            <DialogTitle>Game Rules</DialogTitle>
          </DialogHeader>
          <ScrollArea>
            <div className="space-y-[10px] text-black text-opacity-80 text-sm">
              <div>Referral Campaign.</div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
