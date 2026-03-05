import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

async function main() {
  const email = process.argv[2];
  const rawPassword = process.argv[3];

  if (!email || !rawPassword) {
    console.log("Usage: node scripts/createAdmin.js <email> <password>");
    process.exit(1);
  }

  const password = await bcrypt.hash(rawPassword, 12);

  await prisma.user.create({
    data: {
      email,
      password,
      role: "ADMIN",
    },
  });

  console.log(`Admin created: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });