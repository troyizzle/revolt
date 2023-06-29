import { RaceCsvResults } from "~/schema/race"

export type Version = [string, string, string, string]
type Session = [string, string, string, string, string, string]
type Results = ['Results', string, string]
type Header = ['#', 'Player', 'Car', 'Time', 'BestLap', 'Finished', 'Cheating']
export type Player = [string, string, string, string, string, string, string]
export type CsvResult = Version | Session | Results | Header | Player

export const parseCsvData = (data: CsvResult[]): RaceCsvResults => {
  let parsed: RaceCsvResults = { map: '', laps: 0, results: [] }

  data.forEach((d) => {
    if (d[0] == 'Results') {
      const version: Version = d as Version
      parsed.map = version[1]
    }

    if (d[0] == 'Session') {
      const session: Session = d as Session
      parsed.laps = Number(session[4])
    }


    if (Number(d[0])) {
      const player: Player = d as Player
      console.log(d, player[4])
      parsed.results.push({
        position: Number(player[0]),
        player: player[1],
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
