import { useState } from "react"
import ActionButton from "@/components/ui-elements/ActionButton"

type Props = {
    refetch: Function
    setIsModalOpen: Function
}

export default function ErrorModal({ refetch, setIsModalOpen }: Props) {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    function handleRetry() {
        setIsSubmitted(true)
        refetch()
        setIsModalOpen(false)
    }

    console.log("error modal")
    return (
        <div className="flex flex-col gap-6 bg-neutral-100 dark:bg-neutral-700">
            <h4 className="font-bold text-red-300 text-lg">
                There was an error retrieving your boards!
            </h4>
            <div className="flex flex-col gap-4 md:flex-row">
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-red-300"
                    bgHoverColor="hover:bg-red-100"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    handler={() => {
                        handleRetry()
                    }}
                    isDisabled={isSubmitted}
                    isLoading={isSubmitted}
                >
                    Retry
                </ActionButton>
            </div>
        </div>
    )
}
