"use client"

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

declare global {
  interface Window {
    arweaveWallet?: {
      getActiveAddress: () => Promise<string>;
      connect: (permissions: string[]) => Promise<void>;
      disconnect: () => Promise<void>;
    };
  }
}

export function ArConnectButton() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.arweaveWallet) {
        try {
          const address = await window.arweaveWallet.getActiveAddress();
          setWalletAddress(address);
        } catch (error) {
          console.error("Error getting active address:", error);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (window.arweaveWallet) {
      try {
        await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);
        const address = await window.arweaveWallet.getActiveAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error("Error connecting to ArConnect:", error);
      }
    } else {
      alert("ArConnect is not installed. Please install it to use this feature.");
    }
  };

  const disconnectWallet = async () => {
    if (window.arweaveWallet) {
      try {
        await window.arweaveWallet.disconnect();
        setWalletAddress(null);
      } catch (error) {
        console.error("Error disconnecting from ArConnect:", error);
      }
    }
  };

  return (
    <div>
      {walletAddress ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
          <Button onClick={disconnectWallet} variant="outline">
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={connectWallet}>Connect ArConnect</Button>
      )}
    </div>
  );
}
