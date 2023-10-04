type Props = {
    handleBackToBoard: Function
    children: React.ReactNode
}

export default function Modal({ handleBackToBoard, children }: Props) {
    //TODO:
    //  -parameterize MenuButton component to accept arrays of "actionNames" (string[]) and "actions" (Function[])
    //  -have board modals pop up when appropriate buttons pressed
    //  -style for other screen sizes
    //  -follow prisma tutorial
    //  -add CRUD operations for boards and tasks

    return (
        <div
            onClick={() => handleBackToBoard()}
            className="bg-neutral-900/90 absolute flex flex-col items-center inset-0 justify-center px-4 py-12"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-700 px-6 pt-6 pb-6 w-full gap-3 rounded-lg shadow-[0_10px_20px_0_rgba(54,78,126,0.25)] overflow-auto overflow-y-scroll overscroll-contain"
            >
                {children}
            </div>
        </div>
    )
}
