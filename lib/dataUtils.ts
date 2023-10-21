import { config } from "./baseURL"

const BASE_URL = config.url

export async function getBoards(userId: string) {
    const res = await fetch(`${BASE_URL}/api/boards?user=${userId}`)

    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return res.json()
}
