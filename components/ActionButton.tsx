type Props = {
    isWidthFull: boolean
    bgColor: string
    textColor: string
    textSize: string
    children: React.ReactNode
}

export default function ActionButton({
    isWidthFull,
    bgColor,
    textColor,
    textSize,
    children,
}: Props) {
    return (
        <button
            className={`py-2 px-4 rounded-full flex justify-center gap-1 items-center font-bold ${
                isWidthFull && "w-full"
            } ${bgColor} ${textColor} ${textSize}`}
        >
            {children}
        </button>
    )
}
