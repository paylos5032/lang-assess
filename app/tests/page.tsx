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
  created_at: string;
  ai_grade: string;
  task1: string;
  task2: string;
};

function findLine(text: string, label: string) {
  if (!text) return "";
  const line = text
    .split("\n")
    .find((item) => item.toLowerCase().includes(label));
  return line || "";
}

function hire(text: string) {
  const line = findLine(text, "hire recommendation").toLowerCase();
  if (line.includes("strong hire")) return "Strong hire";
  if (line.includes("medium hire")) return "Medium hire";
  if (line.includes("no hire")) return "No hire";
  if (line.includes("hire")) return "Hire";
  return "Not graded";
}

function status(row: Row) {
  if (row.task2 && row.task2.trim()) return "Finished";
  if (row.candidate && row.candidate.trim()) return "In progress";
  return "Not started";
}

export default function Tests() {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [hireFilter, setHireFilter] = useState("All");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("assessments")
      .select(
        "id, company, position, language, candidate, email, created_at, ai_grade, task1, task2"
      )
      .order("created_at", { ascending: false });
    if (data) setRows(data as Row[]);
  }

  async function remove(id: string, name: string) {
    const ok = window.confirm("Delete " + (name || id) + "?");
    if (!ok) return;
    await supabase.from("assessments").delete().eq("id", id);
    load();
  }

  function copyLink(id: string) {
    const link = window.location.origin + "/welcome?id=" + id;
    navigator.clipboard.writeText(link);
    setCopied(id);
  }

  function formatDate(value: string) {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  }

  const shown = rows.filter((row) => {
    const text = (
      (row.candidate || "") +
      " " +
      (row.email || "") +
      " " +
      (row.company || "")
    ).toLowerCase();
    const matchesText = text.includes(query.toLowerCase().trim());
    const matchesStatus = filter === "All" || status(row) === filter;
    const matchesHire = hireFilter === "All" || hire(row.ai_grade) === hireFilter;
    return matchesText && matchesStatus && matchesHire;
  });

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl text-black">
        <h1 className="text-3xl font-semibold">All tests</h1>
        <a
          href="/new"
          className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-sm text-white"
        >
          New assessment
        </a>
        <button
          onClick={load}
          className="ml-3 rounded-full border border-black px-5 py-2 text-sm text-black"
        >
          Refresh
        </button>
        <input
          className="mt-6 w-full rounded-xl border border-gray-300 p-3 text-black"
          placeholder="Search by name, email, or company"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="mt-3 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option>All</option>
          <option>Not started</option>
          <option>In progress</option>
          <option>Finished</option>
        </select>
        <select
          className="mt-3 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={hireFilter}
          onChange={(event) => setHireFilter(event.target.value)}
        >
          <option>All</option>
          <option>Strong hire</option>
          <option>Hire</option>
          <option>Medium hire</option>
          <option>No hire</option>
          <option>Not graded</option>
        </select>
        <p className="mt-3 text-gray-600">Newest first.</p>
        {shown.length === 0 && <p className="mt-6">No tests found.</p>}
        {shown.map((row) => (
          <div key={row.id} className="mt-6 border-t border-gray-200 pt-4">
            <p>{row.candidate || "No name yet"}</p>
            <p className="text-sm text-gray-600">{row.email || "No email yet"}</p>
            <p className="text-sm text-gray-600">{formatDate(row.created_at)}</p>
            <p className="text-sm text-gray-600">
              {row.company || "-"} / {row.position || "-"} / {row.language || "-"}
            </p>
            <p className="mt-1">{status(row)}</p>
            {findLine(row.ai_grade, "soft skills grade") && (
              <p>{findLine(row.ai_grade, "soft skills grade")}</p>
            )}
            {findLine(row.ai_grade, "translation grade") && (
              <p>{findLine(row.ai_grade, "translation grade")}</p>
            )}
            {findLine(row.ai_grade, "hire recommendation") && (
              <p>{findLine(row.ai_grade, "hire recommendation")}</p>
            )}
            <a className="mt-2 inline-block underline" href={"/report?id=" + row.id}>
              Open report
            </a>
            <button
              onClick={() => copyLink(row.id)}
              className="ml-4 text-sm underline"
            >
              {copied === row.id ? "Copied" : "Copy candidate link"}
            </button>
            <button
              onClick={() => remove(row.id, row.candidate)}
              className="ml-4 text-sm text-red-600 underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}