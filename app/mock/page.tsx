"use client";

import { useEffect, useState } from "react";

export default function Mock() {
  const [id, setId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("id") || "";
    setId(value);
    if (value) localStorage.setItem("testid", value);
  }, []);

  function nextPage() {
    window.location.href = id ? "/soft?id=" + id : "/soft";
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold text-black">Practice</h1>
        <p className="mt-3 text-gray-600">
          This is a dummy sentence. It is not scored.
        </p>
        <p className="mt-6 text-black">The weather is nice today.</p>
        <textarea
          className="mt-4 h-28 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Translate here"
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