import Providers from "@/contexts/providers"
import "./globals.css"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const font = Plus_Jakarta_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Kanban Task Manager - Frontend Mentor Challenge",
    description:
        "A kanban style task manger app built with design provided from Frontend Mentor",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="en"
            className="dark"
        >
            <body
                className={`${font.className} antialiased bg-neutral-200 dark:bg-neutral-800 min-h-screen m-0 md:overflow-hidden`}
            >
                <Providers>
                    {children}
                    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                </Providers>
            </body>
        </html>
    )
}
