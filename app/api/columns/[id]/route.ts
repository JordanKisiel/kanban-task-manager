import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const req = await request.json()

    const result = await prisma.column.update({
        where: {
            id: Number(params.id),
        },
        data: {
            taskOrdering: req.taskOrdering,
        },
    })

    return NextResponse.json(result)
}
