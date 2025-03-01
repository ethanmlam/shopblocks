ShopBlocks: The Web3 Shopping Companion
Voice-Activated | Crypto-Native | AI-Powered

ShopBlocks  is a Web3-native, AI-driven shopping agent built on the CDP onchain kit that enables seamless, voice-first e-commerce with multi-currency checkout—including ETH payments. Whether you're a seasoned crypto user or new to decentralized finance, ShopBlocks bridges traditional and blockchain-based commerce, making shopping effortless and verifiable on-chain.

🚀 Core Features
🗣️ Voice-Powered Shopping
AI-Driven Requests: Just say, "Find me tennis balls," and Shopblocks finds, verifies, and adds them to your cart.
ElevenLabs Integration: Audio responses provide a fully hands-free experience, ideal for accessibility.
✅ ASIN Validation (No Hallucinated Products)
On-Chain & API Verification: Real-time ASIN retrieval ensures that every listed product is legit.
External API Calls: Direct validation against Amazon to eliminate false listings.
🔍 RAG Pipeline (Web3-Optimized AI Search)
Exa AI + OpenAI: Retrieval-Augmented Generation (RAG) ensures precise, relevant product listings.
Perplexity (Optional): Alternative LLM-powered search for an extra layer of verification.
💳 Multi-Currency, Web3-Enabled Checkout
ETH & USD Payments: Choose to pay with fiat or seamlessly transact via RainbowKit + Wagmi.
EigenLayer AVS Integration: Uses a decentralized oracle (eoracle) to fetch real-time ETH–USD price data.
🛠 Getting Started
Clone & Install
bash
Copy
Edit
git clone https://github.com/<your-repo>/vshop-ai.git
cd vshop-ai
npm install
Set Up Environment
Create a .env.local file with your API keys:

plaintext
Copy
Edit
OPENAI_API_KEY=
PERPLEXITY_API_KEY=
EXA_API_KEY=
RYE_BASIC_PROD=
RYE_BASIC_PAY=
NEXT_PUBLIC_ELEVENLABS_API_KEY=
These keys power AI-driven product parsing, on-chain data verification, and multi-currency transactions.

Run Development Server
bash
Copy
Edit
npm run dev
# Open http://localhost:3000
🌐 About VShop AI
Web3-native e-commerce agent
Crypto-first checkout with ETH support
AI-powered product discovery & validation
Future-proofed with decentralized oracles
