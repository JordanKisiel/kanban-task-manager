import { NextRequest, NextResponse } from "next/server"
import { useParams } from "next/navigation"
import prisma from "@/lib/prisma"

//grab id from request URL -> '/boards/[id]'
function getBoardId() {
    const { id } = useParams()

    const boardId = Number(id)

    return boardId
}

//get board data associated with boardId
export async function GET(request: NextRequest) {
    const board = await prisma.board.findUnique({
        where: {
            id: getBoardId(),
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

export async function DELETE(request: NextRequest) {
    const result = await prisma.board.delete({
        where: {
            id: getBoardId(),
        },
    })

    return NextResponse.json(result)
}

export async function PUT(request: NextRequest) {
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
                id: getBoardId(),
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
                id: getBoardId(),
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
