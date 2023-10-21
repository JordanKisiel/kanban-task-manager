//change this once deployed
const production = {
    url: "https://<project-name>.vercel.app",
}

const development = {
    url: "http://localhost:3000",
}

export const config =
    process.env.NODE_ENV === "development" ? development : production
