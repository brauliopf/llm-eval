import { pgTable, integer, serial, text, timestamp } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const Models = pgTable("models", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull(),
  provider: text("provider"),
  fineTuning: text("fineTuning"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const Experiments = pgTable("experiments", {
  id: serial("id").primaryKey(),
  systemPrompt: text("systemPrompt").notNull(),
  userId: integer("userId")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const TestCases = pgTable("testCases", {
  id: serial("id").primaryKey(),
  testPrompt: text("testPrompt").notNull(),
  testRubric: text("testRublic").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const ExperimentTestCases = pgTable("experimentTestCases", {
  id: serial("id").primaryKey(),
  experimentId: integer("experimentId")
    .notNull()
    .references(() => Experiments.id, { onDelete: "cascade" }),
  testCaseId: integer("testCaseId")
    .notNull()
    .references(() => TestCases.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const ExperimentRuns = pgTable("experimentRuns", {
  id: serial("id").primaryKey(),
  experimentId: integer("experimentId")
    .notNull()
    .references(() => Experiments.id, { onDelete: "cascade" }),
  provider: text("provider"),
  fineTuning: text("fineTuning"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const Results = pgTable("results", {
  id: serial("id").primaryKey(),
  experimentRunId: integer("experimentRunId")
    .notNull()
    .references(() => ExperimentRuns.id, { onDelete: "cascade" }),
  testCaseId: integer("testCaseId")
    .notNull()
    .references(() => TestCases.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});
