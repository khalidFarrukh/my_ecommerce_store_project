import CheckoutClient from "./CheckoutClient";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signIn");
  }

  const client = await clientPromise;
  const db = client.db("my_ecommerce_db");

  // Fetch user's addresses
  const addresses = await db
    .collection("addresses")
    .find({ user_id: session.user.id })
    .toArray();

  const formattedAddresses = addresses.map(a => ({
    ...a,
    _id: a._id.toString(),
  }));

  return (
    <CheckoutClient
      user={session.user}
      addresses={formattedAddresses}
    />
  );
}