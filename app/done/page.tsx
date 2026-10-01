"use client";

import { useEffect, useState } from "react";

export default function Done() {
  const [id, setId] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("id") || "";
    setId(value);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-black">Thank you</h1>
        <p className="mt-4 text-gray-600">
          Your assessment is finished. You can close this page. The company
          will review your answers.
        </p>
        {id && <p className="mt-6 text-sm text-gray-400">Reference: {id}</p>}
      </div>
    </main>
  );
}