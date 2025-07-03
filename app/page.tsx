"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  console.log("Flowise API URL:", process.env.NEXT_PUBLIC_FLOWISE_API_ENDPOINT);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
      
    console.log("Flowise API URL inside handleSubmit:", process.env.NEXT_PUBLIC_FLOWISE_API_ENDPOINT);

    try {
      const flowiseApiUrl = process.env.NEXT_PUBLIC_FLOWISE_API_ENDPOINT;

      if (!flowiseApiUrl) {
        throw new Error("Flowise API Endpoint is not defined in env.");
      }

      const res = await axios.post(flowiseApiUrl, { question: message });
      console.log(res.data);

      setResponse(res.data.text || "No response");
      setMessage("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Flowise Chatbot UI</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {response && (
        <div>
          <h2>Bot Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
