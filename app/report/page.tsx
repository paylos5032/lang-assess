"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Row = {
  id: string;
  company: string;
  position: string;
  language: string;
  candidate: string;
  email: string;
  email_reply: string;
  chat_log: string;
  source1: string;
  source2: string;
  task1: string;
  task2: string;
  left_tab1: string;
  left_tab2: string;
};

export default function Report() {
  const [id, setId] = useState("");
  const [row, setRow] = useState<Row | null>(null);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("id") || "";
    setId(value);
    async function load() {
      if (!value) return;
      const { data } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", value)
        .single();
      if (data) setRow(data as Row);
    }
    load();
  }, []);

  function points(answer: string, source: string) {
    if (!answer || !answer.trim()) return 0;
    if (!source || !source.trim()) return 10;
    const ratio = answer.trim().length / source.trim().length;
    if (ratio < 0.3) return 4;
    if (ratio < 0.6) return 7;
    return 10;
  }

  if (!id) {
    return (
      <main className="min-h-screen bg-white p-8 text-black">
        Add ?id= to the report link.
      </main>
    );
  }

  if (!row) {
    return (
      <main className="min-h-screen bg-white p-8 text-black">Loading...</main>
    );
  }

  const emailScore = row.email_reply && row.email_reply.trim().length > 40 ? 10 : 4;
  const chatScore = row.chat_log && row.chat_log.includes("You:") ? 10 : 0;
  const task1Score = points(row.task1, row.source1);
  const task2Score = points(row.task2, row.source2);
  let total = emailScore + chatScore + task1Score + task2Score;
  if (row.left_tab1 === "yes") total -= 5;
  if (row.left_tab2 === "yes") total -= 5;
  if (total < 0) total = 0;

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl text-black">
        <h1 className="text-3xl font-semibold">Company report</h1>
        <p className="mt-6 text-2xl font-semibold">Score: {total} / 40</p>
        <p className="mt-2 text-sm text-gray-600">
          First check only. It looks at length and whether they left the page.
          It does not judge language quality yet.
        </p>
        <p className="mt-6">Candidate: {row.candidate || "-"}</p>
        <p>Email: {row.email || "-"}</p>
        <p>Company: {row.company || "-"}</p>
        <p>Position: {row.position || "-"}</p>
        <p>Language: {row.language || "-"}</p>
        <p className="mt-6">Left Task 1 tab: {row.left_tab1 || "No"}</p>
        <p>Left Task 2 tab: {row.left_tab2 || "No"}</p>
        <h2 className="mt-8 font-semibold">Email reply ({emailScore}/10)</h2>
        <p className="mt-2 whitespace-pre-wrap">{row.email_reply || "-"}</p>
        <h2 className="mt-8 font-semibold">Chat ({chatScore}/10)</h2>
        <p className="mt-2 whitespace-pre-wrap">{row.chat_log || "-"}</p>
        <h2 className="mt-8 font-semibold">Task 1 source</h2>
        <p className="mt-2">{row.source1 || "-"}</p>
        <h2 className="mt-4 font-semibold">Task 1 answer ({task1Score}/10)</h2>
        <p className="mt-2 whitespace-pre-wrap">{row.task1 || "-"}</p>
        <h2 className="mt-8 font-semibold">Task 2 source</h2>
        <p className="mt-2">{row.source2 || "-"}</p>
        <h2 className="mt-4 font-semibold">Task 2 answer ({task2Score}/10)</h2>
        <p className="mt-2 whitespace-pre-wrap">{row.task2 || "-"}</p>
      </div>
    </main>
  );
}