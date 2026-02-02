import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { chat_history, model_name, stream } = body;

  if (!chat_history || !Array.isArray(chat_history)) {
    throw createError({
      statusCode: 400,
      statusMessage: "chat_history is required and must be an array",
    });
  }

  const allowedModels = ["gpt-5.2", "gemini-3-flash", "gpt-5.2-instant"];
  const model = allowedModels.includes(model_name) ? model_name : "gpt-5.2-instant";

  const poeApiKey = process.env.POE_API_KEY || "";

  const client = new OpenAI({
    apiKey: poeApiKey,
    baseURL: "https://api.poe.com/v1",
  });

  try {
    if (stream) {
      const streamResponse = await client.chat.completions.create({
        model: model,
        messages: chat_history,
        stream: true,
      });

      setHeader(event, "Content-Type", "text/event-stream");
      setHeader(event, "Cache-Control", "no-cache");
      setHeader(event, "Connection", "keep-alive");

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamResponse) {
              const content = chunk.choices[0]?.delta?.content || "";
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return readable;
    }

    const completion = await client.chat.completions.create({
      model: model,
      messages: chat_history,
      stream: false,
    });

    return {
      choices: completion.choices,
      usage: completion.usage,
    };
  } catch (error: any) {
    console.error("Poe API error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to connect to Poe API",
    });
  }
});
