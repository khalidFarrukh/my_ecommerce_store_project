"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import FloatingInput from "@/components/FloatingInput";
import { capitalizeEachFirstCharOfWord, convertTextStringToDashString } from "@/utils/utilities";
import { useAlertModal } from "@/context/AlertModalContext";
import ToggleSlideButton from "@/components/ToggleSlideButton";
import YesNoModal from "@/components/modals/YesNoModal";

export default function EditCollectionClient({ collection: initialCollection }) {
  const router = useRouter();
  const { isOpen: isAlertModalOpen, openAlertModal } = useAlertModal();
  const [collection, setCollection] = useState(initialCollection);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Generic field updater (like product form)
  const updateField = (field, value) => {
    setCollection((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // --- Submit handler
  const handleSubmit = async () => {
    const res = await fetch(`/api/admin/collections/${collection._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: collection.name,
        slug: convertTextStringToDashString(collection.name),
        turnedoff: collection.turnedoff,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      openAlertModal(data.error || "Something went wrong");
      return;
    }

    router.push("/admin/collections");
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const res = await fetch(`/api/admin/collections/${collection._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        openAlertModal(data.error || "Failed to delete collection");
        return;
      }

      router.push("/admin/collections");
    } catch (err) {
      console.error(err);
      openAlertModal("Something went wrong while deleting");
    } finally {
      setIsDeleting(false);
      setShowDeleteItemModal(false);
    }
  };

  useEffect(() => {
    if (isAlertModalOpen)
      setCollection(initialCollection);
  }, [isAlertModalOpen]);


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
            inputClassName="input!"
            type="text"
            value={capitalizeEachFirstCharOfWord(collection.name) || "" || ""}
            onChange={(e) => updateField("name", capitalizeEachFirstCharOfWord(e.target.value))}
          />
        </div>

        {/* Status */}
        <div className="bg-background_2 border border-myBorderColor rounded-lg p-6 flex items-center justify-between">
          <h2 className="text-lg font-medium">Shown</h2>

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