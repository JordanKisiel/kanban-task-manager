type Props = {
    isWidthFull: boolean
    bgColor: string
    textColor: string
    textSize: string
    handler?: Function
    isSubmit?: boolean
    children: React.ReactNode
}

export default function ActionButton({
    isWidthFull,
    bgColor,
    textColor,
    textSize,
    handler,
    isSubmit,
    children,
}: Props) {
    return (
        <button
            type={isSubmit ? "submit" : "button"}
            onClick={(e) => {
                if (handler) handler()
                e.preventDefault()
            }}
            className={`py-2 px-5 rounded-full flex justify-center gap-1 items-center font-bold ${
                isWidthFull && "w-full"
            } ${bgColor} ${textColor} ${textSize}`}
        >
            {children}
        </button>
    )
}
