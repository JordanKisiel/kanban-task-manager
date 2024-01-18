import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

//get taskOrdering data for each colId
//in serialized array
export async function GET(
    request: NextRequest,
    { params }: { params: { colIds: string } }
) {
    const columnIds = JSON.parse(params.colIds)

    const columns = await prisma.$transaction({
        ...columnIds.map((columnId: number) => {
            return prisma.column.findUnique({
                where: {
                    id: columnId,
                },
            })
        }),
    })

    return NextResponse.json(columnIds)
}
