type Props = {
    children: React.ReactNode
}

export default function ModalHeader({ children }: Props) {
    return (
        <h4 className="text-neutral-900 dark:text-neutral-100 font-bold text-lg leading-6 mb-4">
            {children}
        </h4>
    )
}
