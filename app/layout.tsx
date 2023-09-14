import "./globals.css"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"

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
        <html lang="en">
            <body
                className={`${font.className} bg-neutral-800 min-h-screen m-0`}
            >
                {children}
            </body>
        </html>
    )
}
