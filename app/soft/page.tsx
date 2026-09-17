"use client";

import { useState } from "react";

export default function Soft() {
  const [reply, setReply] = useState("");

  function save(event: React.MouseEvent) {
    event.preventDefault();
    if (!reply.trim()) {
      window.alert("Please write a reply.");
      return;
    }
    localStorage.setItem("emailReply", reply.trim());
    window.location.href = "/chat";
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-black">Customer email</h1>
        <p className="mt-3 text-gray-600">
          Write the reply you would send. Do not copy. This is not timed.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 p-4 text-black select-none">
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

        <label className="mt-6 block text-sm text-black">Your reply</label>
        <textarea
          className="mt-2 h-48 w-full rounded-xl border border-gray-300 p-4 text-black"
          placeholder="Write your email reply here"
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          onPaste={(event) => event.preventDefault()}
        />

        <a
          href="/chat"
          onClick={save}
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-white"
        >
          Continue
        </a>
      </div>
    </main>
  );
}