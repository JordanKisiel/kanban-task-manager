import { useRouter } from "next/navigation"

type Props = {
    selectedBoardIndex: number
    setIsModalOpen: Function
    children: React.ReactNode
}

export default function Modal({
    selectedBoardIndex,
    setIsModalOpen,
    children,
}: Props) {
    const router = useRouter()

    return (
        <div
            onClick={() => {
                setIsModalOpen(false)
                router.push(`/?board=${selectedBoardIndex}`)
            }}
            className="bg-neutral-900/50 dark:bg-neutral-900/90 fixed flex flex-col items-center inset-0 justify-center px-4 py-12 z-10"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    bg-neutral-100 dark:bg-neutral-700 
                    px-6 pt-6 pb-7 
                    w-full gap-3 
                    rounded-lg shadow-[0_10px_20px_0_rgba(54,78,126,0.25)] 
                    overflow-auto overscroll-contain 
                    md:w-1/2
                    lg:w-2/5
                    xl:w-1/4"
            >
                {children}
            </div>
        </div>
    )
}
