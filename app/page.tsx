import { testUserId } from "@/testing/testingConsts"
import { redirect } from "next/navigation"
import { config } from "@/lib/baseURL"

export default function Home() {
    const BASE_URL = config.url

    //TODO:
    // -make this a login page

    redirect(`/${testUserId}`)
}
