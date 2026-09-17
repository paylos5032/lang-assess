"use client";

import { useState } from "react";

export default function Welcome() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function continueCheck(event: React.MouseEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      window.alert("Please type your name and email.");
      return;
    }
    localStorage.setItem("candidate", name.trim());
    localStorage.setItem("email", email.trim());
    window.location.href = "/check";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-black">Before you start</h1>
        <p className="mt-4 text-gray-600">
          Stay on this page. The test is timed. You cannot go back after you
          submit.
        </p>
        <input
          className="mt-6 w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-black"
          placeholder="Your full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-black"
          placeholder="Your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <a
          href="/check"
          onClick={continueCheck}
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-white"
        >
          I understand
        </a>
        <button
          onClick={() => setOpen(true)}
          className="mt-10 block w-full text-sm text-gray-500"
        >
          If something does not work, contact support.
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="max-w-sm rounded-2xl bg-white p-6 text-center">
            <h2 className="text-xl font-semibold text-black">Contact support</h2>
            <p className="mt-3 text-gray-600">
              Something did not work. Email support and mention this page:
              /welcome
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-6 rounded-full bg-black px-6 py-3 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}