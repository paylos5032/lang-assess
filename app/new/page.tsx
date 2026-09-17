"use client";

import { useState } from "react";

export default function NewAssessment() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [language, setLanguage] = useState("German");
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [minutes, setMinutes] = useState("12");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  function createLink() {
    localStorage.setItem("company", company);
    localStorage.setItem("position", position);
    localStorage.setItem("language", language);
    localStorage.setItem("source1", text1);
    localStorage.setItem("source2", text2);
    localStorage.setItem("minutes", minutes);
    localStorage.removeItem("task1");
    localStorage.removeItem("task2");
    localStorage.removeItem("leftTab1");
    localStorage.removeItem("leftTab2");
    localStorage.removeItem("candidate");
    localStorage.removeItem("email");
    localStorage.removeItem("emailReply");
    localStorage.removeItem("chatLog");
    setReady(true);
    setCopied(false);
  }

  function copyLink() {
    navigator.clipboard.writeText("http://localhost:3000/welcome");
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
        <p className="mt-2 text-gray-600">
          Fill the company details, then generate or paste the two texts.
        </p>

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

        <label className="mt-6 block text-sm text-black">Text 1 (into English)</label>
        <textarea
          className="mt-2 h-28 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={text1}
          onChange={(event) => setText1(event.target.value)}
        />

        <label className="mt-6 block text-sm text-black">
          Text 2 (into the assessed language)
        </label>
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

        {ready && (
          <div className="mt-6">
            <p className="text-black">
              Link for the candidate:{" "}
              <a className="underline" href="/welcome">
                http://localhost:3000/welcome
              </a>
            </p>
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