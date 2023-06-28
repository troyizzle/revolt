import { prisma } from "~/server/db"

async function main() {
  await prisma.user.deleteMany()
  await prisma.player.deleteMany()
}

main()
