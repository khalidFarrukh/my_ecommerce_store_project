import HomeMainSection from "@/components/HomeMainSection";
import { collections } from "./api/data";

export default function Home() {

  return (
    <>
      <main
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
            if (!collection?.turnedoff) {
              return (
                <HomeMainSection key={index} collection_name={collection.name} collection_id={collection.id} />
              )
            }
          })
        }
      </main>
    </>
  )
}
