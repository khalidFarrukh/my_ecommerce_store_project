import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {

  return <AdminOrdersClient />;
}