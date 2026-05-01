"use client";

import { useState, useEffect, use } from "react";
import { getSession, signOut } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import YesNoModal from "@/components/modals/YesNoModal";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGlobalToast } from "@/context/GlobalToastContext";
import { useSessionExpiry } from "@/context/SessionExpiryContext";

export default function ProfileTabs() {
  const router = useRouter();

  const { timeLeft, sessionData: session, isAuthenticatedForExpiry } = useSessionExpiry();
  const [activeTab, setActiveTab] = useState("overview");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { setToast } = useGlobalToast();

  const { theme, setTheme } = useTheme();

  // Persist theme when changed
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);


  useEffect(() => {
    if (activeTab !== "orders") return;

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);

        const res = await fetch("/api/orders/my-orders", {
          credentials: "include",
        });

        const resultJson = await res.json();

        if (!res.ok) {
          setOrders([]);
          return;
        }

        setOrders(resultJson.data || []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  return (
    <>
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Your Profile</h1>
          <p className="text-myTextColorMain mt-1 text-sm sm:text-base">
            Manage your account information and settings
          </p>
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="cursor-pointer button1 px-4 py-2"
        >
          Logout
        </button>
      </div>

      <div className="space-y-6">
        {/* Tabs */}
        <div className="
          flex 
          flex-wrap 
          gap-2 
          border-b 
          border-myBorderColor 
          pb-4
        ">
          {["overview", "security", "orders", "appearance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                cursor-pointer
                text-sm sm:text-base
                capitalize
                ${activeTab === tab
                  ? "button1_active px-4 py-2"
                  : "button1 px-4 py-2"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="
          bg-background_2 
          border 
          border-myBorderColor 
          rounded-lg 
          p-4 
          sm:p-6
        ">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-4 text-sm sm:text-base">
              <div>
                <p className="text-myTextColorMain text-xs sm:text-sm">Name</p>
                <p className="font-medium break-words">
                  {session?.user.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-myTextColorMain text-xs sm:text-sm">Email</p>
                <p className="font-medium break-words">
                  {session?.user.email}
                </p>
              </div>

              <div>
                <p className="text-myTextColorMain text-xs sm:text-sm">Role</p>
                <p className="font-medium">
                  {session?.user.role || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <p className="text-myTextColorMain text-sm sm:text-base">
                You can update your password or manage security settings here.
              </p>

              <button className="button2 cursor-pointer px-4 py-2">
                Change Password
              </button>
            </div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Your Orders</h2>

              {loadingOrders ? (
                <div className=" min-h-[140px] flex items-center justify-center">
                  <LoadingSpinner text="Loading" />
                </div>
              ) : orders.length === 0 ? (
                <p className="text-myTextColorMain">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="group border cursor-pointer border-myBorderColor p-4 rounded-md bg-background_1 space-y-2"
                      onClick={() => router.push(`/orders/${order._id}`)}
                    >
                      <div className="flex justify-between">
                        <p className="font-semibold group-hover:underline">
                          Order #{order._id}
                        </p>

                        <span className="text-xs px-2 py-1 rounded bg-background_2 border border-myBorderColor">
                          {order.status}
                        </span>
                      </div>

                      <p className="text-sm text-myTextColorMain">
                        Items: {order.items.length}
                      </p>

                      <p className="text-sm">
                        Total: Rs. {order.pricing.total}
                      </p>

                      <p className="text-xs text-myTextColorMain">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-base sm:text-lg">
                  Theme Preference
                </h2>
                <p className="text-myTextColorMain text-sm mt-1">
                  Choose how the application looks.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {["light", "dark", "system"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setTheme(mode)
                    }}
                    className={`
                      cursor-pointer
                      capitalize
                      ${theme === mode
                        ? "button1_active px-4 py-2"
                        : "button2 px-4 py-2"
                      }
                    `}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <p className="text-xs text-myTextColorMain">
                Current setting: <span className="font-medium capitalize">{theme}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <YesNoModal
          text1={"Are you sure, you want to logout?"}
          cancelFunction={() => setShowLogoutModal(false)}
          yesFunction={async () => {
            if (timeLeft > 0) {

              await signOut({ redirect: false });
              isAuthenticatedForExpiry.current = false;
              setToast({
                id: Date.now(),
                message: "Logged Out",
                type: "info",
              });
              router.push("/");
            }
          }}
        />
      )}
    </>
  );
}