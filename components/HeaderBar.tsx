import Image from "next/image"
import Link from "next/link"
import ActionButton from "./ActionButton"
import smallLogo from "../public/kanban-app-logo.svg"
import addIcon from "../public/plus-icon.svg"
import optionsIcon from "../public/options-icon.svg"

type Props = {
    selectedBoard: string
    isSideBarShown: boolean
    handleShowSideBar: Function
}

export default function HeaderBar({
    selectedBoard,
    isSideBarShown,
    handleShowSideBar,
}: Props) {
    return (
        <section className="bg-neutral-700 flex grow-0 p-4 justify-between items-center fixed top-0 left-0 right-0">
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
                <div className="relative pr-4">
                    <h1 className="text-neutral-100 text-lg font-bold">
                        {selectedBoard}
                    </h1>
                    <button
                        onClick={(e) => handleShowSideBar(e)}
                        className={`absolute w-full h-full top-0 bg-no-repeat bg-right ${
                            isSideBarShown
                                ? "bg-[url('../public/arrow-up.svg')]"
                                : "bg-[url('../public/arrow-down.svg')]"
                        } md:hidden md:bg-none`}
                    ></button>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <ActionButton
                    isWidthFull={false}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-base"
                    handler={() => {
                        /* does nothing */
                    }}
                >
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
