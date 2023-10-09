type Props = {
    isOff: boolean
}

export default function Toggle({ isOff }: Props) {
    return (
        <div className="bg-purple-600 w-[2.5rem] h-full rounded-full relative">
            <div
                className={`bg-neutral-300 w-1/3 aspect-square rounded-full absolute -top-1/2 mt-[30%] ${
                    isOff ? "left-[7%]" : "right-[7%]"
                }`}
            ></div>
        </div>
    )
}
