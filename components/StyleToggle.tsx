import Image from "next/image"
import Toggle from "./Toggle"
import lightModeIcon from "../public/light-mode-icon.svg"
import darkModeIcon from "../public/dark-mode-icon.svg"

type Props = {
    isLight: boolean
}

export default function StyleToggle({ isLight }: Props) {
    return (
        <div className="flex flex-row w-2/3 justify-center gap-6">
            <Image
                src={lightModeIcon}
                alt="light mode icon"
            />
            <Toggle isOff={true} />
            <Image
                src={darkModeIcon}
                alt="dark mode icon"
            />
        </div>
    )
}
