"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import YesNoModal from "@/components/modals/YesNoModal";

export default function ProfileTabs({ session }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { theme, setTheme } = useTheme();

  // Persist theme when changed
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

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
                  {session.user.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-myTextColorMain text-xs sm:text-sm">Email</p>
                <p className="font-medium break-words">
                  {session.user.email}
                </p>
              </div>

              <div>
                <p className="text-myTextColorMain text-xs sm:text-sm">Role</p>
                <p className="font-medium">
                  {session.user.role || "USER"}
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
            <div>
              <p className="text-myTextColorMain text-sm sm:text-base">
                Your orders will appear here.
              </p>
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
                    onClick={() => setTheme(mode)}
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
          yesFunction={() => {
            signOut({ callbackUrl: "/" });
          }}
        />
      )}
    </>
  );
}