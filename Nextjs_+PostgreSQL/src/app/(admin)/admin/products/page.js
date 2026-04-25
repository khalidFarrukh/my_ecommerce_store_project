import { auth } from "@/auth";
import AdminProductsClient from "./AdminProductClient";

export default async function AdminProductsPage() {
  const session = await auth();
  // if (!session) {
  //   redirect("/signIn?callbackUrl=/admin");
  // }

  // if (session.user.role !== "ADMIN") {
  //   redirect("/");
  // }

  return <AdminProductsClient session={session} />
}