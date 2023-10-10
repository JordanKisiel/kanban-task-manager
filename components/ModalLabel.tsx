type Props = {
    children: React.ReactNode
    htmlFor: string
}

export default function ModalLabel({ children, htmlFor }: Props) {
    return (
        <label
            htmlFor={htmlFor}
            className="text-neutral-500 dark:text-neutral-100 text-xs block mb-2 font-bold"
        >
            {children}
        </label>
    )
}
