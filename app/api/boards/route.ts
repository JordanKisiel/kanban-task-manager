import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    //grab user from request URL -> '/boards?user=[some userID]'
    const searchParams = request.nextUrl.searchParams
    const user = searchParams.get("user") || ""

    //get all boards and associated data base on userId
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
                include: {
                    tasks: {
                        orderBy: {
                            id: "asc",
                        },
                        include: {
                            subTasks: {
                                orderBy: {
                                    id: "asc",
                                },
                            },
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

export async function PUT(request: NextRequest) {
    const res = await request.json()

    let { boardId, title, columns } = res

    boardId = Number(boardId)

    const createColumns = columns.create.map((column: string) => {
        return {
            title: column,
        }
    })

    const deleteColumns = columns.delete.map((column: { id: number }) => {
        return column.id
    })

    const result = await prisma.$transaction([
        prisma.board.update({
            //update board title
            where: {
                id: boardId,
            },
            data: {
                title,
            },
        }),
        prisma.column.deleteMany({
            //delete columns
            where: {
                id: {
                    in: deleteColumns,
                },
            },
        }),
        ...columns.update.map((column: { id: number; title: string }) => {
            return prisma.column.update({
                //create updates for each updated column
                where: {
                    id: column.id,
                },
                data: {
                    title: column.title,
                },
            })
        }),
        prisma.board.update({
            //add new columns
            where: {
                id: boardId,
            },
            data: {
                columns: {
                    createMany: {
                        data: createColumns,
                    },
                },
            },
            include: {
                columns: true,
            },
        }),
    ])

    return NextResponse.json(result)
}
