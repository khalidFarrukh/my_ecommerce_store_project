"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTabContentHeader from "@/components/admin/AdminTabContentHeader";
import { Edit2 } from "lucide-react";
import ToggleSlideButton from "@/components/ToggleSlideButton";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import FloatingInput from "@/components/FloatingInput";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useSessionExpiry } from "@/context/SessionExpiryContext";
import { useRouter } from "next/navigation";

export default function AdminCollectionsClient() {
  const router = useRouter();
  const { sessionData: session } = useSessionExpiry();
  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  const fetchCollections = async () => {
    try {
      setLoadingCollections(true);
      const res = await fetch("/api/admin/collections");
      const json = await res.json();
      setCollections(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCollections(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const toggleTurnedOff = async (collection) => {
    const res = await fetch(`/api/admin/collections/${collection._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...collection,
        turnedoff: !collection.turnedoff,
      }),
    });
    if (res.ok) fetchCollections();
  };

  useEffect(() => {
    console.log("Collections updated:", collections);
  }, [collections]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(collections);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    const updated = items.map((item, index) => ({
      ...item,
      orderNo: index + 1,
    }));

    setCollections(updated);

    // 🔥 persist to backend
    await fetch("/api/admin/collections/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        updated.map(({ _id, orderNo }) => ({ _id, orderNo }))
      ),
    });
  };

  return (
    <div className="space-y-6 min-h-[1000px]">
      <AdminTabContentHeader
        heading="Collections"
        description={`Welcome back, ${session?.user?.email}`}
        right_content={
          <button
            onClick={async () => {
              const res = await fetch("/api/admin/collections/new", {
                method: "POST",
              });

              const data = await res.json();
              router.push(`/admin/collections/${data.id}/edit`);
            }}
            className="button1 px-4 py-2"
          >

            + Add Collection
          </button>
        }
      />

      <section className="bg-background_2 border border-myBorderColor rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Collections</h2>
          {/* <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections..."
            className="input w-72 px-3 py-2 text-base
            bg-inputBgNormal
            border
            border-myBorderColor
            rounded-md
            outline-none
            focus:border-foreground
            focus:ring-2
            focus:ring-foreground/20
            "
          /> */}
        </div>
        {
          loadingCollections ?
            <div className=" flex items-center justify-center">
              <LoadingSpinner text="Loading" />
            </div> :
            <div className="max-w-0 min-w-full overflow-x-auto scrollbar-hide">
              <div className="w-full text-sm">
                <div className="grid grid-cols-[250px_1fr_120px_120px_50px] border-b border-myBorderColor py-2 font-medium">
                  <div>ID</div>
                  <div>Name</div>
                  <div>Shown</div>
                  <div className="text-center">Actions</div>
                  <div></div> {/* drag */}
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="collections">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="scrollbar-hide overflow-y-scroll max-h-[calc(100vh-60px-24px-250px)]">
                        {collections.map((collection, index) => (
                          <Draggable
                            key={collection._id}
                            draggableId={collection._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={provided.draggableProps.style}
                                className={`
                            grid
                            grid-cols-[250px_1fr_120px_120px_50px]
                            items-center
                            py-3
                            border-b border-myBorderColor
                            ${snapshot.isDragging ? "bg-background_3 shadow-lg" : ""}
                          `}
                              >


                                {/* ID */}
                                <div className="truncate">{collection._id}</div>

                                {/* Name */}
                                <div className="truncate">
                                  {collection.name || "Untitled"}
                                </div>

                                {/* Toggle */}
                                <div>
                                  <ToggleSlideButton
                                    width={44}
                                    height={24}
                                    checked={!collection.turnedoff}
                                    onChange={() => toggleTurnedOff(collection)}
                                  />
                                </div>

                                {/* Actions */}
                                <div className="flex justify-center">
                                  <Link
                                    href={`/admin/collections/${collection._id}/edit`}
                                    className="button2 p-2 rounded-full! flex"
                                  >
                                    <Edit2 className="size-4" />
                                  </Link>
                                </div>
                                {/* Drag handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab flex justify-center text-2xl"
                                >
                                  ☰
                                </div>

                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
        }
      </section>
    </div>
  );
}
