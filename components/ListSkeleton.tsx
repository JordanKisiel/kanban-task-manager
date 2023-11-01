//TODO: finish skeleton list component based upon:
// https://dev.to/jobpick/how-to-create-a-skeleton-loader-in-tailwindcss-38gh

type Props = {
    numLines: number
}

export default function ListSkeleton({ numLines }: Props) {
    const skeletonList = Array(numLines)
        .fill("")
        .map((line) => {
            return <li></li>
        })

    return <ul>{skeletonList}</ul>
}
