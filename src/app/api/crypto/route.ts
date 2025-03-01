import { NextResponse } from "next/server";
import { ethers } from 'ethers';

const ETH_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

export async function POST(request: Request) {
    if (request.method === 'POST') {
      const { product } = await request.json();
  
      if (!product) {
        return NextResponse.json({ message: 'Product data is required.' }, { status: 400 });
      }
  
      try {
        // 1) Fetch ETH price
        const response = await fetch(ETH_PRICE_API);
        const data = await response.json();
        const ethPrice = data.ethereum.usd;
  
        // 2) Sum up all the numeric prices from the array
        const amountInUSD = product.reduce((total: number, item: { price: number }) => total + item.price, 0);
  
        // 3) Validate
        if (isNaN(amountInUSD) || isNaN(ethPrice) || ethPrice <= 0) {
          return NextResponse.json({ message: 'Invalid ETH price or amount in USD.' }, { status: 400 });
        }
  
        const rawValue = amountInUSD / ethPrice;
        // Truncate or round to 18 decimals
        const truncatedValue = rawValue.toFixed(18); 
        const amountInETH = ethers.parseUnits(truncatedValue, 'ether');

  
        console.log("ETH PRICE: ", amountInETH);
  
        return NextResponse.json({
          message: 'Price calculated successfully!',
          amountInETH: amountInETH.toString(),
        }, { status: 200 });
        
      } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Error processing request.', error: (error as Error).message }, { status: 500 });
      }
    } else {
      return NextResponse.json({ message: `Method ${request.method} Not Allowed` }, { status: 405 });
    }
  }  

export async function GET() {
    return new Response(JSON.stringify({ message: "GET request successful" }), { status: 200 });
} 