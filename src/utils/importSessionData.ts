import { PrismaClient } from "@prisma/client"
import { addRaceResultsInput } from "~/schema/race"

export const racePoints: { [key: number]: number } = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1
}

export const BEST_LAP_POINTS = 1

export const tokens: { [key: number]: number } = {
  1: 1,
  2: 2,
  3: 2,
  4: 3,
  5: 3,
  6: 3,
  7: 3,
  8: 4,
  9: 4,
  10: 4,
  11: 5,
  12: 5,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
}


export type Version = [string, string, string, string]
type Session = [string, string, string, string, string, string]
type Results = ['Results', string, string]
type Header = ['#', 'Player', 'Car', 'Time', 'BestLap', 'Finished', 'Cheating']
export type Player = [string, string, string, string, string, string, string]
export type CsvResult = Version | Session | Results | Header | Player

export const parseCsvData = (data: CsvResult[]): addRaceResultsInput => {
  let parsed: addRaceResultsInput = { map: '', date: '', laps: 0, results: [] }

  data.forEach((d) => {
    if (d[0] == 'Results') {
      const version: Version = d as Version
      parsed.map = version[1]
    }

    if (d[0] == 'Session') {
      const session: Session = d as Session
      const dateObject = new Date(session[1]);
      const formattedDateString = dateObject.toISOString().substring(0, 10);
      parsed.date = formattedDateString

      parsed.laps = Number(session[4])
    }


    if (Number(d[0])) {
      const player: Player = d as Player

      parsed.results.push({
        position: Number(player[0]),
        player: player[1].trim(),
        car: player[2],
        time: player[3],
        bestLap: player[4],
        finished: player[5].trim() == 'true',
        cheating: player[6].trim() == 'true'
      })
    }
  })

  return parsed
}

export const importCsvData = async (input: addRaceResultsInput, prisma: PrismaClient, eventId?: string) => {
  const race = await prisma.race.create({
    data: {
      map: input.map, laps: input.laps,
      eventId: !eventId ? null : eventId,
    }
  })

  input.results.forEach(async (result, index) => {
    const { player: playerName, ...rest } = result

    try {
      const player = await prisma.player.upsert({
        where: {
          uniqueName: playerName.toLowerCase()
        },
        update: {},
        create: {
          name: playerName,
          uniqueName: playerName.toLowerCase(),
        }
      })

      let points = racePoints[result.position] || 0
      if (index === 0) {
        points += BEST_LAP_POINTS
      }

      await prisma.playerRace.create({
        data: {
          points: points,
          tokens: tokens[result.position] || 5,
          raceId: race.id,
          playerId: player.id,
          ...rest
        }
      })
    } catch (e) {
      console.log(`error on player: ${playerName}`)
      console.log(e)
    }

  })


  return race

}
