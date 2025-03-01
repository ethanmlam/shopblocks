// src/api/rye-buy/route.ts

// import { NextResponse } from "next/server";
// import { RyeClient } from "@rye-api/rye-sdk";
// import axios from "axios";
// import { generateToken } from "@/lib/jwt";

// // 1. Payment Gateway Headers for Spreedly
// //    Replace with your real credentials from console.rye.com/account
// const PRODUCTION_PAYMENT_GATEWAY_HEADERS = {
//   Authorization: "Basic UllFL3N0YWdpbmctMjhiMjZlMGI2YTIwNDBmM2JiNTU6",
// };

// // 2. The Spreedly API endpoint for creating payment methods
// const SPREEDLY_ENDPOINT = "https://core.spreedly.com/v1/payment_methods.json";

// // 3. A helper to tokenize a credit card with Spreedly
// async function tokenizeCreditCard(
//   firstName: string,
//   lastName: string,
//   number: string,
//   cvv: string,
//   month: string,
//   year: string
// ): Promise<string> {
//   const response = await axios.post(
//     SPREEDLY_ENDPOINT,
//     {
//       payment_method: {
//         credit_card: {
//           first_name: firstName,
//           last_name: lastName,
//           number: number,
//           verification_value: cvv,
//           month: month,
//           year: year,
//         },
//         retained: true,
//       },
//     },
//     {
//       headers: PRODUCTION_PAYMENT_GATEWAY_HEADERS,
//     }
//   );

//   // The token of the created payment method
//   return response.data.transaction.payment_method.token;
// }

// // 4. Headers for your Rye environment
// //    You can store them in .env or a separate config
// const RYE_HEADERS = {
//   Authorization: "Basic UllFL3N0YWdpbmctMjhiMjZlMGI2YTIwNDBmM2JiNTU6",
//   "Rye-Shopper-IP": "136.25.178.75",
// };

// // 5. Create a RyeClient for cart creation & submission
// const ryeClient = new RyeClient({
//   authHeader: RYE_HEADERS.Authorization,
//   shopperIp: RYE_HEADERS["Rye-Shopper-IP"],
// });

// // 6. The main route
// export async function POST(request: Request) {
//   try {
//     // We expect a JSON body { asin: string }
//     const { asin } = await request.json();

//     console.log("asin", asin)
//     console.log("RyeClient instance:", ryeClient);
//     console.log("ryeClient.createCart:", ryeClient.createCart);
//     const freshToken = generateToken()

//     // 6A. Create a new cart with 1 item (the Amazon product)
//     const response = await axios.post(
//       "https://staging.graphql.api.rye.com/v1/query",
//       {
//         query: `
//           mutation CreateCart($asin: String!) {
//             createCart(
//               input: {
//                 items: {
//                   amazonCartItemsInput: [{
//                     quantity: 1
//                     productId: $asin
//                   }]
//                 }
//               }
//             ) {
//               cart {
//                 id
//                 cost {
//                   isEstimated
//                   subtotal {
//                     currency
//                     displayValue
//                     value
//                   }
//                   shipping {
//                     currency
//                     displayValue
//                     value
//                   }
//                   total {
//                     currency
//                     displayValue
//                     value
//                   }
//                 }
//                 stores {
//                   ... on AmazonStore {
//                     cartLines {
//                       quantity
//                       product {
//                         id
//                         title
//                       }
//                     }
//                     errors {
//                       code
//                       message
//                     }
//                   }
//                 }
//               }
//               errors {
//                 code
//                 message
//               }
//             }
//           }
//         `,
//         variables: {
//           asin
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${freshToken}`, // Bearer token from generateToken()
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const cart = response.data?.data?.createCart?.cart;
//     console.log("Full cart object:", JSON.stringify(cart, null, 2));

//     if (!cart?.id) {
//       throw new Error(
//         "Failed to create cart: " + JSON.stringify(response.data, null, 2)
//       );
//     }

//     const cartId = cart.cart.id;
//     console.log("Created cart with ID:", cartId);

//     // 6B. Tokenize the credit card (test card for demonstration)
//     //     Replace with real user card data in production
//     const paymentToken = await tokenizeCreditCard(
//       "Jane",
//       "Smith",
//       "4242424242424242", // test VISA
//       "123", // CVV
//       "12", // month
//       "2029" // year
//     );
//     console.log("Got payment token:", paymentToken);

//     // 6C. Submit the cart with the token
//     const submitCartResponse = await ryeClient.submitCart({
//       input: {
//         id: cartId,
//         token: paymentToken,
//       },
//     });

//     // 6D. Check the store statuses
//     const stores = submitCartResponse?.cart?.stores || [];
//     let successMsg = "Order submitted!";
//     stores.forEach((store) => {
//       if (store?.status) {
//         successMsg += ` Store status: ${store.status}`;
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       message: successMsg,
//       data: submitCartResponse,
//     });
//   } catch (error: any) {
//     console.error("Error buying item:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to buy item", error: error.message },
//       { status: 500 }
//     );
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import { generateToken } from "../../../lib/jwt";

// The staging GraphQL endpoint
const RYE_STAGING_ENDPOINT = "https://staging.graphql.api.rye.com/v1/query";

// FIX #1: We define `$asin: ID!` and use `countryCode: US` as an enum
const CREATE_CART_MUTATION = `
  mutation CreateCart($asin: ID!) {
    createCart(
      input: {
        cartSettings: {
          amazonSettings: { fulfilledByAmazon: true }
        }
        items: {
          amazonCartItemsInput: [{
            quantity: 1
            productId: $asin
          }]
        }
        buyerIdentity: {
          firstName: "Jane"
          lastName: "Smith"
          phone: "+14152940424"
          email: "jane@example.com"
          address1: "123 Main St"
          city: "San Francisco"
          countryCode: US
          provinceCode: "CA"
          postalCode: "94111"
        }
      }
    ) {
      cart {
        id
        cost {
          isEstimated
          subtotal {
            currency
            displayValue
            value
          }
          shipping {
            currency
            displayValue
            value
          }
          total {
            currency
            displayValue
            value
          }
        }
        stores {
          ... on AmazonStore {
            cartLines {
              quantity
              product {
                id
                title
              }
            }
            errors {
              code
              message
            }
          }
        }
      }
      errors {
        code
        message
      }
    }
  }
`;

export async function POST(request: Request) {
  try {
    // Expect { asin: string }
    const { asin } = await request.json();
    console.log("asin", asin);

    // Generate a Bearer token for staging
    const freshToken = generateToken();
    console.log("Using Bearer token:", freshToken);

    // 1) CREATE CART
    const createCartResponse = await axios.post(
      RYE_STAGING_ENDPOINT,
      {
        query: CREATE_CART_MUTATION,
        variables: {
          asin, // typed as ID! in the GQL
        },
      },
      {
        headers: {
          Authorization: `Bearer ${freshToken}`,
          "Rye-Shopper-IP": "136.25.178.75",
          "Content-Type": "application/json",
        },
      }
    );

    // Extract cart from response
    const cart = createCartResponse.data?.data?.createCart?.cart;
    console.log("Created cart object:", JSON.stringify(cart, null, 2));

    if (!cart?.id) {
      throw new Error(
        "Failed to create cart: " + JSON.stringify(createCartResponse.data, null, 2)
      );
    }
    const cartId = cart.id;
    console.log("Created cart with ID:", cartId);

    // FIX: Return the cart object using NextResponse
    return NextResponse.json(cart); // Return the cart object using NextResponse
  } catch (error: any) {
    console.error("Error buying item:", error);
    return NextResponse.json(
      { success: false, message: "Failed to buy item", error: error.message },
      { status: 500 }
    );
  }
}

