type Props = {
    children: React.ReactNode
}

export default function ActionButton({ children }: Props) {
    return (
        <button className="bg-purple-600 py-2 px-4 rounded-full">
            {children}
        </button>
    )
}
