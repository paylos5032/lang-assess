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
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
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

    const nextLink = window.location.origin + "/welcome?id=" + id;
    setLink(nextLink);
    setReady(true);
    setCopied(false);
    setError("");
  }

  function copyLink() {
    navigator.clipboard.writeText(link);
    setCopied(true);
  }

  function generateTexts() {
    const firm = company || "the company";
    const role = position || "this role";
    setText1(
      "Hello, I am interested in the " +
        role +
        " role at " +
        firm +
        ". I sent a question yesterday and I am still waiting for an answer."
    );
    setText2(
      "Please tell the customer that " +
        firm +
        " received the request. Someone from the " +
        role +
        " team will call tomorrow."
    );
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
          <div className="mt-6">
            <p className="break-all text-black">{link}</p>
            <button
              onClick={copyLink}
              className="mt-3 text-sm text-black underline"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}