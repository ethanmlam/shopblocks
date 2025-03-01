// src/api/rye-list/route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { GraphQLClient, gql } from "graphql-request";

// This is the staging endpoint for Rye GraphQL
const RYE_GRAPHQL_ENDPOINT = "https://staging.graphql.api.rye.com/v1/query";

// We create a GraphQLClient. By default, we pass Basic auth in headers.
// If you need a JWT for read ops, you can replace or augment these headers below.
const client = new GraphQLClient(RYE_GRAPHQL_ENDPOINT, {
  headers: {
    Authorization: "Basic UllFL3N0YWdpbmctMjhiMjZlMGI2YTIwNDBmM2JiNTU6",
    "Rye-Shopper-IP": "136.25.178.75",
  },
});

// We define a Product interface to match the full GraphQL structure
interface Product {
  id: string;
  title: string;
  marketplace: string;
  description: string;
  vendor: string;
  url: string;
  isAvailable: boolean;
  images: { url: string }[];
  price: {
    currency: string;
    displayValue: string;
    value: number;
  };
  // Fields specific to Amazon products
  ASIN?: string;
  featureBullets?: string[];
  ratingsTotal?: number;
  reviewsTotal?: number;
  specifications?: { name: string; value: string }[];
}


// A simplified function to fetch product details
async function fetchProduct(asin: string) {
  const query = gql`
    query DemoAmazonProductFetch($input: ProductByIDInput!) {
      product: productByID(input: $input) {
        title
        vendor
        url
        isAvailable
        images {
          url
        }
        price {
          displayValue
        }
        ... on AmazonProduct {
          ASIN
        }
      }
    }
  `;

  const variables = {
    input: {
      id: asin,
      marketplace: 'AMAZON',
    },
  };

  const data = await client.request<{ product: Product }>(query, variables);
  console.log(JSON.stringify(data, undefined, 2));
  return data.product; // Return the product directly
}

/**
 * This route expects a JSON body like:
 * {
 *   "asins": ["B07ABC1234", "B07XYZ5678", ...]
 * }
 * and returns an array of Product objects for each valid ASIN.
 */
export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON body
    const { asins } = await request.json();

    // 2. Validate the input is an array
    if (!Array.isArray(asins)) {
      throw new Error("Invalid 'asins' parameter. Must be an array of strings.");
    }

    // 3. For each ASIN, fetch product details from Rye
    const productDetails = await Promise.all(
      asins.map(async (asin: string) => {
        try {
          const product = await fetchProduct(asin); // Call the new fetchProduct function

          // If product is null or undefined, we return null for this ASIN
          if (!product) {
            console.warn(`ASIN ${asin} returned no product data`);
            return null;
          }

          // Otherwise, we return the product object
          return product;
        } catch (error) {
          console.error(`Error fetching ASIN ${asin}:`, error);
          // Return null so we can skip this item
          return null;
        }
      })
    );

    // 4. Filter out null results and return the rest
    const validProducts = productDetails.filter((p) => p !== null);

    // 5. Return the final array of product objects
    return NextResponse.json(validProducts);
  } catch (err: any) {
    console.error("Error in /api/rye-list route:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
