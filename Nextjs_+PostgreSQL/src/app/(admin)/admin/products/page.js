import { auth } from "@/auth";
import AdminProductsClient from "./AdminProductClient";

export default async function AdminProductsPage() {
  const session = await auth();

  return <AdminProductsClient session={session} />
}