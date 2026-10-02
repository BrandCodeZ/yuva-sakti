/**
 * Imports a finished result set so the results page and certificates can be
 * tested before the real timing file exists.
 *
 *   npm run seed --workspace api
 *
 * Reads a JSON array of rows shaped like the timing vendor's export. Rows are
 * upserted on registrationId, so re-running the seed is safe.
 */
import { readFile } from "node:fs/promises";
import process from "node:process";
import { connectDatabase, disconnectDatabase } from "../db/connect.js";
import { Result } from "../models/result.model.js";

interface SeedRow {
  registrationId: string;
  bib: string;
  name: string;
  distance: "10k" | "5k" | "3k";
  category?: string;
  grossTime?: string;
  netTime?: string;
  status?: "finished" | "dns" | "dnf";
  lastCheckpoint?: string;
}

async function main(): Promise<void> {
  const file = process.argv[2] ?? "sample-results.json";

  let rows: SeedRow[];
  try {
    rows = JSON.parse(await readFile(file, "utf8")) as SeedRow[];
  } catch {
    console.error(`Could not read ${file}. Expected a JSON array of result rows.`);
    process.exit(1);
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    console.error(`${file} contains no rows. Nothing imported.`);
    process.exit(1);
  }

  await connectDatabase();

  for (const row of rows) {
    await Result.updateOne(
      { registrationId: row.registrationId },
      {
        $set: {
          bib: row.bib,
          name: row.name,
          distance: row.distance,
          category: row.category ?? null,
          grossTime: row.grossTime ?? null,
          netTime: row.netTime ?? null,
          status: row.status ?? "finished",
          lastCheckpoint: row.lastCheckpoint ?? null,
          provisional: false,
          publishedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }

  console.info(`Imported ${rows.length} result rows from ${file}.`);
  await disconnectDatabase();
}

void main();
