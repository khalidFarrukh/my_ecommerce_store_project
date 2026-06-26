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
import { useSession } from "next-auth/react";
import { useGlobalToast } from "@/context/GlobalToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminCollectionsClient() {
  const router = useRouter();
  // const { sessionData: session } = useSessionExpiry();


  const { data: session } = useSession();
  const { setToast } = useGlobalToast();
  // const [collections, setCollections] = useState([]);

  // const [loadingCollections, setLoadingCollections] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // const fetchCollections = async () => {
  //   try {
  //     setLoadingCollections(true);
  //     const res = await fetch("/api/admin/collections");

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message);

  //     setCollections(data.data || []);
  //   } catch (err) {
  //     console.error(err);
  //     setTimeout(() => {
  //       setToast({
  //         id: Date.now(),
  //         message: err.message,
  //         type: "error"
  //       });
  //     }, 0);

  //   } finally {
  //     setLoadingCollections(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCollections();
  // }, []);

  const { data: collections, isLoading: loadingCollections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/admin/collections");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      return data.data || [];
    },
    onError: (err) => {
      setToast({
        id: Date.now(),
        message: err.message,
        type: "error",
      });
    },
  });

  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async (collection) => {
      setTogglingId(collection._id);
      const res = await fetch(`/api/admin/collections/${collection._id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...collection,
          turnedoff: !collection.turnedoff,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update");
    },

    onSuccess: () => {
      setToast({
        id: Date.now(),
        message: "Toggle successful",
        type: "info",
      });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (err) => {
      setToast({
        id: Date.now(),
        message: err.message,
        type: "error",
      });
    },
    onSettled: () => {
      setTogglingId(null);
    },
  });




  // useEffect(() => {
  //   console.log("Collections updated:", collections);
  // }, [collections]);

  const reorderMutation = useMutation({
    mutationFn: async (updated) => {
      await fetch("/api/admin/collections/reorder", {
        method: "PUT",
        body: JSON.stringify(updated.map(({ _id, orderNo }) => ({ _id, orderNo }))),
      });
    },

    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: ["collections"] });

      const previous = queryClient.getQueryData(["collections"]);

      queryClient.setQueryData(["collections"], updated);

      return { previous };
    },

    onError: (err, _, context) => {
      setToast({
        id: Date.now(),
        message: err.message,
        type: "error",
      });

      queryClient.setQueryData(["collections"], context.previous);
    },

    onSettled: () => {

      setToast({
        id: Date.now(),
        message: "re-order successful",
        type: "info",
      });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(collections);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    const updated = items.map((item, index) => ({
      ...item,
      orderNo: index + 1,
    }));

    reorderMutation.mutate(updated);
  };

  return (
    <div className="space-y-6 min-h-[1000px]">
      <AdminTabContentHeader
        heading="Collections"
        description={`Welcome back, ${session?.user?.email}`}
        right_content={
          <button
            onClick={async () => {
              if (isCreating) return;

              try {
                setIsCreating(true);

                const res = await fetch("/api/admin/collections/new", {
                  method: "POST",
                });

                const data = await res.json();

                if (!res.ok) throw new Error(data.message);

                router.push(`/admin/collections/${data.id}/edit`);
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
                setIsCreating(false);
              }
            }}
            className="button1 w-40 h-10 cursor-pointer disabled:opacity-50 disabled:cursor-none"
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
              <div className="min-w-[700px] w-full max-w-[1154px] text-sm">
                <div className="grid grid-cols-[250px_1fr_120px_120px_50px] border-b border-myBorderColor py-2 font-medium">
                  <div>ID</div>
                  <div>Name</div>
                  <div>Visibility</div>
                  <div className="text-center">Actions</div>
                  <div></div> {/* drag */}
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="collections">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className=" max-h-[calc(100vh-60px-24px-250px)]">
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
                                <div
                                  {...provided.dragHandleProps}
                                  className=" truncate">{collection._id}</div>

                                {/* Name */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="truncate">
                                  {collection.name || "Untitled"}
                                </div>

                                {/* Toggle */}
                                <div className="w-fit">
                                  {togglingId === collection._id ? (
                                    <LoadingSpinner text="" className={"w-6! h-6!"} />
                                  ) : (
                                    <ToggleSlideButton
                                      width={44}
                                      height={24}
                                      checked={!collection.turnedoff}
                                      onChange={() => toggleMutation.mutate(collection)}
                                    />
                                  )}
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
