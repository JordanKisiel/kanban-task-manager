import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request: NextRequest) {
    const req = await request.json()

    const result = await prisma.$transaction([
        ...req.taskOrderings.map(
            (orderingData: { id: number; taskOrdering: number[] }) => {
                return prisma.column.update({
                    where: {
                        id: orderingData.id,
                    },
                    data: {
                        taskOrdering: orderingData.taskOrdering,
                    },
                })
            }
        ),
        ...req.taskGroupings.map(
            (groupingData: { taskId: number; columnId: number }) => {
                return prisma.task.update({
                    where: {
                        id: groupingData.taskId,
                    },
                    data: {
                        columnId: groupingData.columnId,
                    },
                })
            }
        ),
    ])

    return NextResponse.json(result)
}
