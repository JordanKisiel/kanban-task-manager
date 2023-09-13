import Image from "next/image"
import ActionButton from "./ActionButton"
import smallLogo from "../public/kanban-app-logo.svg"
import addIcon from "../public/plus-icon.svg"
import optionsIcon from "../public/options-icon.svg"

type Props = {
    selectedBoard: string
}

export default function HeaderBar({ selectedBoard }: Props) {
    return (
        <section className="bg-neutral-700 flex p-4 justify-between items-center">
            <div className="flex gap-4 items-center">
                <picture>
                    <source
                        srcSet="kanban-app-logo-full.svg"
                        media="(min-width: 768px)"
                        width="auto"
                        height="auto"
                    />
                    <Image
                        src={smallLogo}
                        alt="kanban app logo"
                    />
                </picture>
                <h1 className="text-neutral-100 text-lg">{selectedBoard}</h1>
            </div>
            <div className="flex gap-4 items-center">
                <ActionButton>
                    <Image
                        src={addIcon}
                        alt="add icon"
                    />
                </ActionButton>
                <Image
                    src={optionsIcon}
                    alt="options icon"
                />
            </div>
        </section>
    )
}
