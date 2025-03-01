"use client";

import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";

import { config } from '../wagmi';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              {children}
              <Toaster />
            </RainbowKitProvider>
          </QueryClientProvider>
          </WagmiProvider>
      </body>
    </html>
  );
}

