"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Check() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const cameraRecorder = useRef<MediaRecorder | null>(null);
  const screenRecorder = useRef<MediaRecorder | null>(null);
  const cameraChunks = useRef<Blob[]>([]);
  const screenChunks = useRef<Blob[]>([]);
  const [id, setId] = useState("");
  const [typed, setTyped] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("id") || "";
    setId(value);
    if (value) localStorage.setItem("testid", value);
  }, []);

  function startRecorder(
    stream: MediaStream,
    recorderRef: React.MutableRefObject<MediaRecorder | null>,
    chunksRef: React.MutableRefObject<Blob[]>
  ) {
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.start();
    recorderRef.current = recorder;
  }

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
    startRecorder(stream, cameraRecorder, cameraChunks);
  }

  async function startScreen() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    if (screenRef.current) screenRef.current.srcObject = stream;
    startRecorder(stream, screenRecorder, screenChunks);
  }

  function stopRecorder(recorder: MediaRecorder | null) {
    return new Promise<void>((resolve) => {
      if (!recorder || recorder.state === "inactive") {
        resolve();
        return;
      }
      recorder.onstop = () => resolve();
      recorder.stop();
    });
  }

  async function upload(name: string, chunks: Blob[]) {
    const blob = new Blob(chunks, { type: "video/webm" });
    const path = id + "-" + name + ".webm";
    const { error: uploadError } = await supabase.storage
      .from("recordings")
      .upload(path, blob, { contentType: "video/webm", upsert: true });
    if (uploadError) throw new Error(uploadError.message);
    const { data } = supabase.storage.from("recordings").getPublicUrl(path);
    return data.publicUrl;
  }

  async function nextPage() {
    if (!cameraRecorder.current || !screenRecorder.current) {
      setError("Start the camera and share the screen first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await stopRecorder(cameraRecorder.current);
      await stopRecorder(screenRecorder.current);
      const cameraUrl = await upload("camera", cameraChunks.current);
      const screenUrl = await upload("screen", screenChunks.current);
      if (id) {
        await supabase
          .from("assessments")
          .update({ camera_url: cameraUrl, screen_url: screenUrl })
          .eq("id", id);
      }
      window.location.href = id ? "/mock?id=" + id : "/mock";
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold text-black">Device check</h1>
        <p className="mt-3 text-gray-600">
          Allow camera and share the entire screen. Both are recorded for the
          company report. Type hello to test the keyboard.
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

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          onClick={nextPage}
          className="mt-8 rounded-full bg-black px-6 py-3 text-white"
        >
          {busy ? "Saving videos..." : "Continue"}
        </button>
      </div>
    </main>
  );
}