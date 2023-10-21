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
    const styles = `py-2 px-5 rounded-full flex justify-center gap-1 items-center font-bold ${
        isWidthFull && "w-full"
    } ${bgColor} ${textColor} ${textSize}`

    if (isSubmit) {
        return (
            <button
                type={isSubmit ? "submit" : "button"}
                className={styles}
            >
                {children}
            </button>
        )
    }
    return (
        <button
            onClick={(e) => {
                if (handler) handler()
                e.preventDefault()
            }}
            className={styles}
        >
            {children}
        </button>
    )
}
