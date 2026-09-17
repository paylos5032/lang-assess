"use client";

import { useEffect, useState } from "react";

export default function TaskTwo() {
  const [seconds, setSeconds] = useState(12 * 60);
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [position, setPosition] = useState("");
  const [language, setLanguage] = useState("German");
  const [leftTab, setLeftTab] = useState(false);

  useEffect(() => {
    setSource(localStorage.getItem("source2") || "No text was set.");
    setPosition(localStorage.getItem("position") || "");
    setLanguage(localStorage.getItem("language") || "German");
    const minutes = Number(localStorage.getItem("minutes") || "12");
    setSeconds(minutes * 60);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function onHide() {
      if (document.hidden) {
        setLeftTab(true);
        localStorage.setItem("leftTab2", "yes");
      }
    }
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      localStorage.setItem("task2", text);
      window.location.href = "/done";
    }
  }, [seconds, text]);

  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  const time = `${minutes}:${rest.toString().padStart(2, "0")}`;

  function goNext(event: React.MouseEvent) {
    event.preventDefault();
    if (!window.confirm("Submit Task 2? You cannot go back.")) return;
    localStorage.setItem("task2", text);
    window.location.href = "/done";
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-4xl">
        {leftTab && (
          <p className="mb-4 text-sm text-red-600">
            You left this page. This will be noted in the report.
          </p>
        )}
        {seconds > 0 && seconds <= 60 && (
          <p className="mb-4 text-sm text-red-600">Less than 1 minute left.</p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Task 2 of 2{position ? ` · ${position}` : ""}
          </p>
          <p className="text-lg font-medium text-black">{time}</p>
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-black">
          Translate into {language}
        </h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div
            className="rounded-xl border border-gray-200 p-4 text-black select-none"
            onCopy={(event) => event.preventDefault()}
            onCut={(event) => event.preventDefault()}
            onContextMenu={(event) => event.preventDefault()}
          >
            {source}
          </div>
          <textarea
            className="h-48 rounded-xl border border-gray-300 p-4 text-black"
            placeholder={`Type your ${language} translation here`}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onPaste={(event) => event.preventDefault()}
          />
        </div>
        <a
          href="/done"
          onClick={goNext}
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-white"
        >
          Done
        </a>
      </div>
    </main>
  );
}