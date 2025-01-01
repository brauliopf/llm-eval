"use server";

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

  console.log("CONSOLE LOG -- CREATEMODEL");

  await db.insert(Models).values({
    reference,
    provider,
    fineTuning,
  });
}
