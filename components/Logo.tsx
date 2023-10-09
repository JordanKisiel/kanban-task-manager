import Image from "next/image"
import smallLogo from "../public/kanban-app-logo.svg"

export default function Logo() {
    return (
        <picture className="mr-1 bg-neutral-700 flex flex-row justify-center items-center">
            <source
                srcSet="kanban-app-logo-full.svg"
                media="(min-width: 768px)"
                width="152px"
                height="auto"
            />
            <Image
                src={smallLogo}
                alt="kanban app logo"
            />
        </picture>
    )
}
