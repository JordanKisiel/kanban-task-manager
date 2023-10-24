import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

//create task
export async function POST(request: NextRequest) {
    const res = await request.json()
    const { title, description, subTasks, columnId } = res

    const result = await prisma.task.create({
        data: {
            title,
            description,
            subTasks: {
                createMany: {
                    data: subTasks,
                },
            },
            columnId,
        },
        include: {
            subTasks: true,
        },
    })

    return NextResponse.json(result)
}
