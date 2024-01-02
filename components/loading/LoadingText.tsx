import { useEffect, useState } from "react"

type Props = {
    text: string
    ellipsisLength: number
    ellipsisSpeedInSec: number
}

export default function LoadingText({
    text,
    ellipsisLength,
    ellipsisSpeedInSec,
}: Props) {
    const [ellipsisDots, setEllipsisDots] = useState("")

    useEffect(() => {
        const intervalId = setInterval(() => {
            setEllipsisDots((prevDots) => {
                if (prevDots.length === ellipsisLength) {
                    return ""
                } else {
                    return `${prevDots}.`
                }
            })
        }, ellipsisSpeedInSec * 1000)

        return () => clearInterval(intervalId)
    }, [])

    return <>{`${text}${ellipsisDots}`}</>
}
