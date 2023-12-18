type Props = {
    width: "small" | "medium" | "full"
    height: "small" | "medium" | "large"
    bgColor: string
    opacity: string
    margins: string
}

export default function ItemSkeleton({
    width,
    height,
    bgColor,
    opacity,
    margins,
}: Props) {
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
            className={`${widthSizes[width]} ${heightSizes[height]} ${bgColor} ${opacity} ${margins} block rounded animate-pulse-fast`}
        ></div>
    )
}
