"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function NewAssessment() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [language, setLanguage] = useState("German");
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [minutes, setMinutes] = useState("12");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState("");
  const [candidateLink, setCandidateLink] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [error, setError] = useState("");

  async function createLink() {
    const id = Math.random().toString(36).slice(2, 10);
    const { error: saveError } = await supabase.from("assessments").insert({
      id,
      company,
      position,
      language,
      minutes,
      source1: text1,
      source2: text2,
    });

    if (saveError) {
      setError(saveError.message);
      return;
    }

    const origin = window.location.origin;
    setCandidateLink(origin + "/welcome?id=" + id);
    setReportLink(origin + "/report?id=" + id);
    setReady(true);
    setCopied("");
    setError("");
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
  }

  function generateTexts() {
    const options1 = [
      "Hello, I placed an order last Friday and paid by card. The tracking page still says preparing. I need the parcel before Tuesday because I am travelling. Please tell me if it has left the warehouse and what I should do if it does not arrive in time.",
      "Hi, I received the wrong size and the return label in the box does not work. I already wrote twice and nobody answered. I want a prepaid return and a replacement sent as soon as you confirm this email.",
      "Good morning, my package was marked delivered yesterday but nothing was at the door. The neighbour did not take it. Please open an investigation and tell me how long a refund or reshipment will take.",
    ];
    const options2 = [
      "Please write to the customer that we checked the order. A new label will be sent today. If the parcel is not scanned in 48 hours, we will refund the payment without another request.",
      "Please apologise for the delay and explain that the item is back in stock. Offer a prepaid return and a replacement, and ask the customer to confirm the delivery address in one reply.",
      "Please tell the customer we opened a delivery investigation. They will get an update within one working day. Until then they should not order the same item again.",
    ];
    setText1(options1[Math.floor(Math.random() * options1.length)]);
    setText2(options2[Math.floor(Math.random() * options2.length)]);
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold text-black">New assessment</h1>

        <label className="mt-8 block text-sm text-black">Company</label>
        <input
          className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />

        <label className="mt-6 block text-sm text-black">Position</label>
        <input
          className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
        />

        <label className="mt-6 block text-sm text-black">Language to assess</label>
        <select
          className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          <option>German</option>
          <option>French</option>
          <option>Italian</option>
          <option>Spanish</option>
          <option>Greek</option>
        </select>

        <label className="mt-6 block text-sm text-black">Minutes per task</label>
        <select
          className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={minutes}
          onChange={(event) => setMinutes(event.target.value)}
        >
          <option value="8">8</option>
          <option value="12">12</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>

        <button
          onClick={generateTexts}
          className="mt-8 rounded-full border border-black px-6 py-3 text-black"
        >
          Generate texts
        </button>

        <label className="mt-6 block text-sm text-black">Text 1</label>
        <textarea
          className="mt-2 h-28 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={text1}
          onChange={(event) => setText1(event.target.value)}
        />

        <label className="mt-6 block text-sm text-black">Text 2</label>
        <textarea
          className="mt-2 h-28 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={text2}
          onChange={(event) => setText2(event.target.value)}
        />

        <button
          onClick={createLink}
          className="mt-8 rounded-full bg-black px-6 py-3 text-white"
        >
          Create link
        </button>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {ready && (
          <div className="mt-6 text-black">
            <p>Candidate link</p>
            <p className="break-all">{candidateLink}</p>
            <button
              onClick={() => copy(candidateLink, "candidate")}
              className="mt-2 text-sm underline"
            >
              {copied === "candidate" ? "Copied" : "Copy candidate link"}
            </button>
            <p className="mt-6">Company report</p>
            <p className="break-all">{reportLink}</p>
            <button
              onClick={() => copy(reportLink, "report")}
              className="mt-2 text-sm underline"
            >
              {copied === "report" ? "Copied" : "Copy report link"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}