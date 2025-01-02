"use server";

import { ConsoleLogWriter } from "drizzle-orm";
import { db } from "../db";
import { Models } from "../db/schema";

export async function getModels() {
  const models = await db.select().from(Models);
  return models;
}

export async function createModel(formData: FormData) {
  const reference = formData.get("reference")?.toString() || "";
  const provider = formData.get("provider")?.toString() || null;
  const fineTuning = formData.get("fineTuning")?.toString() || null;

  await db.insert(Models).values({
    reference,
    provider,
    fineTuning,
  });
}

import Groq from "groq-sdk";
const groq = new Groq();
// export async function getCompletion(formData : FormData) {
//   const prompt = formData.get("prompt")?.toString() || "Just say you love me"
// }

export const getGroqChatCompletion = async (
  prompt: string
): Promise<string> => {
  const response = await groq.chat.completions.create({
    messages: [
      // Set an optional system message. This sets the behavior of the
      // assistant and can be used to provide specific instructions for
      // how it should behave throughout the conversation.
      {
        role: "system",
        content: "you are a helpful joker.",
      },
      // Set a user message for the assistant to respond to.
      {
        role: "user",
        content: prompt,
      },
    ],

    // The language model which will generate the completion.
    model: "llama-3.3-70b-versatile",
  });

  return response.choices[0]?.message?.content || "";
};
