import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <main className="w-full max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <p>
        <strong>Name:</strong> {session.user.name || "N/A"}
      </p>

      <p>
        <strong>Email:</strong> {session.user.email}
      </p>

      <p>
        <strong>Role:</strong> {session.user.role || "USER"}
      </p>
    </main>
  );
}