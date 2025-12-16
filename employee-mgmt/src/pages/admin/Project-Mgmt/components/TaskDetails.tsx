    import { useDraggable, useDroppable } from "@dnd-kit/core";
    import Tag from "../../../../components/shared/tag/Tag";
    import { Card, CardHeader, CardBody } from "reactstrap";
    import { priorityTagConfig } from "../configs/project-details.config";

    const TaskDetails = ({ status, tasks }: any) => {
    const { setNodeRef } = useDroppable({
        id: status,
    });

    return (
        <div ref={setNodeRef} className="kanban-column">
        <h6 className="mb-3 d-flex align-items-center gap-2">
            {status}
            <Tag
            tagConfig={{
                id: `${status}-count`,
                label: String(tasks.length),
                type: "static",
                isSelected: false,
                hasBorder: false,
                backgroundColor: "light-purple",
                textColor: "purple",
            }}
            />
        </h6>

        {tasks.map((task: any) => (
            <DraggableTask key={task.task_id} task={task} />
        ))}
        </div>
    );
    };

    export default TaskDetails;

    const DraggableTask = ({ task }: any) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
        id: task.task_id,
        });

    const style = {
        transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
        opacity: isDragging ? 0.6 : 1,
        cursor: "grab",
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <Card className="mb-3 card-container">
            <CardHeader className="d-flex justify-content-between align-items-center">
            <Tag tagConfig={priorityTagConfig(task.priority)} />
            <span className="text-muted">•••</span>
            </CardHeader>

            <CardBody>
            <h6>{task.task_name}</h6>
            <p className="text-muted small">{task.description}</p>

            <div className="d-flex justify-content-between small">
                <span>{task.assigned_to}</span>
                <span>Due: {task.due_date}</span>
            </div>
            </CardBody>
        </Card>
        </div>
    );
    };
