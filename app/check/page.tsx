"use client";

import { useRef, useState } from "react";

export default function Check() {
  const cameraRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [typed, setTyped] = useState("");

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
      setCameraOn(true);
      setError("");
    } catch {
      setError("Camera did not start. Allow camera and try again.");
    }
  }

  async function startScreen() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const track = stream.getVideoTracks()[0];
      track.onended = () => {
        setScreenOn(false);
        setError("Screen share stopped. Share your screen again.");
      };
      if (screenRef.current) {
        screenRef.current.srcObject = stream;
      }
      setScreenOn(true);
      setError("");
    } catch {
      setError("Screen share did not start. Choose the entire screen.");
    }
  }

  const ready = cameraOn && screenOn && typed.trim().toLowerCase() === "hello";

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-black">Quick check</h1>
        <p className="mt-4 text-gray-600">
          Turn on camera, share your entire screen, and type the word below.
        </p>
        <video
          ref={cameraRef}
          autoPlay
          playsInline
          className="mt-6 h-32 w-full rounded-xl bg-black object-cover"
        />
        <button onClick={startCamera} className="mt-2 text-sm text-black underline">
          Turn on camera
        </button>
        <video
          ref={screenRef}
          autoPlay
          playsInline
          className="mt-6 h-32 w-full rounded-xl bg-black object-cover"
        />
        <button onClick={startScreen} className="mt-2 text-sm text-black underline">
          Share screen
        </button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <p className="mt-6 font-medium text-black">hello</p>
        <input
          className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-black"
          placeholder="Type here"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
        />
        {ready ? (
          <a
            href="/mock"
            className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-white"
          >
            Looks good
          </a>
        ) : (
          <p className="mt-8 text-sm text-gray-500">
            Camera, entire screen, and the word hello are required.
          </p>
        )}
      </div>
    </main>
  );
}