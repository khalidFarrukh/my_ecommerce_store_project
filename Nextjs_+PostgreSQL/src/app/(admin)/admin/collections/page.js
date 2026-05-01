import { auth } from "@/auth";
import AdminCollectionsClient from "./AdminCollectionsClient";

export default async function AdminCollectionsPage() {
  // const session = await auth();
  // if (!session) {
  //   redirect("/signIn?callbackUrl=/admin");
  // }

  // if (session.user.role !== "ADMIN") {
  //   redirect("/");
  // }

  return <AdminCollectionsClient/>;
}