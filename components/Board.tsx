import Image from "next/image"
import Column from "./Column"
import ActionButton from "./ActionButton"
import addIcon from "../public/plus-icon.svg"
import { Task } from "../types"

export default function Board() {
    const columnColors = ["bg-[#49C4E5]", "bg-[#8471F2]", "bg-[#67E2AE]"]

    const columnNames = ["Todo", "Doing", "Done"]

    const tasksData = [
        {
            title: "Build UI for onboarding flow",
            description: "Description of the onboarding flow task",
            subtasks: [
                {
                    isCompleted: false,
                    description: "Description of the first subtask",
                },
                {
                    isCompleted: false,
                    description: "Description of the second subtask",
                },
                {
                    isCompleted: false,
                    description: "Description of the third subtask",
                },
            ],
            column: "Todo",
        },
        {
            title: "Build UI for search",
            description: "Description of the search task",
            subtasks: [
                {
                    isCompleted: false,
                    description: "Description of the first subtask",
                },
            ],
            column: "Todo",
        },
        {
            title: "Build settings UI",
            description: "Description of the settings task",
            subtasks: [
                {
                    isCompleted: false,
                    description: "Description of the first subtask",
                },
                {
                    isCompleted: false,
                    description: "Description of the second subtask",
                },
            ],
            column: "Todo",
        },
        {
            title: "QA and test all major user journeys",
            description: "Description of the onboarding flow task",
            subtasks: [
                {
                    isCompleted: false,
                    description: "Description of the first subtask",
                },
                {
                    isCompleted: false,
                    description: "Description of the second subtask",
                },
            ],
            column: "Todo",
        },
    ]

    const tasks = tasksData.map(({ title, description, subtasks, column }) => {
        return (
            <div
                key={title}
                className="bg-neutral-700 rounded py-5 px-4"
            >
                <h4 className="font-bold text-neutral-100">{title}</h4>
                <span className="text-xs font-bold text-neutral-500">{`0 of ${subtasks.length} subtasks`}</span>
            </div>
        )
    })

    const columns = columnNames.map((name, index) => {
        return (
            <div key={name}>
                <div className="flex flex-row items-center gap-3 mb-4">
                    <div
                        className={`${columnColors[index]} w-[1rem] h-[1rem] rounded-full`}
                    ></div>
                    <h3 className="text-[0.82rem] uppercase tracking-[0.12em] text-neutral-500 font-bold">{`${name} (${tasks.length})`}</h3>
                </div>
                <div className="flex flex-col gap-6">{tasks}</div>
            </div>
        )
    })

    //TODO: style columns and tasks

    return (
        <>
            {tasksData.length === 0 ? (
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
                <div className="grid grid-flow-col auto-cols-[16rem] px-4 py-7 overflow-scroll gap-6">
                    {columns}
                </div>
            )}
        </>
    )
}
