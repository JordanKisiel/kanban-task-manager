type Props = {
    fill: string
    scale: number
    isLoading: boolean
}

export default function GrabIcon({ fill, scale, isLoading }: Props) {
    return (
        <svg
            className={`${
                isLoading ? "animate-pulse-loading" : "animate-none"
            }`}
            width={`${scale * 88}`}
            height={`${scale * 133}`}
            viewBox="0 0 88 133"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="14.5"
                cy="14.5"
                r="14.5"
                fill={fill}
            />
            <circle
                cx="73.5"
                cy="14.5"
                r="14.5"
                fill={fill}
            />
            <circle
                cx="14.5"
                cy="66.5"
                r="14.5"
                fill={fill}
            />
            <circle
                cx="73.5"
                cy="66.5"
                r="14.5"
                fill={fill}
            />
            <circle
                cx="14.5"
                cy="118.5"
                r="14.5"
                fill={fill}
            />
            <circle
                cx="73.5"
                cy="118.5"
                r="14.5"
                fill={fill}
            />
        </svg>
    )
}
