import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

//get board data associated with boardId
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const boardId = Number(params.id)

    const board = await prisma.board.findUnique({
        where: {
            id: boardId,
        },
        include: {
            columns: {
                orderBy: {
                    id: "asc",
                },
            },
        },
    })

    return NextResponse.json(board)
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const boardId = Number(params.id)

    const result = await prisma.board.delete({
        where: {
            id: boardId,
        },
    })

    return NextResponse.json(result)
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const boardId = Number(params.id)

    const res = await request.json()

    let { title, columns } = res

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
