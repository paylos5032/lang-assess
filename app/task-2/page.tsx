"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { stopAndSave } from "../lib/recording";

export default function TaskTwo() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [source, setSource] = useState("");
  const [language, setLanguage] = useState("");
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(12 * 60);
  const [loaded, setLoaded] = useState(false);
  const [warned, setWarned] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("id") || "";
    setId(value);
    if (value) localStorage.setItem("testid", value);

    async function load() {
      if (!value) {
        setLoaded(true);
        return;
      }
      const { data } = await supabase
        .from("assessments")
        .select("source2, minutes, language")
        .eq("id", value)
        .single();
      if (data?.source2) setSource(data.source2);
      if (data?.language) setLanguage(data.language);
      if (data?.minutes) setSeconds(Number(data.minutes) * 60);
      setLoaded(true);
    }
    load();
  }, []);

  useEffect(() => {
    function onHide() {
      if (document.hidden && id) {
        supabase.from("assessments").update({ left_tab2: "yes" }).eq("id", id);
        if (!warned) {
          setWarned(true);
          window.alert("You left the page. This is recorded.");
        }
      }
    }
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [id, warned]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds === 0 && id) finish();
  }, [seconds]);

  async function finish() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (id) {
        await supabase.from("assessments").update({ task2: answer }).eq("id", id);
        await stopAndSave(id);
      }
      router.push(id ? "/done?id=" + id : "/done");
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Could not save the video");
    }
  }

  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold text-black">Translation 2</h1>
        <p className="mt-2 text-black">
          Translate this English text into {language || "the assessed language"}.
        </p>
        <p className="mt-2 text-black">
          {minutes}:{rest.toString().padStart(2, "0")}
        </p>
        <p className="mt-6 select-none text-black">
          {!loaded
            ? "Loading text..."
            : source || "No text was saved for this test. Create a new link."}
        </p>
        <textarea
          className="mt-6 h-40 w-full rounded-xl border border-gray-300 p-3 text-black"
          placeholder="Write the translation here"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onPaste={(event) => event.preventDefault()}
        />
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <button
          onClick={finish}
          className="mt-8 rounded-full bg-black px-6 py-3 text-white"
        >
          {busy ? "Saving videos..." : "Done"}
        </button>
      </div>
    </main>
  );
}