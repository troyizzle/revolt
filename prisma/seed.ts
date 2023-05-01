import * as fs from "fs"
import Papa, { ParseResult } from "papaparse"
import { CreateEventSchema } from "~/schema/event"
import { prisma } from "~/server/db"
import { CsvResult, importCsvData, parseCsvData } from "~/utils/importSessionData"
import { utc } from 'moment'

function parseDate(date: string) {
  const date_format = 'DD.MM.YYYY HH:mm';

  return utc(date, date_format).toDate();
}

async function main() {
  await prisma.player.deleteMany()
  await prisma.event.deleteMany()

  type eventImport = Omit<CreateEventSchema, 'date'> & { file?: string, date: string }

  const events: eventImport[] = [
    {
      date: 'Monday 20.03.2023 19:00 UTC',
      track: 'Autumn Ring Mini',
      laps: 50,
      ip: '185.241.253.9',
      serverStatus: 'END',
      resultsUrl: 'https://online.re-volt.io/sessions/test/results.php?file=test/session_2023-03-20_20-02-12.csv',
      file: 'session_2023-03-20_20-02-12.csv'
    },
    {
      date: 'Monday 27.03.2023 18:00 UTC',
      track: 'Clubman Stage Route 5',
      laps: 38,
      ip: '185.241.253.9',
      serverStatus: 'END',
      resultsUrl: 'https://online.re-volt.io/sessions/test/results.php?file=test/session_2023-03-27_19-11-13.csv'
    },
    {
      date: 'Monday 3.04.2023  18:00 UTC',
      track: 'Foxglen',
      laps: 60,
      ip: '185.241.253.9',
      serverStatus: 'END',
      resultsUrl: 'https://online.re-volt.io/sessions/test/results.php?file=test/session_2023-04-03_19-45-08.csv'
    },
    {
      date: 'Wednesday 12.04.2023  18:00 UTC',
      track: 'Wabe Ring',
      laps: 66,
      ip: '185.241.253.9',
      serverStatus: 'END',
      resultsUrl: 'https://online.re-volt.io/sessions/test/results.php?file=test/session_2023-04-12_19-47-44.csv',
      file: 'session_2023-04-12_19-47-44.csv'
    },
    {
      date: 'Monday 17.04.2023 18:00 UTC',
      track: 'SS Route Re-Volt',
      laps: 35,
      ip: '185.241.253.9',
      serverStatus: 'END',
      resultsUrl: 'https://online.re-volt.io/sessions/test/results.php?file=test/session_2023-04-17_19-44-48.csv',
      file: 'session_2023-04-17_19-44-48.csv'
    },
    {
      date: 'Monday 24.04.2023 18:00 UTC',
      track: 'Red Rock Valley',
      laps: 30,
      ip: '185.241.253.9',
      serverStatus: 'END',
      resultsUrl: 'https://online.re-volt.io/sessions/test/results.php?file=test/session_2023-04-24_19-44-01.csv',
      file: 'session_2023-04-24_19-44-01.csv'
    },
    {
      date: 'Thursday 4.05.2023 18:00 UTC',
      track: 'Eggland',
      laps: 80,
      ip: '185.241.253.9',
      serverStatus: 'CLOSED'
    }
  ]

  const scheduleEvents = [
    'Monday 8.05.2023',
    'Monday 15.05.2023',
    'Monday 5.06.2023',
    'Monday 12.06.2023',
    'Monday 19.06.2023',
    'Monday 26.06.2023',
  ]

  for (const date of scheduleEvents) {
    await prisma.event.create({
      data: {
        scheduledDate: parseDate(date),
        serverStatus: 'CREATED'
      }
    })
  }

  try {
    for (const event of events) {
      const { file, date, ...eventData } = event
      const createdEvent = await prisma.event.create({
        data: {
          ...eventData,
          date: parseDate(date)
        }
      })

      if (file) {
        const csv = fs.createReadStream(`./public/session_results/${file}`);
        const results = await new Promise<ParseResult<CsvResult>>((resolve) => {
          Papa.parse(csv, {
            complete: (results: ParseResult<CsvResult>) => {
              resolve(results);
            },
          });
        });
        const parsedData = parseCsvData(results.data);
        await importCsvData(parsedData, prisma, createdEvent.id);
      }
    }
  } catch (e) {
    console.error(e)
  }
}

main()
