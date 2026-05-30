import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: Request) {
  try {
    const { text, tone } = await request.json() as { text: string; tone: string };

    if (!text?.trim()) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
    }

    const toneInstructions: Record<string, string> = {
      professional: 'formal, business-appropriate, and polished',
      academic: 'scholarly, analytical, and well-structured with academic vocabulary',
      casual: 'relaxed, conversational, and natural like a friend talking',
      friendly: 'warm, approachable, and engaging',
    };

    const toneDesc = toneInstructions[tone] || toneInstructions.professional;

    const prompt = `You are an expert human writer. Rewrite the following AI-generated text to sound completely natural and human-written. 

Rules:
- Make it sound ${toneDesc}
- Vary sentence lengths — mix short punchy sentences with longer ones
- Use natural transitions, contractions, and everyday expressions
- Remove robotic patterns like "Furthermore", "Moreover", "It is important to note", "In conclusion"
- Keep the same meaning and all key information
- Do NOT add new information or change facts
- Return ONLY the rewritten text, nothing else

Text to rewrite:
${text}`;

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Groq error:', err);
      return NextResponse.json({ error: 'Groq API failed.' }, { status: 500 });
    }

    const data = await res.json() as { choices: { message: { content: string } }[] };
    const humanized = data.choices[0]?.message?.content?.trim() || text;

    return NextResponse.json({ humanized });
  } catch (error) {
    console.error('Humanize API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
