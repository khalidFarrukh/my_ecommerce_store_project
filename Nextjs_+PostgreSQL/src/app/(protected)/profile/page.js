import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signIn?callbackUrl=/profile?error=auth_required")
  }

  return (
    <section className="w-full max-w-4xl mx-auto py-5 space-y-6">

      <ProfileClient />
    </section>
  );
}