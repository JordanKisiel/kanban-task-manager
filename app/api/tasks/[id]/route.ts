import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    //get task associated with given taskId
    const task = await prisma.task.findUnique({
        where: {
            id: Number(params.id),
        },
        include: {
            subTasks: {
                orderBy: {
                    id: "asc",
                },
            },
        },
    })

    return NextResponse.json(task)
}

//TODO: change this so that I can remove the task id from taskOrdering
//this require something like taskOrdering: {set: taskOrdering.filter(id) => id !== task.id}
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const result = await prisma.task.delete({
        where: {
            id: Number(params.id),
        },
    })

    const columnResult = await prisma.column.findUnique({
        where: {
            id: result.columnId,
        },
    })

    await prisma.column.update({
        where: {
            id: result.columnId,
        },
        data: {
            taskOrdering: {
                set: columnResult?.taskOrdering.filter(
                    (id) => id !== result.id
                ),
            },
        },
    })

    return NextResponse.json(result)
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const req = await request.json()

    let { title, description, subTasks, columnId } = req

    const deleteSubTasks = subTasks.delete.map(
        (subTask: { id: number }) => subTask.id
    )

    const createSubTasks = subTasks.create.map((subTask: string) => {
        return {
            description: subTask,
            isComplete: false,
        }
    })

    const result = await prisma.$transaction([
        prisma.task.update({
            //update task title & desc
            where: {
                id: Number(params.id),
            },
            data: {
                title,
                description,
                columnId,
            },
        }),
        prisma.subTask.deleteMany({
            //delete subtasks
            where: {
                id: {
                    in: deleteSubTasks,
                },
            },
        }),
        ...subTasks.update.map(
            (subTask: {
                id: number
                description: string
                isComplete: boolean
            }) => {
                return prisma.subTask.update({
                    //create updates for each updated subtask
                    where: {
                        id: subTask.id,
                    },
                    data: {
                        description: subTask.description,
                        isComplete: subTask.isComplete,
                    },
                })
            }
        ),
        prisma.task.update({
            //add new subtasks
            where: {
                id: Number(params.id),
            },
            data: {
                subTasks: {
                    createMany: {
                        data: createSubTasks,
                    },
                },
            },
            include: {
                subTasks: true,
            },
        }),
    ])

    return NextResponse.json(result)
}
