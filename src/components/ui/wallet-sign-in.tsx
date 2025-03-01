import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { WalletIcon } from "lucide-react"

console.log('Attempting to load NotSignedIn component...');

export default function NotSignedIn() {
  console.log('NotSignedIn component rendering...');
  
  try {
    console.log('Checking if dependencies are loaded:');
    console.log('- Alert component:', !!Alert);
    console.log('- ConnectButton:', !!ConnectButton);
    console.log('- WalletIcon:', !!WalletIcon);

    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Alert className="max-w-md w-full">
          <WalletIcon className="h-4 w-4" />
          <AlertTitle>Connect Your Wallet</AlertTitle>
          <AlertDescription className="mt-3">
            Please sign in to your wallet to access your account and make transactions.
          </AlertDescription>
          <div><ConnectButton/></div>
        </Alert>
      </div>
    )
  } catch (error) {
    console.error('Error rendering NotSignedIn component:', error);
    return <div>Error loading wallet connection. Please check console for details.</div>;
  }
}