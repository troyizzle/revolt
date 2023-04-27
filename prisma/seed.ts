import * as fs from "fs"
import Papa, { ParseResult } from "papaparse"
import { prisma } from "~/server/db"
import { CsvResult, importCsvData, parseCsvData } from "~/utils/importSessionData"

async function main() {
  await prisma.player.deleteMany()

  try {
    const files = await fs.promises.readdir('./public/session_results');
    for (const file of files) {
      console.log(file);
      const csv = fs.createReadStream(`./public/session_results/${file}`);
      const results = await new Promise<ParseResult<CsvResult>>((resolve) => {
        Papa.parse(csv, {
          complete: (results: ParseResult<CsvResult>) => {
            resolve(results);
          },
        });
      });
      const parsedData = parseCsvData(results.data);
      await importCsvData(parsedData, prisma);
    }
  } catch (err) {
    console.error('Could not process the directory.', err);
    process.exit(1);
  }
}

main()
