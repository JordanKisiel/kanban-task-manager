import HeaderBar from "../components/HeaderBar"
import Board from "../components/Board"

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen">
            <HeaderBar selectedBoard="Platform Launch" />
            <Board />
        </main>
    )
}
