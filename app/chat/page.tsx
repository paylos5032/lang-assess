"use client";

import { useState } from "react";

const replies = [
  "That is not good enough. I already waited 5 days. I want a refund today.",
  "I do not care about your process. This is the third time I write. Fix it now.",
  "Fine. Send me the next step in one sentence. Then we are done.",
];

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      from: "client",
      text: "This is ridiculous. My order is late and nobody answers. I am furious.",
    },
  ]);
  const [text, setText] = useState("");
  const [turn, setTurn] = useState(0);

  function send(event: React.FormEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;

    const next = [...messages, { from: "you", text: value }];
    if (turn < replies.length) {
      next.push({ from: "client", text: replies[turn] });
    }
    setMessages(next);
    setTurn(turn + 1);
    setText("");
  }

  function finish() {
    const youReplied = messages.some((item) => item.from === "you");
    if (!youReplied) {
      window.alert("Please send at least one reply.");
      return;
    }
    const chatText = messages
      .map((item) => (item.from === "client" ? "Client: " : "You: ") + item.text)
      .join("\n");
    localStorage.setItem("chatLog", chatText);
    window.location.href = "/task";
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold text-black">Live chat</h1>
        <p className="mt-3 text-gray-600">
          A customer is angry. Reply as support. This is not timed.
        </p>

        <div className="mt-6 h-80 overflow-y-auto rounded-xl border border-gray-200 p-4">
          {messages.map((item, index) => (
            <p
              key={index}
              className={
                item.from === "client"
                  ? "mt-3 text-black"
                  : "mt-3 text-right text-black"
              }
            >
              <span className="text-sm text-gray-500">
                {item.from === "client" ? "Customer" : "You"}
              </span>
              <br />
              {item.text}
            </p>
          ))}
        </div>

        <form onSubmit={send} className="mt-4 flex gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-black"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type your reply"
          />
          <button className="rounded-full bg-black px-5 py-3 text-white">
            Send
          </button>
        </form>

        <button
          onClick={finish}
          className="mt-6 rounded-full border border-black px-6 py-3 text-black"
        >
          End chat
        </button>
      </div>
    </main>
  );
}