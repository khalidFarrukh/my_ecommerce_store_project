import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  // const session = await auth();

  // if (!session) {
  //   redirect("/signIn?callbackUrl=/admin");
  // }

  // if (session.user.role !== "ADMIN") {
  //   redirect("/");
  // }

  return <AdminOrdersClient />;
}