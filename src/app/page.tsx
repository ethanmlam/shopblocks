"use client";

import { useAccount } from "wagmi";
import NotSignedIn from "@/components/ui/wallet-sign-in";
import './globals.css';
import { Providers } from '@/providers'; 
import { NavigationHeader } from "@/components/ui/NavBar";
import  Main from "@/components/ui/main";

export default function HomePage() {
  const { status } = useAccount();

  return (
    <div>
      <NavigationHeader />
      {status === "connected" ? (
        <div className="flex">
            <Providers> 
              <Main />
            </Providers>
        </div>
      ) : (
        <NotSignedIn />
      )}
    </div>
  );
}
