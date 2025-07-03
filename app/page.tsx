//import { useState } from 'react';
import { use client } from 'react';
import axios from 'axios';

export default function Home() {
  const [message, setMessage] = use client('');
  const [response, setResponse] = use client('');
  const [loading, setLoading] = use client(false);
  const [error, setError] = use client('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const flowiseApiUrl = process.env.NEXT_PUBLIC_FLOWISE_API_ENDPOINT;

      if (!flowiseApiUrl) {
        throw new Error('Flowise API Endpoint is not defined in environment variables.');
      }

      const data = { question: message };

      const res = await axios.post(flowiseApiUrl, data);
      console.log('Flowise API response:', res.data);

      if (res.status !== 200) {
        throw new Error(`Flowise API returned status code: ${res.status}`);
      }

      const botReply = res.data.text || res.data.response || 'No response text';
      setResponse(botReply);
      setMessage(''); // Clear only after success
    } catch (err) {
      console.error('Error calling Flowise API:', err);
      setError(err.message || 'An unexpected error occurred.');
      setResponse('');
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
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {response && (
        <div>
          <h2>Bot Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
