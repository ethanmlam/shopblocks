"use client";

import { useAccount } from "wagmi";
import NotSignedIn from "@/components/ui/wallet-sign-in";
import { NavigationHeader } from "@/components/ui/NavBar";
import  Main from "@/components/ui/main";

export default function HomePage() {
  const { status } = useAccount();

  return (
    <div>
      <NavigationHeader />
      {status === "connected" ? (
        <div className="flex">
          <Main />
        </div>
      ) : (
        <NotSignedIn />
      )}
    </div>
  );
}
