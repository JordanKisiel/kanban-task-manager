type Props = {
    width: "small" | "medium" | "full"
    height: "small" | "medium" | "large"
}

export default function ItemSkeleton({ width, height }: Props) {
    const widthSizes = {
        small: "w-[50%]",
        medium: "w-[75%]",
        full: "",
    }

    const heightSizes = {
        small: "h-4",
        medium: "h-6",
        large: "h-8",
    }

    return (
        <div
            className={`${widthSizes[width]} ${heightSizes[height]} block bg-purple-600 ml-[1.4rem] mr-8 mb-3 rounded animate-pulse-fast`}
        ></div>
    )
}
