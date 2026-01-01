import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { use, useMemo, useState } from "react";
import DynamicFormComponent from "../../../../components/shared/form/CommonForm";
import type { DynamicFormField } from "../../../../interfaces/form.interface";
import { useAppDispatch, useSnackbar } from "../../../../app/hooks";
import { notificationHubService } from "../../../../services/signalR/notificationHub.service";
import { useLazySearchUsersQuery } from "../../../../features/admin/project-mgmt/projectMembersApi";
import { debounce } from "@mui/material";
import type { ProjectTask } from "../../../../interfaces/project.interface";
import { taskStatusOptions } from "../../../../utils/constant";
import { fetchProjectById } from "../../../../features/admin/project-mgmt/projectDetailsApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  taskId?: number;
  task?: ProjectTask;
}

const AddTaskForm = ({ isOpen, onClose, projectId, taskId, task }: Props) => {
  const isEditMode = Boolean(taskId);
  const snackbar = useSnackbar();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [triggerSearch, { isFetching }] = useLazySearchUsersQuery();
  const [userOptions, setUserOptions] = useState<any[]>([]);

  const formConfig: DynamicFormField[] = [
    {
      name: "taskName",
      label: "Task Name",
      type: "text",
      rules: { required: true },
      placeholder: "Enter Task name",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter Task description",
    },
    {
      name: "userId",
      label: "Assign To",
      type: "search-select",
      rules: { required: true },
      options: isEditMode
        ? [
            {
              label: task?.user.fullName,
              value: task?.userId,
            },
          ]
        : userOptions,
      disabled: isEditMode,
      placeholder: "Search employee...",
    },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      options: [
        { label: "Low", value: "Low" },
        { label: "Medium", value: "Medium" },
        { label: "High", value: "High" },
      ],
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      rules: { required: true },
    },
    {
      name: "dueDate",
      label: "Due Date",
      type: "date",
      rules: { required: true },
    },
    {
      name: "estimatedHours",
      label: "Estimated Hours",
      type: "number",
      placeholder: "0",
    },
    ...(isEditMode
      ? [
          {
            name: "status",
            label: "Status",
            type: "select",
            rules: { required: true },
            options: taskStatusOptions,
          } as DynamicFormField,
        ]
      : []),
  ];

  const debouncedSearch = useMemo(
    () =>
      debounce(async (text: string) => {
        if (!text || text.length < 2) return;

        const res = await triggerSearch(text).unwrap();
        setUserOptions(res);
      }, 400),
    [triggerSearch]
  );

  const defaultValues = useMemo(() => {
    if (!isEditMode || !task) return undefined;

    return {
      taskName: task.taskName,
      description: task.description,
      userId: task.userId,
      priority: task.priority ?? "Medium",
      status: task.status ?? "Pending",
      startDate: task.startDate?.split("T")[0],
      dueDate: task.dueDate?.split("T")[0],
      estimatedHours: task.estimatedHours ?? 0,
    };
  }, [isEditMode, task]);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      console.log("Submitting task payload:", {
        startDate: data.startDate,
        dueDate: data.dueDate,
      });

      await notificationHubService.addOrUpdateTask({
        taskId: isEditMode ? taskId : 0,
        projectId,
        userId: Number(data.userId),
        taskName: data.taskName,
        description: data.description || "",
        startDate: data.startDate,
        dueDate: data.dueDate,
        priority: data.priority || "Medium",
        status: isEditMode ? data.status : "Pending",
        estimatedHours: Number(data.estimatedHours) || 0,
      });

      snackbar.success(
        isEditMode ? "Task updated successfully" : "Task added successfully"
      );

      dispatch(fetchProjectById(projectId));

      onClose();
    } catch (err: any) {
      console.log(err);
      snackbar.error(err?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader toggle={onClose}>
        {isEditMode ? "Edit Task" : "Add Task"}
      </ModalHeader>
      <ModalBody>
        <DynamicFormComponent
          formConfig={formConfig}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel={isEditMode ? "Update Task" : "Add Task"}
          loading={isLoading}
          isFetching={isFetching}
          defaultValues={defaultValues}
          onSearch={debouncedSearch}
        />
      </ModalBody>
    </Modal>
  );
};

export default AddTaskForm;
