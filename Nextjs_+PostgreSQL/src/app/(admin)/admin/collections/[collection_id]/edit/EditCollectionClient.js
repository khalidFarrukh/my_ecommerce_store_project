"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import FloatingInput from "@/components/FloatingInput";
import { capitalizeEachFirstCharOfWord, convertTextStringToDashString } from "@/utils/utilities";
import { useAlertModal } from "@/context/AlertModalContext";
import ToggleSlideButton from "@/components/ToggleSlideButton";
import YesNoModal from "@/components/modals/YesNoModal";
import { useGlobalToast } from "@/context/GlobalToastContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useSession } from "next-auth/react";

export default function EditCollectionClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setToast } = useGlobalToast();
  const { collection_id } = useParams();
  // const { isOpen: isAlertModalOpen, openAlertModal } = useAlertModal();

  const [collection, setCollection] = useState({});
  const [isCollectionLoading, setIsCollectionLoading] = useState(true);

  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);

  const fetchCollection = async () => {
    try {
      const res = await fetch(`/api/admin/collections/${collection_id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setCollection(data.data);
    } catch (err) {
      console.error(err);
      router.push("/admin/collections");
      setTimeout(() => {
        setToast({
          id: Date.now(),
          message: err.message,
          type: "error"
        });
      }, 0);
    }
    finally {
      setIsCollectionLoading(false);
    }
  }

  useEffect(() => {
    fetchCollection();
  }, [])


  // --- Generic field updater (like product form)
  const updateField = (field, value) => {
    setCollection((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // --- Submit handler
  const handleSubmit = async () => {

    try {

      const res = await fetch(`/api/admin/collections/${collection._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: collection.name,
          slug: convertTextStringToDashString(collection.name),
          turnedoff: collection.turnedoff,
          type: collection.type,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      router.push("/admin/collections");
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setToast({
          id: Date.now(),
          message: err.message,
          type: "error"
        });
      }, 0);

    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/collections/${collection._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete collection");

      router.push("/admin/collections");
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setToast({
          id: Date.now(),
          message: err.message,
          type: "error"
        });
      }, 0);
    } finally {
      setShowDeleteItemModal(false);
    }
  };


  if (isCollectionLoading) {
    return <div className="min-h-[calc(100vh-60px)] flex items-center justify-center">
      <LoadingSpinner text="Loading" />
    </div>
  }


  return (
    <>
      <div className="space-y-6">
        <AdminTabContentHeader
          heading="Edit Collection"
          description=""
        />

        {/* Basic Info */}
        <div className="bg-background_2 border border-myBorderColor rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium">Basic Info</h2>

          <FloatingInput
            id="collection_name"
            label="Collection Name"
            inputClassName=""
            type="text"
            value={capitalizeEachFirstCharOfWord(collection.name) || ""}
            onChange={(e) => updateField("name", capitalizeEachFirstCharOfWord(e.target.value))}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-sm font-medium">Collection Type</h2>
              </div>

              {session?.user?.role === "ADMIN" ? (
                <select
                  value={collection.type || "manual"}
                  onChange={(e) => updateField("type", e.target.value)}
                  className="
                    bg-background_3
                    border
                    border-myBorderColor
                    rounded-md
                    px-3
                    py-1
                    text-sm
                    outline-none
                    cursor-pointer
                  "
                >
                  <option value="manual">Manual</option>
                  <option value="system">System</option>
                </select>
              ) : (
                <div
                  className={`
                    px-3 py-1 rounded-md text-sm border capitalize 
                    ${collection.type === "system"
                      ? "bg-blue-500/10 border-blue-500 text-blue-400"
                      : "bg-green-500/10 border-green-500 text-green-400"
                    }
                  `}
                >
                  {collection.type || "manual"}
                </div>
              )}
            </div>

            {collection.type === "system" && (
              <div className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3">
                All products in store by design are included in this collection.
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-background_2 border border-myBorderColor rounded-lg p-6 flex items-center justify-between">
          <h2 className="text-lg font-medium">Visibility</h2>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <ToggleSlideButton
              width={44}
              height={24}
              checked={!collection?.turnedoff}
              onChange={() => updateField("turnedoff", !collection?.turnedoff)}
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="button1 px-6 py-2 cursor-pointer"
            >
              Update Collection
            </button>

            <button
              onClick={() => router.push("/admin/collections")}
              className="button2 px-6 py-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <button
            onClick={() => setShowDeleteItemModal(true)}
            className="px-6 py-2 cursor-pointer bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
      {showDeleteItemModal &&
        <YesNoModal
          text1={"Are you sure, you want to delete this item?"}
          cancelFunction={() => setShowDeleteItemModal(false)}
          yesFunction={() => {
            handleDelete();
            setShowDeleteItemModal(false);
          }}
        />
      }
    </>
  );
}