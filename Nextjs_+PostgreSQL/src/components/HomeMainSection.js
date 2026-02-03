"use client"
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Card1 from "./Card1";

export default function HomeMainSection({ collection_name, collection_id }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (products.length === 0)
      fetch("/api/collections/" + collection_id + "?offset=0&limit=3")
        .then((res) => res.json())
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    console.log(products);
  }, [products])

  return (
    <>
      <section
        className=
        {`
          w-full
        `}
      >
        <div
          className=
          {`
            w-full
            mb-12
            lg:mb-24
            mx-auto
          `}
        >
          <div
            className=
            {`
              flex
              items-center
              relative
              text-[16px]
              text-[var(--myTextColorHeading)]
              font-medium
            `}
          >
            <h1>
              {collection_name}
            </h1>

            <Link
              href={"collections/" + collection_id}
              className=
              {`
                absolute
                flex
                items-center
                justify-center
                right-0
                text-[14px]
                text-[var(--myTextColorBlue)]
                font-bold
                group
              `}
            >
              <div>
                View all
              </div>
              <ArrowUpRight
                className=
                {`
                  transiion-all
                  duration-300
                  w-[20px]
                  rotate-0
                  group-hover:rotate-45
                `}
              />
            </Link>

          </div>
          <div
            className=
            {`
              mt-7
              grid
              grid-cols-2
              lg:grid-cols-3
              gap-x-6
              gap-y-22
              w-full
            `}
          >
            {
              products.map((item, index) => {
                return (
                  <Card1
                    key={index}
                    id={index}
                    productObj={item}
                  />
                )
              })
            }
          </div>
        </div>
      </section>
    </>
  );
}