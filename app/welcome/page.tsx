"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const SUPPORT_EMAIL = "you@email.com";

export default function Welcome() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [language, setLanguage] = useState("");
  const [minutes, setMinutes] = useState("");
  const [error, setError] = useState("");
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("id") || "";
    setId(value);
    if (value) localStorage.setItem("testid", value);

    async function load() {
      if (!value) return;
      const { data } = await supabase
        .from("assessments")
        .select("company, position, language, minutes")
        .eq("id", value)
        .single();
      if (data?.company) setCompany(data.company);
      if (data?.position) setPosition(data.position);
      if (data?.language) setLanguage(data.language);
      if (data?.minutes) setMinutes(data.minutes);
    }
    load();
  }, []);

  async function start() {
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (id) {
      const { error: saveError } = await supabase
        .from("assessments")
        .update({ candidate: name, email })
        .eq("id", id);
      if (saveError) {
        setError(saveError.message);
        setHelp(true);
        return;
      }
    }
    localStorage.setItem("candidate", name);
    localStorage.setItem("email", email);
    window.location.href = id ? "/check?id=" + id : "/check";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-black">Before you start</h1>
        <p className="mt-4 text-black">
          {company || "Company"} / {position || "Position"} / {language || "Language"}
        </p>
        <p className="mt-2 text-black">
          Each translation has {minutes || "12"} minutes.
        </p>
        <p className="mt-4 text-gray-600">
          Stay on this page. The translation tasks are timed. You cannot go
          back after you submit.
        </p>
        <ol className="mt-6 text-left text-black">
          <li>1. Camera and screen check</li>
          <li>2. One practice sentence</li>
          <li>3. Reply to a customer email</li>
          <li>4. Chat with an unhappy customer</li>
          <li>5. Two timed translations</li>
        </ol>
        <input
          className="mt-6 w-full rounded-xl border border-gray-300 p-3 text-black"
          placeholder="Your full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          className="mt-3 w-full rounded-xl border border-gray-300 p-3 text-black"
          placeholder="Your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          onClick={start}
          className="mt-6 rounded-full bg-black px-6 py-3 text-white"
        >
          I understand
        </button>
        <button
          onClick={() => setHelp(true)}
          className="mt-6 block w-full text-sm text-gray-500 underline"
        >
          If something does not work, contact support.
        </button>
      </div>

      {help && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center text-black">
            <h2 className="text-xl font-semibold">Contact support</h2>
            <p className="mt-3 text-sm text-gray-600">
              Email {SUPPORT_EMAIL} and include this reference: {id || "no id"}
            </p>
            <button
              onClick={() => setHelp(false)}
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