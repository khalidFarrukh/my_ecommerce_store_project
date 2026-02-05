"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; // middleware + global guard handle redirects
  }

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
