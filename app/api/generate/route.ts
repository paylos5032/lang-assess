import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const language = body.language || "German";
  const company = body.company || "a company";
  const position = body.position || "customer service";

  const prompt = `
Write two short assessment texts for a ${position} candidate at ${company}.
Keep them general. Not only deliveries. You can use billing, appointments, complaints, or product questions.
Each text: 40 to 70 words. Plain sentences. No names of famous brands.

Return only valid JSON, no markdown:
{"text1":"...","text2":"..."}

text1 must be written in ${language}. The candidate will translate it into English.
text2 must be written in English. The candidate will translate it into ${language}.
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

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json({
      text1: parsed.text1 || "",
      text2: parsed.text2 || "",
    });
  } catch {
    return NextResponse.json({ error: text.slice(0, 400) }, { status: 500 });
  }
}