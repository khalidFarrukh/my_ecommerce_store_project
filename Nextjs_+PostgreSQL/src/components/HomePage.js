"use client";
import HomeMainSection from "@/components/HomeMainSection";
import { useGlobalToast } from "@/context/GlobalToastContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function HomePage({ collections }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToast } = useGlobalToast();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "only_admin_allowed") {
      // ✅ create clean params
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");


      // ✅ replace URL (no reload)
      const query = params.toString();
      router.replace(query ? `/signIn?${query}` : "/");
      setToast({
        id: Date.now(),
        message: "You tried to open an admin page.",
        type: "error",
      });
    }
  }, [searchParams, router]);
  return (
    <>
      <div
        classcategory=
        {`
          z-[1]
          relative
          w-full
          bg-white
          my-5
          flex
          flex-col
          items-center
        `}
      >
        <div className=
          {`
            mt-6
            lg:mt-12
          `} />
        {
          collections.map((collection, index) => {

            if (Boolean(!collection?.turnedoff && (collection?.hasProducts || collection?.slug === "all-products"))) {
              // console.log()
              return (
                <HomeMainSection key={index} collection_name={collection.name} collection_slug={collection.slug} />
              )
            }
          })
        }
      </div>
    </>
  )
}
