import Link from "next/link"
import { NUM_SKELETON_BOARD_TITLES } from "@/lib/config"
import ItemSkeleton from "@/components/loading/ItemSkeleton"

type Props = {
    isPending: boolean
    boardTitles: { id: number; title: string }[]
    selectedBoardIndex: number
}

export default function BoardsList({
    isPending,
    boardTitles,
    selectedBoardIndex,
}: Props) {
    const boardsList = isPending
        ? Array(NUM_SKELETON_BOARD_TITLES)
              .fill("")
              .map((item, index) => {
                  return (
                      <ItemSkeleton
                          key={index}
                          width="full"
                          height="large"
                          bgColor="bg-neutral-400 dark:bg-neutral-800"
                          opacity={"opacity-100"}
                          margins={"ml-[1.4rem] mr-8 mb-3"}
                      />
                  )
              })
        : boardTitles.map((boardTitle, index) => {
              const isSelected = index === selectedBoardIndex

              const normalStyles = "bg-[url('../public/board-icon.svg')]"
              const selectedStyles =
                  "bg-purple-600 text-neutral-300 rounded-r-full block bg-[url('../public/board-icon-white.svg')]"

              return (
                  <Link
                      href={`?board=${index}`}
                      key={boardTitle.id}
                  >
                      <li
                          className={`py-3 pl-[3.4rem] mr-6 bg-no-repeat bg-[center_left_1.5rem] ${
                              isSelected ? selectedStyles : normalStyles
                          }`}
                      >
                          {boardTitle.title}
                      </li>
                  </Link>
              )
          })

    return <>{boardsList}</>
}
