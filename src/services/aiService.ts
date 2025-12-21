import { AIProvider, getProvider, AI_PROVIDERS } from "./aiProviders";

export interface AIChatRequest {
  message: string;
  provider?: AIProvider;
}

export interface AIChatResponse {
  content: string;
  provider: string;
  success: boolean;
  error?: string;
}

/**
 * Multi-provider AI Service with automatic fallback
 * Tries providers in order: Gemini -> Groq -> OpenRouter -> HuggingFace
 */
class AIService {
  // Track rate-limited providers to skip them temporarily
  private rateLimitedProviders: Map<string, number> = new Map();
  private readonly RATE_LIMIT_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown

  private isRateLimited(provider: string): boolean {
    const lastRateLimit = this.rateLimitedProviders.get(provider);
    if (!lastRateLimit) return false;

    const timeSinceLimit = Date.now() - lastRateLimit;
    if (timeSinceLimit > this.RATE_LIMIT_COOLDOWN) {
      // Cooldown expired, remove from blacklist
      this.rateLimitedProviders.delete(provider);
      return false;
    }

    return true;
  }

  private markRateLimited(provider: string): void {
    this.rateLimitedProviders.set(provider, Date.now());
    console.warn(
      `⚠️ ${provider} is rate-limited. Skipping for ${
        this.RATE_LIMIT_COOLDOWN / 1000 / 60
      } minutes.`
    );
  }
  private async callGeminiAPI(
    message: string,
    apiKey: string
  ): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Detect rate limit errors (429) and mark provider as rate-limited
      if (response.status === 429) {
        this.markRateLimited("gemini");
        throw new Error(
          `Gemini API rate limit exceeded. The service will automatically skip Gemini for the next few minutes. Error: ${JSON.stringify(
            errorData
          )}`
        );
      }

      throw new Error(
        `Gemini API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }

  private async callGroqAPI(message: string, apiKey: string): Promise<string> {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: message }],
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Groq API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  private async callOpenRouterAPI(
    message: string,
    apiKey: string
  ): Promise<string> {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Chat Bot",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [{ role: "user", content: message }],
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  private async callHuggingFaceAPI(
    message: string,
    apiKey: string
  ): Promise<string> {
    // List of reliable free-tier models (2025) - Using new Inference Providers API
    const models = [
      // New models (2025)
      "meta-llama/Llama-3.1-8B-Instruct",
      "mistralai/Mistral-7B-Instruct-v0.3",
      "HuggingFaceH4/zephyr-7b-beta",
      "tiiuae/falcon-7b-instruct",
      "google/gemma-2b-it",
      "NousResearch/Hermes-2-Pro-Mistral-7B",
      // Legacy models as fallbacks
      "mistralai/Mistral-7B-Instruct-v0.2",
      "google/gemma-2b",
      "google/gemma-7b",
      "mistralai/Mixtral-8x7B-Instruct-v0.1",
      "tiiuae/falcon-7b",
      "microsoft/phi-1_5",
      "bigscience/bloomz-560m",
      "HuggingFaceH4/zephyr-7b-alpha",
      "tiiuae/falcon-40b-instruct",
      "facebook/bart-large-cnn", // Final fallback
    ];

    const failedModels: string[] = [];

    for (const model of models) {
      try {
        const response = await fetch(
          "https://router.huggingface.co/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: "system", content: "You are a helpful AI assistant." },
                { role: "user", content: message },
              ],
              max_tokens: 256,
              temperature: 0.7,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Special handling for bart-large-cnn (not a chat model)
          if (model === "facebook/bart-large-cnn") {
            const failedList = failedModels.join(", ");
            return `Hugging Face chat models are currently unavailable. The following models failed: ${failedList}. Only the fallback model (bart-large-cnn) is available, but it's designed for text summarization, not chat. Please select another AI provider (Gemini, Groq, or OpenRouter) from the dropdown menu for better chat responses.`;
          }

          // Extract the generated text from the response
          if (data?.choices?.[0]?.message?.content) {
            console.log(`✅ Response from ${model}`);
            return data.choices[0].message.content.trim();
          }

          return "I'm sorry, I couldn't process that.";
        }

        // If this model failed, try next one
        failedModels.push(model);
        console.warn(
          `${model} failed (${response.status}), trying next model...`
        );
      } catch (error) {
        failedModels.push(model);
        console.warn(`${model} error:`, error);
        continue;
      }
    }

    // If all models failed
    const failedList = failedModels.join(", ");
    throw new Error(
      `All Hugging Face chat models failed: ${failedList}. Please check your API key or try another provider.`
    );
  }

  // OpenAI API - Last resort fallback (using new Responses API)
  private async callOpenAIAPI(
    message: string,
    apiKey: string
  ): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: message,
        max_output_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;

      // Check if it's an authentication error (expired key)
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          `OpenAI API key has expired or is invalid. Please renew or regenerate your API key at https://platform.openai.com/api-keys. Otherwise, use another AI provider (Gemini, Groq, or OpenRouter) from the dropdown menu. Error: ${errorMessage}`
        );
      }

      // Check if it's a rate limit error
      if (response.status === 429) {
        throw new Error(
          `OpenAI API quota exceeded. You've reached your current usage limit. Please check your plan and billing details at https://platform.openai.com/account/billing. Otherwise, use another AI provider (Gemini, Groq, or OpenRouter) from the dropdown menu. Error: ${errorMessage}`
        );
      }

      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText} - ${errorMessage}`
      );
    }

    const data = await response.json();
    // New Responses API structure
    if (data.output && data.output.length > 0) {
      const outputItem = data.output[0];
      if (outputItem.content && outputItem.content.length > 0) {
        const textContent = outputItem.content.find(
          (item: any) => item.type === "output_text"
        );
        if (textContent && textContent.text) {
          return textContent.text.trim();
        }
      }
    }

    // Fallback to old format if needed
    return (
      data.choices?.[0]?.message?.content?.trim() ||
      "I'm sorry, I couldn't process that."
    );
  }

  async getChatResponse(request: AIChatRequest): Promise<AIChatResponse> {
    const { message, provider } = request;

    // If specific provider requested, try only that one
    if (provider) {
      const providerConfig = getProvider(provider);
      if (!providerConfig.available || !providerConfig.apiKey) {
        return {
          content: "",
          provider: providerConfig.name,
          success: false,
          error: `${providerConfig.displayName} is not available`,
        };
      }

      try {
        let content = "";
        switch (provider) {
          case "gemini":
            content = await this.callGeminiAPI(message, providerConfig.apiKey);
            break;
          case "groq":
            content = await this.callGroqAPI(message, providerConfig.apiKey);
            break;
          case "openrouter":
            content = await this.callOpenRouterAPI(
              message,
              providerConfig.apiKey
            );
            break;
          case "huggingface":
            content = await this.callHuggingFaceAPI(
              message,
              providerConfig.apiKey
            );
            break;
          case "openai":
            content = await this.callOpenAIAPI(message, providerConfig.apiKey);
            break;
          default:
            throw new Error(`Unknown provider: ${provider}`);
        }

        return {
          content,
          provider: providerConfig.displayName,
          success: true,
        };
      } catch (error) {
        return {
          content: "",
          provider: providerConfig.displayName,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    // Auto-fallback: Try providers in order of reliability
    // Skip rate-limited providers to avoid wasting quota
    // Note: Groq is first because it has better free tier limits (30 requests/minute)
    const providers: Array<AIProvider> = [
      "groq", // Better free tier: 30 req/min, unlimited daily
      "gemini", // 15 req/min, 1500/day - more restrictive
      "openrouter",
      "huggingface",
      "openai", // Last resort
    ];

    for (const providerName of providers) {
      const providerConfig = AI_PROVIDERS[providerName];

      if (!providerConfig.available || !providerConfig.apiKey) {
        continue;
      }

      // Skip rate-limited providers in auto-fallback mode
      if (this.isRateLimited(providerName)) {
        console.log(`⏭️ Skipping ${providerConfig.displayName} (rate-limited)`);
        continue;
      }

      try {
        let content = "";
        switch (providerName) {
          case "gemini":
            content = await this.callGeminiAPI(message, providerConfig.apiKey);
            break;
          case "groq":
            content = await this.callGroqAPI(message, providerConfig.apiKey);
            break;
          case "openrouter":
            content = await this.callOpenRouterAPI(
              message,
              providerConfig.apiKey
            );
            break;
          case "huggingface":
            content = await this.callHuggingFaceAPI(
              message,
              providerConfig.apiKey
            );
            break;
          case "openai":
            content = await this.callOpenAIAPI(message, providerConfig.apiKey);
            break;
        }

        return {
          content,
          provider: providerConfig.displayName,
          success: true,
        };
      } catch (error) {
        // Check if it's a rate limit error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          errorMessage.includes("rate limit") ||
          errorMessage.includes("429")
        ) {
          this.markRateLimited(providerName);
        }
        console.warn(`${providerConfig.displayName} failed:`, error);
        continue; // Try next provider
      }
    }

    return {
      content: "",
      provider: "None",
      success: false,
      error:
        "All AI providers failed or are unavailable. Please check your API keys.",
    };
  }
}

export const aiService = new AIService();
