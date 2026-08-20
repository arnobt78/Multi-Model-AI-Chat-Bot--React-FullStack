/**
 * Upstream provider HTTP callers — secrets + model ID passed as args (never from client env).
 */
import { ProviderRateLimitError } from "./types.js";

export type RateLimitMarker = (provider: string) => void;

export async function callGeminiAPI(
  message: string,
  apiKey: string,
  model: string,
  markRateLimited?: RateLimitMarker
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 429) {
      markRateLimited?.("gemini");
      throw new ProviderRateLimitError(
        "gemini",
        `Google Gemini API rate limit exceeded. You've reached your current usage limit. Please select another AI provider (Groq, OpenRouter, or Hugging Face) from the dropdown menu, or try again later.`
      );
    }
    throw new Error(
      `Gemini API error (${model}): ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
    );
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error(`Gemini (${model}) returned an empty response`);
  return text;
}

export async function callGroqAPI(
  message: string,
  apiKey: string,
  model: string
): Promise<string> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: message }],
        max_tokens: 500,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 429) {
      throw new ProviderRateLimitError(
        "groq",
        `Groq API rate limit exceeded (${model}).`
      );
    }
    throw new Error(
      `Groq API error (${model}): ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function callOpenRouterAPI(
  message: string,
  apiKey: string,
  model: string,
  referer = "https://multi-ai-chat-hub.vercel.app"
): Promise<string> {
  // Free tier requires model IDs ending in `:free`
  if (!model.endsWith(":free")) {
    throw new Error(
      `OpenRouter model must use :free suffix for free tier (got ${model})`
    );
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": referer,
        "X-Title": "AI Chat Hub",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: message }],
        max_tokens: 500,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 429) {
      throw new ProviderRateLimitError(
        "openrouter",
        `OpenRouter API rate limit exceeded (${model}).`
      );
    }
    throw new Error(
      `OpenRouter API error (${model}): ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function callHuggingFaceAPI(
  message: string,
  apiKey: string,
  model: string
): Promise<string> {
  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: message },
        ],
        max_tokens: 256,
        temperature: 0.7,
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 429) {
      throw new ProviderRateLimitError(
        "huggingface",
        `Hugging Face API rate limit exceeded (${model}).`
      );
    }
    // Always retriable within HF model chain (include "unavailable" for orchestrator)
    throw new Error(
      `Hugging Face model unavailable (${model}): ${response.status}`
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  if (data?.choices?.[0]?.message?.content) {
    return data.choices[0].message.content.trim();
  }
  throw new Error(`Hugging Face (${model}) returned an empty response`);
}

export async function callOpenAIAPI(
  message: string,
  apiKey: string,
  model: string
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: message,
      max_output_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      error?: { message?: string };
    };
    // Never append raw upstream message (may contain sk-proj-… key material)
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "OpenAI API key has expired or is invalid. Please renew or regenerate your API key."
      );
    }
    if (response.status === 429) {
      throw new ProviderRateLimitError(
        "openai",
        "OpenAI API quota exceeded. Please check billing or use another provider."
      );
    }
    const safeHint = errorData.error?.message
      ? " (upstream rejected the request)"
      : "";
    throw new Error(
      `OpenAI API error (${model}): ${response.status}${safeHint}`
    );
  }

  const data = (await response.json()) as {
    output?: { content?: { type?: string; text?: string }[] }[];
    choices?: { message?: { content?: string } }[];
  };

  if (data.output && data.output.length > 0) {
    const outputItem = data.output[0];
    if (outputItem.content && outputItem.content.length > 0) {
      const textContent = outputItem.content.find(
        (item) => item.type === "output_text"
      );
      if (textContent?.text) return textContent.text.trim();
    }
  }

  return (
    data.choices?.[0]?.message?.content?.trim() ||
    "I'm sorry, I couldn't process that."
  );
}
