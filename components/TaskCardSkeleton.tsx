import ItemSkeleton from "./ItemSkeleton"

export default function TaskCardSkeleton() {
    return (
        <>
            <div
                className="
                bg-neutral-100 dark:bg-neutral-700 rounded py-5 px-4 
                shadow-[0_4px_6px_0_rgba(54,78,126,0.10)] dark:shadow-none"
            >
                <ItemSkeleton
                    width="full"
                    height="medium"
                    bgColor="bg-neutral-400 dark:bg-neutral-800"
                    opacity={"opacity-100"}
                    margins={"mb-3"}
                />
                <ItemSkeleton
                    width="small"
                    height="small"
                    bgColor="bg-neutral-400 dark:bg-neutral-800"
                    opacity={"opacity-100"}
                    margins={"mb-3"}
                />
            </div>
        </>
    )
}
