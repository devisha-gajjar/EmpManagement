import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { useMemo, useState } from "react";
import DynamicFormComponent from "../../../../components/shared/form/CommonForm";
import type { DynamicFormField } from "../../../../interfaces/form.interface";
import { useSnackbar } from "../../../../app/hooks";
import { notificationHubService } from "../../../../services/signalR/notificationHub.service";
import { useLazySearchUsersQuery } from "../../../../features/admin/project-mgmt/projectMembersApi";
import { debounce } from "@mui/material";
import type { ProjectTask } from "../../../../interfaces/project.interface";

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
  const [isLoading, setIsLoading] = useState(false);
  const [triggerSearch, { isFetching }] = useLazySearchUsersQuery();
  const [userOptions, setUserOptions] = useState<any[]>([]);

  //   const userSelectOptions: { value: number; label: string }[] =
  //     isEditMode && memberData
  //       ? [
  //           {
  //             value: memberData.user.userId,
  //             label: memberData.user.fullName,
  //           },
  //         ]
  //       : userOptions;

  const formConfig: DynamicFormField[] = useMemo(
    () => [
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
                label: task?.assignedTo,
                value: task?.assignedTo,
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
    ],
    [userOptions]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce(async (text: string) => {
        if (!text || text.length < 2) return;

        const res = await triggerSearch(text).unwrap();
        setUserOptions(res);
      }, 400),
    [triggerSearch]
  );

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
        status: "Pending",
        estimatedHours: Number(data.estimatedHours) || 0,
      });

      snackbar.success(
        isEditMode ? "Task updated successfully" : "Task added successfully"
      );

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
          onSearch={debouncedSearch}
        />
      </ModalBody>
    </Modal>
  );
};

export default AddTaskForm;
