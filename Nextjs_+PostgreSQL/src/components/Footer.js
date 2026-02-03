import Link from "next/link"
import Image from "next/image"
import { LogoNext } from '@geist-ui/icons';


export default function Footer() {

  return (
    <>
      <footer
        className="
          border-t
          border-[#e5e7eb]
          
        "
      >


        <div
          className=
          {`
            
            z-[40]
            relative
            w-full
            h-[600px]
            pt-24
            pb-12
            
            max-w-[1440px]
            px-6
            mx-auto
            text-[var(--myTextColorNormal)]
            flex
            flex-col

          `}
        >
          <div
            className=
            {`
            pt-12
            w-[100%]
            h-[90%]
          `}
          >
            <div
              className=
              {`
              w-[100%]
              h-[100%]
              font-poppins
              flex
              flex-col
              md:flex-row
              md:items-center
            `}
            >
              <div
                className=
                {`
                mb-6
                md:w-[50%]
                md:h-full
                md:mb-0
                flex
              `}
              >
                <Link
                  href="/"
                  className=
                  {`
                  size-fit
                  text-[var(--myTextColorNormal)]
                  font-semibold
                `}
                >
                  MEDUSA STORE
                </Link>

              </div>
              <div
                className=
                {`
                relative
                text-[var(--myTextColorNormal)]
                w-full
                md:w-[50%]
                h-full
              `}
              >
                <div
                  className=
                  {`
                    w-full
                    absolute
                    flex
                    justify-start
                    md:justify-end
                    gap-x-10
                    md:gap-20
                    h-full
                    right-0
                  `}
                >

                  <div
                    className=
                    {`
                    w-fit
                  `}
                  >
                    <ul className=
                      {`
                        leading-7
                      text-[11px]
                    `}
                    >
                      <li
                        className=
                        {`
                        font-semibold
                        text-black
                      `}
                      >
                        Categories
                      </li>
                      <li>
                        <Link href="/"
                          className=
                          {`
                          font-medium
                          text-black
                        `}
                        >
                          Clothing
                        </Link>
                      </li>
                      <li className="pl-6">
                        <Link href="/">
                          Hoodies
                        </Link>
                      </li>
                      <li className="pl-6">
                        <Link href="/">
                          Accessories
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          Audio
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          Furniture
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div
                    className=
                    {`
                      w-fit
                    `}
                  >
                    <ul className=
                      {`
                        leading-7
                      text-[11px]
                    `}
                    >
                      <li
                        className=
                        {`
                            font-semibold
                            text-black
                          `}
                      >
                        Collections
                      </li>
                      <li>
                        <Link href="/">
                          Latest Drops
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          Weekly Picks
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          Sale
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div
            className=
            {`
            w-[100%]
            h-[10%]
            text-[#9ca3af]
            text-[13px]
            flex
            items-center
            relative
            
          `}
          >
            <div
              className=
              {`
              break-words
              w-full
              whitespace-normal
            `}
            >
              © 2025 Medusa Store. All rights reserved.
            </div>
            <div
              className=
              {`
              relative
              break-words
              w-full
              whitespace-normal
              text-right
              right-16
            `}
            >
              Powered by
            </div>
            <div
              className=
              {`
              absolute
              right-0
              flex
              
            `}
            >
              <div
                className=
                {`
                relative
                flex
              `}
              >
                Me &
                <Link
                  href="https://nextjs.org"
                  className=""
                >
                  <Image
                    src="./nextjsicon.svg"
                    alt="next js logo"
                    width={50}
                    height={50}
                    className="w-[20px] ml-[10px]"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
