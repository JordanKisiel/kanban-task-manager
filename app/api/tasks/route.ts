import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

//get all task associated with given columnId
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const colParam = searchParams.get("colId") || ""

    const colId = Number(colParam)

    //get task associated with given taskId
    const tasks = await prisma.task.findMany({
        where: {
            columnId: colId,
        },
        include: {
            subTasks: {
                orderBy: {
                    id: "asc",
                },
            },
        },
    })

    return NextResponse.json(tasks)
}

//create task
export async function POST(request: NextRequest) {
    const req = await request.json()
    const { title, description, subTasks, columnId } = req

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
