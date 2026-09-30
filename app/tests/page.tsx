"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Row = {
  id: string;
  company: string;
  position: string;
  candidate: string;
  email: string;
};

export default function Tests() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("assessments")
        .select("id, company, position, candidate, email")
        .order("id");
      if (data) setRows(data as Row[]);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl text-black">
        <h1 className="text-3xl font-semibold">All tests</h1>
        <p className="mt-3 text-gray-600">Open a report for any assessment.</p>
        {rows.length === 0 && <p className="mt-6">No tests yet.</p>}
        {rows.map((row) => (
          <div key={row.id} className="mt-6 border-t border-gray-200 pt-4">
            <p>{row.candidate || "No name yet"}</p>
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