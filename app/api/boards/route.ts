import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    //grab user from request URL -> '/boards?user=[some userID]'
    const searchParams = request.nextUrl.searchParams
    const user = searchParams.get("user") || ""

    //get all boards based upon userId
    const boards = await prisma.board.findMany({
        where: {
            userId: user,
        },
        include: {
            columns: {
                include: {
                    tasks: {
                        include: {
                            subTasks: true,
                        },
                    },
                },
            },
        },
    })

    console.log(boards)

    return NextResponse.json(boards)
}
