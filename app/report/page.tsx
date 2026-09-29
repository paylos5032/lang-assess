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

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl text-black">
        <h1 className="text-3xl font-semibold">Company report</h1>
        <p className="mt-6">Candidate: {row.candidate || "-"}</p>
        <p>Email: {row.email || "-"}</p>
        <p>Company: {row.company || "-"}</p>
        <p>Position: {row.position || "-"}</p>
        <p>Language: {row.language || "-"}</p>
        <p className="mt-6">Left Task 1 tab: {row.left_tab1 || "No"}</p>
        <p>Left Task 2 tab: {row.left_tab2 || "No"}</p>
        <h2 className="mt-8 font-semibold">Email reply</h2>
        <p className="mt-2 whitespace-pre-wrap">{row.email_reply || "-"}</p>
        <h2 className="mt-8 font-semibold">Chat</h2>
        <p className="mt-2 whitespace-pre-wrap">{row.chat_log || "-"}</p>
        <h2 className="mt-8 font-semibold">Task 1 source</h2>
        <p className="mt-2">{row.source1 || "-"}</p>
        <h2 className="mt-4 font-semibold">Task 1 answer</h2>
        <p className="mt-2 whitespace-pre-wrap">{row.task1 || "-"}</p>
        <h2 className="mt-8 font-semibold">Task 2 source</h2>
        <p className="mt-2">{row.source2 || "-"}</p>
        <h2 className="mt-4 font-semibold">Task 2 answer</h2>
        <p className="mt-2 whitespace-pre-wrap">{row.task2 || "-"}</p>
      </div>
    </main>
  );
}