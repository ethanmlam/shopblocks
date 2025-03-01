module.exports = {

"[project]/.next-internal/server/app/api/rye-list/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route.runtime.dev.js [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/rye-list/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
// src/api/rye-list/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */ __turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$request$2f$build$2f$entrypoints$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/graphql-request/build/entrypoints/main.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$request$2f$build$2f$legacy$2f$classes$2f$GraphQLClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-request/build/legacy/classes/GraphQLClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$request$2f$build$2f$legacy$2f$functions$2f$gql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/graphql-request/build/legacy/functions/gql.js [app-route] (ecmascript)");
;
;
// This is the staging endpoint for Rye GraphQL
const RYE_GRAPHQL_ENDPOINT = "https://staging.graphql.api.rye.com/v1/query";
// We create a GraphQLClient. By default, we pass Basic auth in headers.
// If you need a JWT for read ops, you can replace or augment these headers below.
const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$request$2f$build$2f$legacy$2f$classes$2f$GraphQLClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GraphQLClient"](RYE_GRAPHQL_ENDPOINT, {
    headers: {
        Authorization: "Basic UllFL3N0YWdpbmctMjhiMjZlMGI2YTIwNDBmM2JiNTU6",
        "Rye-Shopper-IP": "136.25.178.75"
    }
});
// A simplified function to fetch product details
async function fetchProduct(asin) {
    const query = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$graphql$2d$request$2f$build$2f$legacy$2f$functions$2f$gql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gql"]`
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
            marketplace: 'AMAZON'
        }
    };
    const data = await client.request(query, variables);
    console.log(JSON.stringify(data, undefined, 2));
    return data.product; // Return the product directly
}
async function POST(request) {
    try {
        // 1. Parse the incoming JSON body
        const { asins } = await request.json();
        // 2. Validate the input is an array
        if (!Array.isArray(asins)) {
            throw new Error("Invalid 'asins' parameter. Must be an array of strings.");
        }
        // 3. For each ASIN, fetch product details from Rye
        const productDetails = await Promise.all(asins.map(async (asin)=>{
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
        }));
        // 4. Filter out null results and return the rest
        const validProducts = productDetails.filter((p)=>p !== null);
        // 5. Return the final array of product objects
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(validProducts);
    } catch (err) {
        console.error("Error in /api/rye-list route:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: err.message
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__82206be0._.js.map