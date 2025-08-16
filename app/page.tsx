"use client";

import { useState } from "react";

interface Result {
  url?: string;
  status?: number;
  headers?: Record<string, string>;
  body?: string;
  error?: string;
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [userAgent, setUserAgent] = useState("");
  const [referer, setReferer] = useState("");
  const [origin, setOrigin] = useState("");

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          headers: {
            "User-Agent": userAgent,
            Referer: referer,
            Origin: origin,
          },
        }),
      });

      const data: Result = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ error: err.message });
    }

    setLoading(false);
  };

  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Header & Response Checker</h1>

      <div className="flex flex-col gap-3 mb-6 w-[500px]">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (https://...)"
          className="border rounded p-2"
        />
        <input
          type="text"
          value={userAgent}
          onChange={(e) => setUserAgent(e.target.value)}
          placeholder="Custom User-Agent"
          className="border rounded p-2"
        />
        <input
          type="text"
          value={referer}
          onChange={(e) => setReferer(e.target.value)}
          placeholder="Custom Referer"
          className="border rounded p-2"
        />
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Custom Origin"
          className="border rounded p-2"
        />
        <button
          onClick={handleFetch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Fetch
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {result && (
        <div className="mt-4">
          {result.error && <p className="text-red-600">{result.error}</p>}
          {!result.error && (
            <>
              <h2 className="text-lg font-semibold">Status: {result.status}</h2>

              <h3 className="mt-2 font-semibold">Headers</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                {JSON.stringify(result.headers, null, 2)}
              </pre>

              <h3 className="mt-2 font-semibold">Body (first 2000 chars)</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                {result.body}
              </pre>
            </>
          )}
        </div>
      )}
    </main>
  );
}
