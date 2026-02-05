import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {

  const user = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  });

  console.log(user);

  const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

  return Response.json({ ok: true });
}