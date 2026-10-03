"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isRecording, startRecording } from "../lib/recording";

export default function Check() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [typed, setTyped] = useState("");
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("id") || "";
    setId(value);
    if (value) localStorage.setItem("testid", value);
  }, []);

  async function begin() {
    setError("");
    try {
      await startRecording();
      setStarted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start recording");
    }
  }

  function nextPage() {
    if (!started && !isRecording()) {
      setError("Start the recording first.");
      return;
    }
    router.push(id ? "/mock?id=" + id : "/mock");
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold text-black">Device check</h1>
        <p className="mt-3 text-gray-600">
          Allow the camera and share the entire screen. Recording stays on
          until the last task is finished. Do not refresh the page.
        </p>
        <button
          onClick={begin}
          className="mt-6 rounded-full bg-black px-6 py-3 text-white"
        >
          {started ? "Recording" : "Start recording"}
        </button>
        <input
          className="mt-6 w-full rounded-xl border border-gray-300 p-3 text-black"
          placeholder="Type hello"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
        />
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <button
          onClick={nextPage}
          className="mt-8 rounded-full bg-black px-6 py-3 text-white"
        >
          Continue
        </button>
      </div>
    </main>
  );
}