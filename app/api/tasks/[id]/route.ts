import { NextRequest, NextResponse } from "next/server"
import { useParams } from "next/navigation"
import prisma from "@/lib/prisma"

function getTaskId() {
    //grab taskId from request URL -> '/tasks/[taskId]'
    const { id } = useParams()

    const taskId = Number(id)

    return taskId
}

export async function GET(request: NextRequest) {
    //get task associated with given taskId
    const task = await prisma.task.findUnique({
        where: {
            id: getTaskId(),
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

export async function DELETE(request: NextRequest) {
    const result = await prisma.task.delete({
        where: {
            id: getTaskId(),
        },
    })

    return NextResponse.json(result)
}

export async function PUT(request: NextRequest) {
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
                id: getTaskId(),
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
                id: getTaskId(),
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
