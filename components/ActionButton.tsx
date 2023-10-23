type Props = {
    isWidthFull: boolean
    bgColor: string
    textColor: string
    textSize: string
    isDisabled?: boolean
    handler?: Function
    isSubmit?: boolean
    children: React.ReactNode
}

export default function ActionButton({
    isWidthFull,
    bgColor,
    textColor,
    textSize,
    isDisabled,
    handler,
    isSubmit,
    children,
}: Props) {
    const styles = `py-2 px-5 rounded-full flex justify-center gap-1 items-center font-bold disabled:opacity-50 ${
        isWidthFull && "w-full"
    }  ${bgColor} ${textColor} ${textSize}`

    if (isSubmit) {
        return (
            <button
                type="submit"
                disabled={isDisabled}
                className={styles}
            >
                {children}
            </button>
        )
    }
    return (
        <button
            type="button"
            disabled={isDisabled}
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
