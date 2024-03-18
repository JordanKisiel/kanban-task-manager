import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUserIdByEmail } from "@/lib/dataUtils"

export default async function Home() {
    const session = await getServerSession(authOptions)
    const sessionEmail = session?.user?.email

    if (sessionEmail === null || sessionEmail === undefined) {
        //theoretically a user with a session from google or github
        //should have an email associated with their account
        redirect("/signin")
    }

    const userId = await getUserIdByEmail(sessionEmail)

    redirect(`/${userId}`)
}
