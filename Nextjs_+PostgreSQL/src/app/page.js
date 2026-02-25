import HomeMainSection from "@/components/HomeMainSection";
import { convertTextStringToDashString, getCollections } from "@/utils/utilities";


export default async function Home() {

  let collections = await getCollections();

  collections = collections.sort((a, b) => {
    return a._id.localeCompare(b._id);
  });

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

            if (Boolean(!collection?.turnedoff)) {
              const collectionRoute = convertTextStringToDashString(collection.name);
              return (
                <HomeMainSection key={index} collection_name={collection.name} collection_route={collectionRoute} />
              )
            }
          })
        }
      </main>
    </>
  )
}
