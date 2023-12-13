import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

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

export async function DELETE(request: NextRequest) {
    const req = await request.json()
    let { taskId } = req

    taskId = Number(taskId)

    const result = await prisma.task.delete({
        where: {
            id: taskId,
        },
    })

    return NextResponse.json(result)
}

export async function PUT(request: NextRequest) {
    console.log("PUT called")

    const req = await request.json()

    console.log(req.subTasks.update)

    let { taskId, title, description, subTasks, columnId } = req

    taskId = Number(taskId)

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
                id: taskId,
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
                id: taskId,
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
