import ColumnSkeleton from "@/components/loading/ColumnSkeleton"

type Props = {
    numColumns: number
}

export default function BoardSkeleton({ numColumns }: Props) {
    const skeletonColumns = Array(numColumns)
        .fill("")
        .map((column, index) => {
            return (
                <ColumnSkeleton
                    key={index}
                    numTaskCardSkeletons={3}
                />
            )
        })

    return (
        <div className="grid grid-flow-col auto-cols-[16rem] px-6 py-20 gap-6 overflow-auto md:pt-5 md:pb-20">
            {skeletonColumns}
        </div>
    )
}
