import { prisma } from "~/server/db"
import { faker } from "@faker-js/faker"

async function main() {
  await prisma.player.deleteMany()
  await prisma.race.deleteMany()
  await prisma.event.deleteMany()

  const events = ['SM1', 'GR 2', 'Cas 2', 'PL 2', 'WRC', 'US 1', 'SO 2', 'SV 2', 'Hel', 'JHR'].map((name, index) => {
    return { name, shortName: name, order: index + 1 }
  })

  await prisma.league.upsert({
    where: { name: 'RVEC' },
    create: {
      name: 'RVEC',
      Season: {
        create: {
          name: '4',
          startDate: new Date(),
          events: {
            createMany: {
              data: events
            }
          }
        }
      }
    },
    update: {}
  })


  await prisma.user.createMany({
    data: Array.from({ length: 50 }).map((_, _index) => {
      return {
        email: faker.internet.email(),
        name: faker.internet.userName()
      }
    })
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
