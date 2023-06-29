import { prisma } from "~/server/db"

async function main() {
  await prisma.player.deleteMany()
  await prisma.event.deleteMany()

  const names = ['SM1', 'GR 2', 'Cas 2', 'PL 2', 'WRC', 'US 1', 'SO 2', 'SV 2', 'Hel', 'JHR']
  await prisma.event.createMany({
    data: names.map((name, index) => {
      return { name, shortName: name, order: index + 1 }
    })})
}

main()
