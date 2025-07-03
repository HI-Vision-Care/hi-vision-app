import Constants from "expo-constants";

const API_KEY ="AIzaSyCKlweT5JnG331LOc9mbysHShdUSzNVSVk";

export async function generateContent(prompt: string) {
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY!,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await res.json();

  // Extract the text from Gemini's response format
  if (
    data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts
  ) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error("Invalid response format from Gemini API");
}

export async function generateContentWithHistory(
  messages: Array<{ sender: string; text: string }>,
  currentPrompt: string
) {
  // Build conversation history for Gemini
  const contents = [];

  // Add conversation history
  for (const msg of messages) {
    contents.push({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    });
  }

  // Add current prompt
  contents.push({
    role: "user",
    parts: [{ text: currentPrompt }],
  });

  const body = {
    contents: contents,
  };

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY!,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await res.json();

  // Extract the text from Gemini's response format
  if (
    data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts
  ) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error("Invalid response format from Gemini API");
}
