"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Row = {
  id: string;
  company: string;
  position: string;
  candidate: string;
  email: string;
  created_at: string;
};

export default function Tests() {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("assessments")
        .select("id, company, position, candidate, email, created_at")
        .order("created_at", { ascending: false });
      if (data) setRows(data as Row[]);
    }
    load();
  }, []);

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
    return text.includes(query.toLowerCase().trim());
  });

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl text-black">
        <h1 className="text-3xl font-semibold">All tests</h1>
        <input
          className="mt-6 w-full rounded-xl border border-gray-300 p-3 text-black"
          placeholder="Search by name, email, or company"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p className="mt-3 text-gray-600">Newest first.</p>
        {shown.length === 0 && <p className="mt-6">No tests found.</p>}
        {shown.map((row) => (
          <div key={row.id} className="mt-6 border-t border-gray-200 pt-4">
            <p>{row.candidate || "No name yet"}</p>
            <p className="text-sm text-gray-600">{formatDate(row.created_at)}</p>
            <p className="text-sm text-gray-600">
              {row.company || "-"} / {row.position || "-"}
            </p>
            <a className="mt-2 inline-block underline" href={"/report?id=" + row.id}>
              Open report
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}