"use client";

import { useEffect, useState } from "react";
import { isRecording } from "../lib/recording";

export default function RecordingBadge() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setOn(isRecording()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!on) return null;

  return (
    <p className="fixed right-4 top-4 rounded-full bg-black px-4 py-2 text-sm text-white">
      Recording
    </p>
  );
}