type Props = {
    title: string
    numSubtasks: number
}

export default function TaskCard({ title, numSubtasks }: Props) {
    return (
        <div
            key={title}
            className="bg-neutral-700 rounded py-5 px-4"
        >
            <h4 className="font-bold text-neutral-100">{title}</h4>
            <span className="text-xs font-bold text-neutral-500">{`0 of ${numSubtasks} subtasks`}</span>
        </div>
    )
}
