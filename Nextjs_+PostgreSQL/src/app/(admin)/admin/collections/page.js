import { auth } from "@/auth";
import AdminCollectionsClient from "./AdminCollectionsClient";

export default async function AdminCollectionsPage() {
  const session = await auth();
  return <AdminCollectionsClient session={session} />;
}