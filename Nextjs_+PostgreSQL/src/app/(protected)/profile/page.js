import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileTabs from "./ProfileTabs";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/account");
  }

  return (
    <main className="w-full max-w-4xl mx-auto py-5 space-y-6">

      <ProfileTabs session={session} />
    </main>
  );
}