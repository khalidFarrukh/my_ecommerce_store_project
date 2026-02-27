import Link from "next/link"
import Image from "next/image"
import { LogoNext } from '@geist-ui/icons';


export default function Footer() {

  return (
    <footer
      className="
      mt-3
          border-t
          border-myBorderColor
          h-fit
        "
    >
      <div
        className={`
          relative
          w-full
          h-10
          pt-12
          max-w-360
          px-6
          mx-auto
          text-myTextColorMain
          flex
          items-center
          flex-col
          gap-12

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
          MEDUSA STORE
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
            `}
          >
            © 2025 Medusa Store. All rights reserved.
          </div>
          <div className="order-0 md:order-1 flex flex-row gap-3">
            Developed by
            <div className="underline">
              {"FK Techonolgies"}

            </div>
          </div>
        </div>
      </div>
    </footer>

  )
}
