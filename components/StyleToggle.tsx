import Image from "next/image"
import Toggle from "./Toggle"
import lightModeIcon from "../public/light-mode-icon.svg"
import darkModeIcon from "../public/dark-mode-icon.svg"

type Props = {
    isLight: boolean
    toggleDarkMode: Function
}

export default function StyleToggle({ isLight, toggleDarkMode }: Props) {
    return (
        <div
            onClick={() => {
                toggleDarkMode()
            }}
            className="flex flex-row w-2/3 justify-center gap-6 items-center"
        >
            <Image
                src={lightModeIcon}
                alt="light mode icon"
                width={19}
                height={19}
            />
            <Toggle isOff={isLight} />
            <Image
                src={darkModeIcon}
                alt="dark mode icon"
                width={16}
                height={16}
            />
        </div>
    )
}
