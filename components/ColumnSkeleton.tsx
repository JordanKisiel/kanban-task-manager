import ItemSkeleton from "./ItemSkeleton"
import TaskCardSkeleton from "./TaskCardSkeleton"

type Props = {
    numTaskCardSkeletons: number
}

export default function ColumnSkeleton({ numTaskCardSkeletons }: Props) {
    const taskCardSkeletons = Array(numTaskCardSkeletons)
        .fill("")
        .map((taskCardSkeleton, index) => {
            return <TaskCardSkeleton key={index} />
        })

    return (
        <div>
            <div className="flex flex-row items-start gap-3 mb-4">
                <ItemSkeleton
                    width="medium"
                    height="small"
                />
            </div>
            <div className="flex flex-col gap-6">{taskCardSkeletons}</div>
        </div>
    )
}
