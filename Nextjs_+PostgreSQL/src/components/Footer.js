"use client"
import Link from "next/link"

export default function Footer() {
  return (
    <footer
      className="mt-3 border-t border-myBorderColor h-fit font-poppins"
    >
      <div
        className={`
          relative
          w-full
          pt-8
          max-w-360
          px-2.5
          w375:px-5
          mx-auto
          text-myTextColorMain
          flex
          items-center
          flex-col
          gap-8

        `}
      >
        <Link
          href="/"
          className={`
            size-fit
            text-myTextColorMain
            font-semibold
            hover:text-foreground
          `}
        >
          FK STORE
        </Link>
        <div
          className={`
            w-full
            flex
            md:flex-row
            md:justify-between
            md:items-start
            flex-col
            items-center
            gap-3
            pb-3
          `}
        >
          <div
            className={`
              wrap-break-word
              text-center
              w-max
              order-1
              md:order-0
              text-wrap
            `}
          >
            © 2026 FK Store. All rights reserved.
          </div>
          <div className="order-0 md:order-1 flex flex-row gap-3">
            Developed by
            <div className="underline">
              {"FK Services"}

            </div>
          </div>
        </div>
      </div>
    </footer>

  )
}
