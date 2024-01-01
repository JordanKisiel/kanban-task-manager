"use client"

import Image from "next/image"
import smallLogo from "../public/kanban-app-logo.svg"

type Props = {
    isDarkMode: boolean
}

export default function Logo({ isDarkMode }: Props) {
    return (
        <picture className="mr-1 dark:bg-neutral-700 flex flex-row justify-center items-center">
            <source
                srcSet={`${
                    isDarkMode
                        ? "kanban-app-logo-full.svg"
                        : "kanban-app-logo-full-light.svg"
                }`}
                media="(min-width: 768px)"
                width="152px"
                height="auto"
            />
            <Image
                src={smallLogo}
                alt="kanban app logo"
                width={24}
                height={25}
                priority={true}
            />
        </picture>
    )
}
