import { auth } from "@/auth";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";

export default async function AdminPage() {
  const session = await auth();
  // if (!session || session.user.role !== "ADMIN") {
  //   redirect("/");
  // }
  return (
    <div className="space-y-6 min-h-[1000px]">
      {/* Header */}
      <AdminTabContentHeader heading={"Dashboard"} description={`Welcome back, ${session?.user?.email}`} />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <DashboardCard title="Products" value="--" />
        <DashboardCard title="Orders" value="--" />
        <DashboardCard title="Customers" value="--" />
        <DashboardCard title="Revenue" value="$--" />
      </div>

      {/* Recent Orders */}
      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Recent Orders</h2>

        <p className="text-sm text-myTextColorMain">
          No recent orders yet.
        </p>
      </div>

      {/* Low Stock */}
      <div className="bg-background_2 border border-myBorderColor rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Low Stock Products</h2>

        <p className="text-sm text-myTextColorMain">
          All products currently have sufficient stock.
        </p>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="bg-background_2 border border-myBorderColor rounded-lg p-4">
      <p className="text-sm text-myTextColorMain">{title}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}