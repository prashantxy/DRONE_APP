"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/card";
import { Send, Bot, User, Sparkles, Loader2, Square } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ Gemini API key is missing. Make sure it's set in .env.local.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

interface TypeWriterProps {
  text: string;
  onComplete?: () => void;
  stop?: boolean;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, onComplete, stop }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (stop) {
      setDisplayText(text);
      setCurrentIndex(text.length);
      if (onComplete) onComplete();
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete, stop]);

  return <div className="whitespace-pre-wrap">{displayText}</div>;
};

interface Message {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

export default function ChatBotRoute() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stopTyping, setStopTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStop = () => {
    setStopTyping(true);
    setIsGenerating(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isGenerating) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setIsGenerating(true);
    setStopTyping(false);

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      if (!genAI) throw new Error("Gemini API key is missing.");

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const formattedHistory = [
        { role: "user", parts: [{ text: userMessage }] },
        ...messages
          .filter((msg) => msg.role === "user")
          .map((msg) => ({ role: msg.role, parts: [{ text: msg.content }] })),
      ];

      const chat = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(userMessage);
      const text = await result.response.text();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: text, isTyping: true },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I encountered an error. Please try again.",
          isTyping: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypingComplete = (index: number) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, isTyping: false } : msg
      )
    );
    setIsGenerating(false);
    setStopTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            ChatBot Assistant
          </h1>
          <p className="mt-4 text-gray-400">
            Powered by advanced AI to help you communicate effectively
          </p>
        </div>

        <Card className="bg-blue-500 rounded-xl shadow-sm p-4 mb-4 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${message.role === "user" ? "bg-[#FF7B5F]/10" : "bg-blue-100"}`}
                >
                  {message.role === "user" ? (
                    <User className="h-5 w-5 text-[#FF7B5F]" />
                  ) : (
                    <Bot className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-[#FF7B5F] text-white" : "bg-gray-100 text-gray-800"}`}
                >
                  {message.role === "assistant" && message.isTyping ? (
                    <TypeWriter
                      text={message.content}
                      onComplete={() => handleTypingComplete(index)}
                      stop={stopTyping}
                    />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                  <Bot className="h-5 w-5 text-blue-500" />
                </div>
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t pt-4 px-4">
            <div className="flex gap-2">
              <textarea
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={handleKeyPress}
  placeholder="Type your message..."
  rows={1}
  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7B5F] resize-none text-black"
  disabled={isLoading || isGenerating}
/>

              {isGenerating ? (
                <Button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 text-black"
              >
                <Square className="h-4 w-4" />
              </Button>
              ) : (
              <Button
                onClick={handleSend}
                className="bg-[#FF7B5F] hover:bg-[#FF6B4F] text-black"
                disabled={isLoading || !input.trim() || isGenerating}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>   
              )}
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { icon: <Sparkles className="h-6 w-6 text-[#FF7B5F]" />, title: "AI Powered", desc: "Advanced language model for natural conversations" },
            { icon: <Bot className="h-6 w-6 text-[#FF7B5F]" />, title: "24/7 Available", desc: "Always ready to assist you with your queries" },
            { icon: <User className="h-6 w-6 text-[#FF7B5F]" />, title: "Personalized", desc: "Tailored responses based on your communication needs" },
          ].map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="w-12 h-12 bg-[#FF7B5F]/10 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
