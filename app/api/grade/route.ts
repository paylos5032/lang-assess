import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const id = body.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Test not found" }, { status: 404 });
  }

  const prompt = `
You grade a customer-service language assessment.
Language to assess: ${data.language || "unknown"}
Candidate: ${data.candidate || "unknown"}
Position: ${data.position || "unknown"}

Task 1 source:
${data.source1 || "-"}

Task 1 answer:
${data.task1 || "-"}

Task 2 source:
${data.source2 || "-"}

Task 2 answer:
${data.task2 || "-"}

Email reply:
${data.email_reply || "-"}

Chat:
${data.chat_log || "-"}

Left task 1 tab: ${data.left_tab1 || "no"}
Left task 2 tab: ${data.left_tab2 || "no"}

Return plain text only. No markdown. Use exactly these headings:

Soft skills grade: A, B, C, or D
Soft skills score: a number out of 100
Soft skills notes:
Judge only the email reply and the chat. Tone, empathy, clarity, and whether they handled an unhappy customer.

Translation grade: A, B, C, or D
Translation score: a number out of 100
Translation notes:
Judge only Task 1 and Task 2. Accuracy, grammar, and natural language. Task 1 should be English. Task 2 should be ${data.language || "the assessed language"}.

Hire recommendation: Strong hire, Hire, Medium hire, or No hire
Why:
One short reason.
`;

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.XAI_API_KEY,
    },
    body: JSON.stringify({
      model: "grok-4.7",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content;
  if (!text) {
    return NextResponse.json(
      { error: JSON.stringify(result).slice(0, 400) },
      { status: 500 }
    );
  }

  await supabase.from("assessments").update({ ai_grade: text }).eq("id", id);
  return NextResponse.json({ grade: text });
}