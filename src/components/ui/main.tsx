/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ShoppingCart, Mic, StopCircle, Send, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { useSendTransaction } from 'wagmi'
import axios from "axios"
import * as dotenv from "dotenv";

dotenv.config();

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

const VOICE_ID = '29vD33N1CtxCmqQRPOHJ'

interface Product {
  id: string
  title: string
  marketplace: string
  description: string
  vendor: string
  url: string
  isAvailable: boolean
  images: { url: string }[]
  price: {
    currency: string
    displayValue: string
    value: number
  }
  ASIN?: string
}

export default function Main() {
  const [transcript, setTranscript] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedIntent, setParsedIntent] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<Product[] | null>(null)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [purchasedItem, setPurchasedItem] = useState<any>(null)
  const [progress, setProgress] = useState(0)


  const { sendTransaction } = useSendTransaction()

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10))
      }, 500)
      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [isProcessing])

  const startRecording = async () => {
    console.log("Starting recording...")
    setError(null)
    setParsedIntent(null)
    setRecommendations(null)
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        throw new Error("Your browser does not support Speech Recognition.")
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => setIsRecording(true)
      recognition.onend = () => setIsRecording(false)

      recognition.onresult = (event: any) => {
        const transcriptResult = event.results[0][0].transcript
        setTranscript(transcriptResult)
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setError(`Speech recognition error: ${event.error}`)
        setIsRecording(false)
      }

      recognition.start()
    } catch (err) {
      console.error("Error starting recording:", err)
      setError("Microphone access denied. Please allow microphone access and try again.")
      setIsRecording(false)
    }
  }

  const createAudioStreamFromText = async (text: string): Promise<Blob> => {
    try {
      const requestBody = {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.8, similarity_boost: 0.8 },
      };

      console.log("Request Body:", requestBody); // Log the request body

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          responseType: "blob", // Get a blob response
        }
      );

      return response.data; // Returns a Blob
    } catch (error) {
      throw new Error("Failed to create audio stream.", error);
    }
  }

  const handleProductAudio = useCallback(async (productsData) => {
    try {
      const scripted = productsData.length === 0 ?  `We found ${productsData.length} products.` : `We found ${productsData.length} products. Here they are:`;
      // Play the announcement audio
      const announcementBlob = await createAudioStreamFromText(scripted);
      const announcementUrl = URL.createObjectURL(announcementBlob);
      const announcementAudio = new Audio(announcementUrl);
      await announcementAudio.play(); // Play the announcement audio

      // for (const [index, product] of productsData.entries()) { // Use entries to get index
      //   const numberedTitle = `${index + 1}.  ${product.title}`; // Create a numbered title
      //   const audioBlob1 = await createAudioStreamFromText(numberedTitle);
      //   const audioUrl1 = URL.createObjectURL(audioBlob1);
      //   const audio1 = new Audio(audioUrl1);

      //   // Create a promise that resolves when the audio ends
      //   await new Promise((resolve) => {
      //     audio1.onended = resolve; // Resolve the promise when the audio ends
      //     audio1.play(); // Play the audio
      //   });
      // }
    } catch (error) {
      console.error("Error playing audio for products:", error);
    }
  }, []);

  const processTranscript = async () => {
    console.log("Processing transcript:", transcript)
    setIsProcessing(true)
    setParsedIntent(null)
    setRecommendations(null)
    try {
      const userMessage = { role: "user", content: transcript }
      setMessages((prev) => [...prev, userMessage])

      const response = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API request failed with status ${response.status}: ${errorData.message || "Unknown error"}`)
      }

      const data = await response.json()
      console.log("API Response:", data)

      let formattedIntent
      try {
        formattedIntent = JSON.parse(data.parsedIntent)
      } catch (error) {
        console.error("Failed to parse parsedIntent:", error)
        formattedIntent = [data.parsedIntent]
      }
        // Check if the last element ends with a question mark
      const lastElement = formattedIntent[formattedIntent.length - 1]
      if (lastElement.endsWith("?")) {
        console.log("The last element is a question:", lastElement)
        // Play audio for the message
        const audioBlob = await createAudioStreamFromText(formattedIntent.join(", "))
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        await audio.play() // Play the audio
      
        return
        // You can add additional logic here if needed
      }
      // Check if the AI message indicates it didn't understand
      else if (formattedIntent.join(", ") === "I didn't understand, please try again." || formattedIntent.join(", ") === "[I didn't understand, please try again.]" ) {
        const aiMessage = { role: "assistant", content: "I didn't understand, please try again." }
        setMessages((prev) => [...prev, aiMessage])
  
          // Play audio for the message
          const audioBlob = await createAudioStreamFromText("I didn't understand, please try again.")
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          await audio.play() // Play the audio
          return
      }
      else{
        const searchMessage = `Searching for: ${formattedIntent.join(", ")}`
        const aiMessage = { role: "assistant", content: searchMessage }

        setMessages((prev) => [...prev, aiMessage])
        setParsedIntent(formattedIntent)
        const audioBlob = await createAudioStreamFromText(searchMessage)
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        await audio.play() // Play the audio


        const asinsRes = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: formattedIntent,
          }),
        })
        const asinsData: string[] = await asinsRes.json()
        console.log("Returned ASINs:", asinsData)

        const listRes = await fetch("/api/rye-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ asins: asinsData }),
        })
        if (!listRes.ok) {
          const errorData = await listRes.json()
          throw new Error(
            `Rye list request failed with status ${listRes.status}: ${errorData.message || "Unknown error"}`,
          )
        }
        const productsData: Product[] = await listRes.json()
        console.log("Product details:", productsData)
        

        setRecommendations(productsData)
        // Play audio for the message
        await handleProductAudio(productsData)
        
    }
    } catch (error) {
      console.error("Error processing transcript:", error)
      setError("Error processing transcript. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBuyNow = async (asin: string) => {
    const product = recommendations?.find((prod) => prod.ASIN === asin || prod.id === asin)
    try {
      const response = await fetch("/api/rye-buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asin }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Buy request failed: ${errorData.message || "Unknown error"}`)
      }

      const data = await response.json()
      console.log("Item bought successfully:", data)

      setPurchasedItem(product)
      setRecommendations((prev) => prev)
    } catch (error) {
      console.error("Error buying item:", error)
      setError("Error buying item. Please try again.")
    }
  }

  const handleBuyETH = async (products: Product[]) => {
    console.log("Preparing to buy products with ETH:", products);
  
    // Instead of p.price.value, parse out the numeric from p.price.displayValue
    const minimalData = products.map((p) => {
      // e.g. "$17.97" => 17.97
      const numericPrice = parseFloat(p.price.displayValue.replace(/[^0-9.]/g, ""));
      return {
        price: numericPrice,
      };
    });
  
    console.log("Minimal data for ETH purchase:", minimalData);
  
    try {
      const response = await fetch("/api/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: minimalData }),
      });
  
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     console.error("Error response from crypto API:", errorData);
    //     throw new Error(`Crypto buy request failed: ${errorData.message || "Unknown error"}`);
    //   }
  
      const priceInEth = await response.json();
      console.log("Price to pay in ETH:", priceInEth.amountInETH);
  
      const transactionHash = await sendTransaction({
        to: "0x908f755A286690E6a07a90E5Ae1a0ab63A4e7dE4",
        value: priceInEth.amountInETH,
      });

      console.log("Transaction Hash:", transactionHash);
    } catch (error) {
      console.error("Error buying item with ETH:", error);
      setError("Error buying item with ETH. Please try again.");
    }
  };
  
  

  const handlePlaceAnotherOrder = () => {
    setTranscript("")
    setParsedIntent(null)
    setRecommendations(null)
    setPurchasedItem(null)
    setError(null)
    setMessages([])
  }

  const PurchaseConfirmation = ({ item }: { item: any }) => {
    return (
      <Card className="max-w-2xl mx-auto bg-gray-800 text-white shadow-lg border-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Check className="text-purple-500" />
            Purchase Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your item has been successfully purchased and will be arriving at your address soon.</p>
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2 text-purple-400">Purchase Details:</h3>
            <p>Item: {item?.title || "Item details not available."}</p>
            <p>Total Cost: {item?.price?.displayValue || "Cost not available."}</p>
            <Image
              src={item?.images[0]?.url || "/placeholder.svg"}
              alt={item?.title || "Product Image"}
              className="w-full h-48 object-contain bg-gray-600 mb-4 rounded-lg"
              width={500}
              height={300}
            />
          </div>
          <Button onClick={handlePlaceAnotherOrder} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
            Place Another Order
          </Button>
        </CardContent>
      </Card>
    )
  }

  const ProductRecommendations = ({ recommendations }: { recommendations: Product[] }) => {
    const seenAsins = new Set(); // To track seen ASINs

    return (
      <div className="grid gap-6 md:grid-cols-2">
          {recommendations.length > 0 ? (
              recommendations.map((product) => {
              console.log(recommendations)
              const key = product.ASIN; // Create a unique key
              if (seenAsins.has(key)) {
                console.warn(`Duplicate ASIN detected: ${key}`);
                return null; // Skip rendering this product
              } else {
                seenAsins.add(key); // Add to seen ASINs
              }

              return (
                  <Card key={product.ASIN} className="flex flex-col h-full bg-gray-800 text-white shadow-lg border-purple-500">
                    <CardHeader className="flex-none">
                      <CardTitle className="line-clamp-2 h-12 text-purple-400">{product.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex-none">
                        <Image
                          src={product.images[0]?.url || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-48 object-contain bg-gray-700 rounded-lg"
                          width={500}
                          height={300}
                        />
                      </div>
                      <p className="text-sm text-gray-300 mt-2 line-clamp-2 flex-1">{product.description}</p>
                      <p className="text-lg text-purple-400 mt-2">Price: {product.price.displayValue}</p>
                      <div className="flex justify-between mt-4">
                        <div className="flex justify-between w-full">
                          <Button
                            className="w-[48%] bg-purple-500 hover:bg-purple-600 text-white"
                            onClick={() => handleBuyNow(product.ASIN || product.id)}
                          >
                            <DollarSign className="mr-2 h-4 w-4" />
                            Buy USD
                          </Button>
                          <Button
                            className="w-[48%] bg-indigo-500 hover:bg-indigo-600 text-white"
                            onClick={() => handleBuyETH([product])}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Buy ETH
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              );
            })) : (
            <p className="text-center text-gray-400">No products found or an error occurred.</p>
          )}
      </div>
  )
}

  return (
    <main className="container mx-auto p-4 text-white min-h-screen">
      <div className="flex justify-start items-center w-1/2">
        <h1 className="text-4xl font-bold mb-8 text-left text-purple-400">
          <DollarSign className="inline-block mr-2 text-purple-500" />
          ShopBlocks: Blockchain Shopping Assistant
        </h1>
      </div>
      {purchasedItem ? (
        <PurchaseConfirmation item={purchasedItem} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card className="mb-8 bg-gray-800 shadow-lg border-purple-500">
              <CardHeader>
                <CardTitle className="text-purple-400">Voice Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <Button
                    onClick={isRecording ? () => {} : startRecording}
                    disabled={isRecording}
                    size="lg"
                    className={`w-16 h-16 rounded-full ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"}`}
                  >
                    {isRecording ? <StopCircle className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                </div>
                <Card className="mb-4 bg-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-400">
                      <span className="mr-2">Transcript</span>
                      {transcript && (
                        <Badge variant="secondary" className="bg-purple-200 text-purple-700">
                          Recorded
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      {transcript || "No transcript available. Start recording to see the transcript."}
                    </p>
                  </CardContent>
                </Card>
                <Button
                  onClick={processTranscript}
                  disabled={!transcript || isProcessing}
                  size="lg"
                  className="w-full bg-indigo-500 hover:bg-indigo-600"
                >
                  {isProcessing ? (
                    <>
                      <span className="mr-2">Processing...</span>
                      <Progress value={progress} className="w-[100px]" />
                    </>
                  ) : (
                    "Process Transcript"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 shadow-lg border-purple-500">
              <CardHeader>
                <CardTitle className="text-purple-400">Chat with ShopBlocks Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border border-gray-600 p-4 bg-gray-700">
                  {messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <div key={index} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                        <Badge
                          variant={msg.role === "user" ? "secondary" : "default"}
                          className={`mb-2 ${msg.role === "user" ? "bg-indigo-200 text-indigo-700" : "bg-purple-200 text-purple-700"}`}
                        >
                          {msg.role === "user" ? "You" : "AI"}
                        </Badge>
                        <p
                          className={`p-3 rounded-lg inline-block max-w-[80%] shadow-sm ${msg.role === "user" ? "bg-indigo-900" : "bg-purple-900"}`}
                        >
                          {msg.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400">Start the conversation with the ShopBlocks assistant!</p>
                  )}
                </ScrollArea>
                <div className="flex mt-4">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-grow p-2 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700 text-white"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />
                  <Button
                    onClick={processTranscript}
                    disabled={!transcript || isProcessing}
                    className="rounded-l-none bg-purple-500 hover:bg-purple-600 h-10.5"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {error && (
              <Alert variant="destructive" className="mb-8 bg-red-900 border-red-500">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertTitle className="text-red-400">Error</AlertTitle>
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}
            {recommendations && (
              <div className="mt--2 flex justify-end">
                <div className="w-full">
                  {/* <h2 className="text-3xl font-bold mb-4 mt--12 text-center text-purple-400">Product Recommendations</h2> */}
                  <ProductRecommendations recommendations={recommendations} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

