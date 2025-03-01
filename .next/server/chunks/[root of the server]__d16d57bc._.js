module.exports = {

"[project]/.next-internal/server/app/api/products/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/products/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
// src/api/products/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */ __turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'exa-js'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'openai'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
// 1. Instantiate Exa & OpenAI clients
const exa = new Exa(process.env.EXA_API_KEY);
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
async function POST(request) {
    try {
        const { items } = await request.json();
        // 2. Step 1: Retrieve with Exa
        // We'll search the web for "best Amazon products for <items> under <budget>"
        // You can tweak the query, e.g. add domain filters or advanced options
        const exaQuery = `I want Amazon products that fit the description of ${items} the best`;
        const exaResult = await exa.searchAndContents(exaQuery, {
            type: "neural",
            useAutoprompt: true,
            numResults: 5,
            text: true
        });
        // 3. Step 2: Combine Exa results + user query, pass to OpenAI
        // We'll instruct the LLM to produce strictly valid JSON (no code fences).
        const systemPrompt = `
      You are a helpful shopping assistant. 
      You have access to these search results about Amazon products. 
      Provide the top 20 product recommendations for the given item(s). 
      Make sure to include the corresponding Amazon asin (Amazon Standard Identificatioin Number) for each product.
    `;
        const userMessage = `
      User wants: "${items}" from Amazon. The user does not want any items that do not closely match the search for "${items}".
      Here are the Exa search results:
      ${JSON.stringify(exaResult)}

      Please parse through all of the items and suggest the top 7-10 products, strictly responding in valid JSON format only (no code fences, disclaimers, etc.).
      Only respond with the corresponding asin (Amazon Standard Identification Number) for each product.
      Example final output:
      [
        {
          "asin": "B07XYZ1234",
        },
        ...
      ]
    `;
        // 4. Call OpenAI Chat Completions
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        });
        // 5. Extract the LLM's raw text
        const rawContent = response.choices?.[0]?.message?.content || "";
        // Remove code fences if any
        const sanitized = rawContent.replace(/```(\w+)?/g, "").trim();
        // 6. Parse the JSON
        let parsed;
        try {
            parsed = JSON.parse(sanitized);
            // Log the parsed response for debugging
            console.log("Parsed response:", parsed);
            // Ensure parsed is an array
            if (!Array.isArray(parsed)) {
                throw new Error("Parsed response is not an array");
            }
        } catch (err) {
            console.error("Error parsing LLM JSON:", err);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid JSON from LLM"
            }, {
                status: 500
            });
        }
        // Log the products before returning
        console.log("Products to return:", parsed);
        // Extract ASINs and remove duplicates using a Set
        const asins = Array.from(new Set(parsed.map((obj)=>obj.asin).filter(Boolean)));
        // Return the unique ASINs directly
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(asins);
    } catch (err) {
        console.error("Error in /api/products route:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: err.message
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__d16d57bc._.js.map