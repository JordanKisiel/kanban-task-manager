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

export async function DELETE(request: NextRequest) {
    const res = await request.json()
    let { boardId } = res

    boardId = Number(boardId)

    const result = await prisma.board.delete({
        where: {
            id: boardId,
        },
    })

    return NextResponse.json(result)
}
