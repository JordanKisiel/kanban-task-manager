export function truncate(text: string, maxLength: number, numEllipsis: number) {
    if (text.length <= maxLength) {
        return text
    }

    const truncatedText =
        text.slice(0, maxLength - numEllipsis) + ".".padEnd(numEllipsis, ".")
    return truncatedText
}
