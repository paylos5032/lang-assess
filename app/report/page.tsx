"use client";

import { useEffect, useState } from "react";

export default function Report() {
  const [task1, setTask1] = useState("");
  const [task2, setTask2] = useState("");
  const [source1, setSource1] = useState("");
  const [source2, setSource2] = useState("");
  const [position, setPosition] = useState("");
  const [language, setLanguage] = useState("");
  const [company, setCompany] = useState("");
  const [candidate, setCandidate] = useState("");
  const [email, setEmail] = useState("");
  const [emailReply, setEmailReply] = useState("");
  const [chatLog, setChatLog] = useState("");
  const [leftTab1, setLeftTab1] = useState(false);
  const [leftTab2, setLeftTab2] = useState(false);

  useEffect(() => {
    setTask1(localStorage.getItem("task1") || "");
    setTask2(localStorage.getItem("task2") || "");
    setSource1(localStorage.getItem("source1") || "");
    setSource2(localStorage.getItem("source2") || "");
    setPosition(localStorage.getItem("position") || "");
    setLanguage(localStorage.getItem("language") || "");
    setCompany(localStorage.getItem("company") || "");
    setCandidate(localStorage.getItem("candidate") || "");
    setEmail(localStorage.getItem("email") || "");
    setEmailReply(localStorage.getItem("emailReply") || "");
    setChatLog(localStorage.getItem("chatLog") || "");
    setLeftTab1(localStorage.getItem("leftTab1") === "yes");
    setLeftTab2(localStorage.getItem("leftTab2") === "yes");
  }, []);

  function score(text: string) {
    const length = text.trim().length;
    if (length === 0) return "Fail — empty";
    if (length < 20) return "Review — too short";
    return "Pass — text was completed";
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold text-black">Company report</h1>
        {candidate && <p className="mt-4 text-black">Candidate: {candidate}</p>}
        {email && <p className="text-black">Email: {email}</p>}
        {company && <p className="text-black">Company: {company}</p>}
        {position && <p className="text-black">Position: {position}</p>}
        {language && <p className="text-black">Language: {language}</p>}

        <h2 className="mt-8 font-medium text-black">Integrity</h2>
        <p className="mt-2 text-black">
          Left Task 1 tab: {leftTab1 ? "Yes" : "No"}
        </p>
        <p className="text-black">
          Left Task 2 tab: {leftTab2 ? "Yes" : "No"}
        </p>

        <h2 className="mt-8 font-medium text-black">Customer email reply</h2>
        <p className="mt-1 text-sm text-gray-600">{score(emailReply)}</p>
        <p className="mt-2 whitespace-pre-wrap rounded-xl border border-gray-200 p-4 text-black">
          {emailReply || "No reply saved"}
        </p>

        <h2 className="mt-8 font-medium text-black">Angry customer chat</h2>
        <p className="mt-2 whitespace-pre-wrap rounded-xl border border-gray-200 p-4 text-black">
          {chatLog || "No chat saved"}
        </p>

        <h2 className="mt-8 font-medium text-black">Task 1</h2>
        <p className="mt-1 text-sm text-gray-600">{score(task1)}</p>
        <p className="mt-3 text-sm text-gray-500">Original</p>
        <p className="mt-2 whitespace-pre-wrap rounded-xl border border-gray-200 p-4 text-black">
          {source1 || "No original text"}
        </p>
        <p className="mt-3 text-sm text-gray-500">Candidate answer</p>
        <p className="mt-2 whitespace-pre-wrap rounded-xl border border-gray-200 p-4 text-black">
          {task1 || "No text saved"}
        </p>

        <h2 className="mt-6 font-medium text-black">Task 2</h2>
        <p className="mt-1 text-sm text-gray-600">{score(task2)}</p>
        <p className="mt-3 text-sm text-gray-500">Original</p>
        <p className="mt-2 whitespace-pre-wrap rounded-xl border border-gray-200 p-4 text-black">
          {source2 || "No original text"}
        </p>
        <p className="mt-3 text-sm text-gray-500">Candidate answer</p>
        <p className="mt-2 whitespace-pre-wrap rounded-xl border border-gray-200 p-4 text-black">
          {task2 || "No text saved"}
        </p>
      </div>
    </main>
  );
}