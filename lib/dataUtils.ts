import { config } from "./baseURL"

const BASE_URL = config.url

export async function getBoards(userId: string) {
    const res = await fetch(`${BASE_URL}/api/boards?user=${userId}`)

    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return res.json()
}

export async function addBoard(
    userId: string,
    title: string,
    columnNames: string[]
) {
    const columns = columnNames.map((name) => {
        return {
            title: name,
        }
    })

    try {
        await fetch(`${BASE_URL}/api/boards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, title, columns }),
        })
    } catch (error) {
        console.error(error)
    }
}
