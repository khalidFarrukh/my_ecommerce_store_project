import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import EditCollectionClient from "./EditCollectionClient";

export default function EditCollectionPage() {

  return <EditCollectionClient />;
}