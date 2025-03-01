import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

console.log("test")
export async function POST(request: Request) {
    // ABI of the IEOFeedManager interface
  const IEOFeedManagerAbi =  ["function getLatestPriceFeed(uint16 symbol) external view returns (tuple(uint256 value, uint256 timestamp))",
  "function getLatestPriceFeeds(uint16[] calldata symbols) external view returns (tuple(uint256 value, uint256 timestamp)[])"
];

  // Address of the deployed IEOFeedManager contract on Holesky network
  const IEOFeedManagerAddress = "0x723BD409703EF60d6fB9F8d986eb90099A170fd0";
  // Connect to the Ethereum network (Holesky in this case)
  const provider = new ethers.JsonRpcProvider('https://holesky.gateway.tenderly.co');

  // Create a contract instance
  const feedManagerContract = new ethers.Contract(IEOFeedManagerAddress, IEOFeedManagerAbi, provider);
  try {
    const { uint16 } = await request.json();
 
    const priceFeed = await feedManagerContract.getLatestPriceFeed(uint16);

    // Convert the price from wei to a more readable format
    const priceInEther = (priceFeed.value / ethers.WeiPerEther).toString();
    const timestamp = priceFeed.timestamp.toString();

    console.log(`Price: ${priceInEther}, Timestamp: ${timestamp}`);
    return NextResponse.json({ price: priceInEther, timestamp });
  } catch (error) {
    console.error('Error fetching price feed:', error);
    return NextResponse.json(
      { error: "Failed to parse intent" },
      { status: 500 }
    );
  } 

  // Call the functions with example symbol(s)
  // await getPrice(2); // For BTC:USD
  // await getPrices([1, 2]); // Example for multiple symbols (e.g., BTC:USD and ETH:USD)
}
