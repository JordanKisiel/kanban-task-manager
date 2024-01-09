import QueryProvider from "@/contexts/QueryProvider"
import "./globals.css"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { getServerSession } from "next-auth"
import SessionProvider from "@/contexts/SessionProvider"
import { redirect } from "next/navigation"

const font = Plus_Jakarta_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Kanban Task Manager - Frontend Mentor Challenge",
    description:
        "A kanban style task manger app built with design provided from Frontend Mentor",
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession()

    //if user isn't signed in, immediately redirect them to
    //the signin page
    if (!session) {
        redirect("/api/auth/signin")
    }

    return (
        <html
            lang="en"
            className="dark"
        >
            <body
                className={`${font.className} antialiased bg-neutral-200 dark:bg-neutral-800 min-h-screen m-0 md:overflow-hidden`}
            >
                <QueryProvider>
                    <SessionProvider session={session}>
                        {children}
                    </SessionProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryProvider>
            </body>
        </html>
    )
}
