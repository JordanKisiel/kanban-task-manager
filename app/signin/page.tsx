"use client"

import { useEffect } from "react"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ActionButton from "@/components/ui-elements/ActionButton"
import googleIcon from "@/public/google-icon.svg"
import githubIcon from "@/public/github-mark.svg"
import kanbanLogo from "@/public/kanban-app-logo-full.svg"

export default function Login() {
    const session = useSession()
    const router = useRouter()

    //needs to be inside useEffect to prevent
    //location not defined error
    useEffect(() => {
        if (session) {
            router.push("/")
        }
    }, [session])

    return (
        <div className="flex flex-col justify-center items-center min-h-screen gap-12 dark:bg-neutral-800">
            <Image
                src={kanbanLogo}
                alt="Kanban logo"
                width={150}
            />
            <div
                className="flex flex-col items-center gap-4 px-12 pt-6 pb-10 rounded-lg bg-neutral-700 w-3/4 md:w-1/2
                           lg:w-2/5 xl:w-1/5"
            >
                <p className="text-neutral-900 dark:text-neutral-100 font-bold text-lg leading-6">
                    Signin
                </p>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-base"
                    handler={() => {
                        signIn("google")
                    }}
                >
                    <Image
                        src={googleIcon}
                        alt="Google icon"
                        width={16}
                        height={16}
                    />
                    <span className="ml-2">Google</span>
                </ActionButton>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-base"
                    handler={() => {
                        signIn("github")
                    }}
                >
                    <Image
                        src={githubIcon}
                        alt="Github icon"
                        width={16}
                        height={16}
                    />
                    <span className="ml-2">Github</span>
                </ActionButton>
            </div>
        </div>
    )
}
