import Image from "next/image"
import TaskColumn from "./TaskColumn"
import ActionButton from "./ActionButton"
import addIconDark from "../public/plus-icon.svg"
import addIconLight from "../public/plus-icon-gray.svg"
import { Column } from "../types"

type Props = {
    columns: Column[]
    handleSwitchModalMode: Function
    setIsModalOpen: Function
    isDarkMode: boolean
}

export default function Board({
    columns,
    handleSwitchModalMode,
    setIsModalOpen,
    isDarkMode,
}: Props) {
    const taskColumns = columns.map((column, index) => {
        return (
            <TaskColumn
                key={column.title}
                columnIndex={index}
                title={column.title}
                tasks={column.tasks}
            />
        )
    })

    return (
        <>
            {columns.length === 0 ? (
                <div className="flex flex-col grow items-center min-h-fit justify-center">
                    <div className="flex flex-col items-center">
                        <p className="text-neutral-500 text-center w-[80%] text-lg font-bold leading-6 mb-6 -mt-12">
                            This board is empty. Create a new column to get
                            started.
                        </p>
                        <ActionButton
                            isWidthFull={false}
                            bgColor="bg-purple-600"
                            textColor="text-neutral-100"
                            textSize="text-base"
                            handler={() => {
                                handleSwitchModalMode("editBoard")
                                setIsModalOpen(true)
                            }}
                        >
                            <Image
                                className="w-[5%] mt-[0.2rem]"
                                src={isDarkMode ? addIconDark : addIconLight}
                                alt="Add icon"
                            />
                            <span>Add New Column</span>
                        </ActionButton>
                    </div>
                </div>
            ) : (
                <div className="grid grid-flow-col auto-cols-[16rem] px-4 py-20 gap-6 overflow-auto md:pt-5 md:pb-20">
                    {taskColumns}
                    <div className="flex flex-col pt-[2.3rem] h-full justify-center">
                        <button
                            onClick={() => {
                                handleSwitchModalMode("editBoard")
                                setIsModalOpen(true)
                            }}
                            className="flex flex-row text-neutral-500 dark:text-neutral-400 bg-neutral-300/50 dark:bg-neutral-700/20 text-2xl font-bold items-center gap-2 w-full h-full justify-center rounded"
                        >
                            <Image
                                className="mt-[0.5rem] opacity-50"
                                src={isDarkMode ? addIconDark : addIconLight}
                                alt="Add icon"
                            />
                            New Column
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
