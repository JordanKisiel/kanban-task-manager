import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    //grab user from request URL -> '/boards?user=[some userId]'
    const searchParams = request.nextUrl.searchParams
    const user = searchParams.get("user") || ""

    //get all boards and associated data based on userId
    const boards = await prisma.board.findMany({
        where: {
            userId: user,
        },
        orderBy: {
            id: "asc",
        },
        include: {
            columns: {
                orderBy: {
                    id: "asc",
                },
            },
        },
    })

    return NextResponse.json(boards)
}

//create board
export async function POST(request: NextRequest) {
    const res = await request.json()
    const { userId, title, columns } = res

    const result = await prisma.board.create({
        data: {
            userId,
            title,
            columns: {
                createMany: {
                    data: columns,
                },
            },
        },
        include: {
            columns: true,
        },
    })

    return NextResponse.json(result)
}
