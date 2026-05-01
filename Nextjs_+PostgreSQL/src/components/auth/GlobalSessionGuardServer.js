import { auth } from "@/auth";
import GlobalSessionGuard from "./GlobalSessionGuard";

export default async function GlobalSessionGuardServer() {
  const session = await auth();

  return <GlobalSessionGuard session={session} />;
}

