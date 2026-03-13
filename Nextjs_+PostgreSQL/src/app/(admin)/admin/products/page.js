import { auth } from "@/auth";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import Link from "next/link";

export default async function AdminProductsPage() {
  const session = await auth();
  // if (!session || session.user.role !== "ADMIN") {
  //   redirect("/");
  // }
  return (
    <div className="space-y-6 min-h-[1000px]">
      <AdminTabContentHeader
        heading={"Products"}
        description={`Welcome back, ${session?.user?.email}`}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          className="w-80 px-3 py-2 border border-myBorderColor rounded-md bg-background_2"
        />

        {/* Add product */}
        <Link
          href="/admin/products/new"
          className="button1 px-4 py-2"
        >
          + Add Product
        </Link>
      </div>

      {/* Products table/grid later */}
      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6">
        <p className="text-sm text-myTextColorMain">
          Products list will appear here.
        </p>
      </div>
    </div>
  );
}