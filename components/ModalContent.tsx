import ViewTaskModal from "./ViewTaskModal"
import EditTaskModal from "./EditTaskModal"
import DeleteModal from "./DeleteModal"
import AddTaskModal from "./AddTaskModal"
import AddBoardModal from "./AddBoardModal"
import EditBoardModal from "./EditBoardModal"

type ViewTaskProps = {
    mode: "viewTask"
    selectedBoardIndex: number
    columnIndex: number
    taskIndex: number
    setModalMode: Function
    setIsModalOpen: Function
}

type AddTaskProps = {
    mode: "addTask"
    selectedBoardIndex: number
    setIsModalOpen: Function
}

type EditTaskProps = {
    mode: "editTask"
    selectedBoardIndex: number
    columnIndex: number
    taskIndex: number
    setModalMode: Function
    setIsModalOpen: Function
}

type DeleteTaskProps = {
    mode: "deleteTask"
    selectedBoardIndex: number
    columnIndex: number
    taskIndex: number
    setIsModalOpen: Function
}

type AddBoardProps = {
    mode: "addBoard"
    setIsModalOpen: Function
}

type EditBoardProps = {
    mode: "editBoard"
    selectedBoardIndex: number
    setIsModalOpen: Function
}

type DeleteBoardProps = {
    mode: "deleteBoard"
    selectedBoardIndex: number
    setIsModalOpen: Function
}

type Props =
    | ViewTaskProps
    | EditTaskProps
    | AddTaskProps
    | DeleteTaskProps
    | AddBoardProps
    | EditBoardProps
    | DeleteBoardProps

export default function ModalContent(props: Props) {
    let modalContent: JSX.Element

    switch (props.mode) {
        case "viewTask":
            modalContent = (
                <ViewTaskModal
                    selectedBoardIndex={props.selectedBoardIndex}
                    columnIndex={props.columnIndex}
                    taskIndex={props.taskIndex}
                    setModalMode={props.setModalMode}
                    setIsModalOpen={props.setIsModalOpen}
                />
            )
            break
        case "addTask":
            modalContent = (
                <AddTaskModal
                    selectedBoardIndex={props.selectedBoardIndex}
                    setIsModalOpen={props.setIsModalOpen}
                />
            )
            break
        case "editTask":
            modalContent = (
                <EditTaskModal
                    selectedBoardIndex={props.selectedBoardIndex}
                    columnIndex={props.columnIndex}
                    taskIndex={props.taskIndex}
                    setModalMode={props.setModalMode}
                    setIsModalOpen={props.setIsModalOpen}
                />
            )
            break
        case "deleteTask":
            modalContent = (
                <DeleteModal
                    isBoard={false}
                    selectedBoardIndex={props.selectedBoardIndex}
                    columnIndex={props.columnIndex}
                    taskIndex={props.taskIndex}
                    setIsModalOpen={props.setIsModalOpen}
                />
            )
            break
        case "addBoard":
            modalContent = (
                <AddBoardModal setIsModalOpen={props.setIsModalOpen} />
            )
            break
        case "editBoard":
            modalContent = (
                <EditBoardModal
                    selectedBoardIndex={props.selectedBoardIndex}
                    setIsModalOpen={props.setIsModalOpen}
                />
            )
            break
        case "deleteBoard":
            modalContent = (
                <DeleteModal
                    isBoard={true}
                    selectedBoardIndex={props.selectedBoardIndex}
                    setIsModalOpen={props.setIsModalOpen}
                />
            )
            break
    }

    return modalContent
}
