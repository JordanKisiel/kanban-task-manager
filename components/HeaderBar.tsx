import Image from "next/image"
import Link from "next/link"
import ActionButton from "./ActionButton"
import smallLogo from "../public/kanban-app-logo.svg"
import addIcon from "../public/plus-icon.svg"
import optionsIcon from "../public/options-icon.svg"

type Props = {
    selectedBoard: string
    handleShowSideBar: Function
}

//TODO:
// change link that reveals sidebar to an invisible overlay element that only displays
// at mobile sizes (md:hidden)

export default function HeaderBar({ selectedBoard, handleShowSideBar }: Props) {
    return (
        <section className="bg-neutral-700 flex grow-0 p-4 justify-between items-center">
            <div className="flex gap-4 items-center">
                <picture className="mr-1">
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
                <div className="relative pr-3">
                    <h1 className="text-neutral-100 text-lg font-bold">
                        {selectedBoard}
                    </h1>
                    <button
                        onClick={(e) => handleShowSideBar(e)}
                        className="absolute w-full h-full top-0 md:hidden"
                    ></button>
                </div>
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
