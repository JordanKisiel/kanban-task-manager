type Props = {
    children: React.ReactNode
}

export default function ActionButton({ children }: Props) {
    return (
        <button className="bg-purple-600 py-2 px-4 rounded-full flex text-neutral-100 justify-center gap-1 items-center">
            {children}
        </button>
    )
}
