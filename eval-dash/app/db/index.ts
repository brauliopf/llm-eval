import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  Users,
  Experiments,
  TestCases,
  Models,
  ExperimentTestCases,
  ExperimentRuns,
  Results,
} from "./schema";

import { config } from "dotenv";
config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const schema = {
  usersTable: Users,
  experimentsTable: Experiments,
  testCasesTable: TestCases,
  modelsTable: Models,
  experimentTestCasesTable: ExperimentTestCases,
  experimentRunsTable: ExperimentRuns,
  resultsTable: Results,
};

// Single instance creates on app startup and served to other modules
export const db = drizzle({ client: sql, schema: { ...schema } });
