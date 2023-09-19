"use client"

import { useState } from "react"
import Image from "next/image"
import TaskColumn from "./TaskColumn"
import ActionButton from "./ActionButton"
import TaskCard from "./TaskCard"
import addIcon from "../public/plus-icon.svg"
import { Column } from "../types"

type Props = {
    columns: Column[]
}

export default function Board({ columns }: Props) {
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
                        <ActionButton>
                            <Image
                                className="w-[5%] mt-[0.2rem]"
                                src={addIcon}
                                alt="Add icon"
                            />
                            <span>Add New Column</span>
                        </ActionButton>
                    </div>
                </div>
            ) : (
                <div className="grid grid-flow-col auto-cols-[16rem] px-4 py-20 overflow-scroll gap-6">
                    {taskColumns}
                </div>
            )}
        </>
    )
}
