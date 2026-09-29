"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Soft() {
  const [id, setId] = useState("");
  const [reply, setReply] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("id") || "";
    setId(value);
    if (value) localStorage.setItem("testid", value);
  }, []);

  async function nextPage() {
    if (id) {
      await supabase
        .from("assessments")
        .update({ email_reply: reply })
        .eq("id", id);
    }
    window.location.href = id ? "/chat?id=" + id : "/chat";
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold text-black">Customer email</h1>
        <p className="mt-3 text-gray-600">
          Write the reply you would send. Do not copy. This is not timed.
        </p>
        <div className="mt-6 rounded-xl border border-gray-200 p-4 text-black">
          Subject: Still waiting for my order
          <br />
          <br />
          Hello,
          <br />
          I ordered 5 days ago and nobody has answered me. This is the third
          email. I want a refund today or I will leave a public complaint.
          <br />
          <br />
          Anna
        </div>
        <textarea
          className="mt-6 h-36 w-full rounded-xl border border-gray-300 p-3 text-black"
          placeholder="Write your email reply here"
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          onPaste={(event) => event.preventDefault()}
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