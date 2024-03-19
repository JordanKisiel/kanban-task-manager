//change this once deployed
const production = {
    url: "https://jordan-kisiel-kanban.vercel.app",
}

const development = {
    url: "http://localhost:3000",
}

export const config =
    process.env.NODE_ENV === "development" ? development : production
