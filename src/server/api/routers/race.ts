import { addRaceResultsInput } from "~/schema/race";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { TOP_3_POINTS, racePoints } from "~/utils/importSessionData";

function calculateTimeDifference(time1: string, time2: string) {
  const [minutes1, seconds1, milliseconds1] = time1.split(':').map(Number);
  const [minutes2, seconds2, milliseconds2] = time2.split(':').map(Number);
  if (!minutes1 || !minutes2 || !seconds1 || !seconds2 || !milliseconds1 || !milliseconds2) {
    throw Error("Invalid time format")
  }

  const time1Millis = minutes1 * 60000 + seconds1 * 1000 + milliseconds1;
  const time2Millis = minutes2 * 60000 + seconds2 * 1000 + milliseconds2;

  const timeDiffMillis = Math.abs(time2Millis - time1Millis);

  const minutesDiff = Math.floor(timeDiffMillis / 60000);
  const secondsDiff = Math.floor((timeDiffMillis % 60000) / 1000);
  const millisecondsDiff = timeDiffMillis % 1000;

  // Format the result as "mm:ss:SSS"
  const formattedResult = `${minutesDiff.toString().padStart(2, '0')}:${secondsDiff.toString().padStart(2, '0')}:${millisecondsDiff.toString().padStart(3, '0')}`;

  return formattedResult;
}

function calculateAverageTime(totalTime: string, laps: number) {
  const [minutes, seconds, milliseconds] = totalTime.split(':').map(Number);
  if (!minutes || !seconds || !milliseconds) {
    throw Error("Invalid time format")
  }

  const totalMillis = minutes * 60000 + seconds * 1000 + milliseconds;
  const averageMillis = Math.round(totalMillis / laps);

  const averageMinutes = Math.floor(averageMillis / 60000);
  const averageSeconds = Math.floor((averageMillis % 60000) / 1000);
  const averageMilliseconds = averageMillis % 1000;

  // Format the average time as "mm:ss:SSS"
  const formattedAverage = `${averageMinutes.toString().padStart(2, '0')}:${averageSeconds.toString().padStart(2, '0')}:${averageMilliseconds.toString().padStart(3, '0')}`;

  return formattedAverage;
}

export const raceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(addRaceResultsInput)
    .mutation(async ({ ctx, input }) => {
      const { results, ...raceData } = input

      if (results.length == 0) {
        throw Error("No results") //TODO: Make this a TRPC error
      }

      const resultsSortedByPosition = results.sort((a, b) => {
        if (a.position < b.position) return -1
        if (a.position > b.position) return 1
        return 0
      })

      if (!resultsSortedByPosition[0]) {
        throw Error("No Results") // TODO: Make this a TRPC Error
      }

      const firstPlaceRaceTime = resultsSortedByPosition[0].time

      const playerRaceData = resultsSortedByPosition.map((data, index) => {
        let interval = null

        if (index !== 0) {
          const previousResult = resultsSortedByPosition[index - 1]
          if (previousResult) {
            interval = calculateTimeDifference(previousResult.time, data.time)
          }
        }

        return {
          points: racePoints[data.position] || 0,
          gap: index === 0 ? null : calculateTimeDifference(firstPlaceRaceTime, data.time),
          interval: interval,
          averageLap: calculateAverageTime(data.time, input.laps),
          ...data
        }
      })

      const resultsSortedByBestLap = playerRaceData.sort((a, b) => {
        if (a.bestLap < b.bestLap) return -1
        if (a.bestLap > b.bestLap) return 1
        return 0
      })

      resultsSortedByBestLap.map((data, index) => {
        if (index === 3) return;

        data.points += TOP_3_POINTS[index + 1] || 0
      })

      const race = await ctx.prisma.race.create({
        data: {
          ...raceData,
          PlayerRace: {
            create: playerRaceData.map((data) => {
              const { player: playerName, ...raceData } = data

              return {
                player: {
                  connectOrCreate: {
                    where: { uniqueName: playerName.toLowerCase() },
                    create: {
                      name: playerName,
                      uniqueName: playerName.toLowerCase(),
                    },
                  }
                },
                ...raceData
              }
            })
          }
        }
      })

      return race
    }),
})
