"use client";

import { useEffect, useRef, useState } from "react";

export default function Check() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [id, setId] = useState("");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("id") || "";
    setId(value);
    if (value) localStorage.setItem("testid", value);
  }, []);

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  }

  async function startScreen() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    if (screenRef.current) screenRef.current.srcObject = stream;
  }

  function nextPage() {
    window.location.href = id ? "/mock?id=" + id : "/mock";
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold text-black">Device check</h1>
        <p className="mt-3 text-gray-600">
          Allow camera and share the entire screen. Type hello to test the
          keyboard.
        </p>

        <button
          onClick={startCamera}
          className="mt-6 rounded-full bg-black px-6 py-3 text-white"
        >
          Start camera
        </button>
        <video ref={videoRef} autoPlay muted className="mt-4 w-full rounded-xl" />

        <button
          onClick={startScreen}
          className="mt-6 rounded-full border border-black px-6 py-3 text-black"
        >
          Share screen
        </button>
        <video ref={screenRef} autoPlay muted className="mt-4 w-full rounded-xl" />

        <input
          className="mt-6 w-full rounded-xl border border-gray-300 p-3 text-black"
          placeholder="Type hello"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
        />

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