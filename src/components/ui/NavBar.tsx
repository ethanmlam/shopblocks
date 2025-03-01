"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "https://github.com/vsvaidya27/VShop-AI", label: "About" },
];

const linkClasses = "text-foreground transition-colors hover:text-foreground";

interface PriceFeed {
  price: number;      // numeric price in USD
  timestamp: number;  // numeric UNIX timestamp
}

export function NavigationHeader() {
  const [priceFeed, setPriceFeed] = useState<PriceFeed | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPriceFeed = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/eoracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uint16: 2 }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to fetch price feed");
      }

      const data = await response.json();
      console.log("Fetched Price Feed:", data);

      // data = { price: "2711", timestamp: "1739707203" }

      // 1. Parse them into numbers
      const numericPrice = parseFloat(data.price);
      const numericTimestamp = parseInt(data.timestamp, 10);

      // 2. Store in state
      setPriceFeed({
        price: numericPrice,
        timestamp: numericTimestamp,
      });
    } catch (error) {
      console.error("Error fetching price feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 z-50">
      <nav className="flex items-center gap-6 text-lg font-medium md:gap-5 md:text-sm lg:gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <span>VShop AI</span>
        </Link>
        {navigation.map((link) => (
          <Button key={link.href} variant="link" className={cn(linkClasses, "p-0")}>
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {/* Show price if we have a numeric priceFeed */}
        {priceFeed && (
          <div className="text-sm font-medium">
            1 ETH = ${priceFeed.price.toFixed(2)} USD
            <div className="text-gray-400 text-sm text-center">
              Data provided by <a href="https://eoracle.io" className="text-blue-400 underline">eoracle.io</a> AVS
            </div>
          </div>
        )}

        <Button
          onClick={fetchPriceFeed}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Refresh Price"
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
