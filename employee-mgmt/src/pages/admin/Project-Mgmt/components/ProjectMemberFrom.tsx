import { Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  useAddOrUpdateMemberMutation,
  useGetMemberQuery,
  useLazySearchUsersQuery,
} from "../../../../features/admin/project-mgmt/projectMembersApi";
import { ProjectRole } from "../../../../enums/enum";
import DynamicFormComponent from "../../../../components/shared/form/CommonForm";
import type { DynamicFormField } from "../../../../interfaces/form.interface";
import { useMemo, useState } from "react";
import { debounce } from "@mui/material";
import { useSnackbar } from "../../../../app/hooks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  projectMemberId?: number;
}

const ProjectMemberForm = ({
  isOpen,
  onClose,
  projectId,
  projectMemberId,
}: Props) => {
  const isEditMode = Boolean(projectMemberId);

  const snackbar = useSnackbar();

  const [addOrUpdateMember, { isLoading }] = useAddOrUpdateMemberMutation();

  const [triggerSearch, { isFetching }] = useLazySearchUsersQuery();

  const [userOptions, setUserOptions] = useState<any[]>([]);

  const { data: memberData, isFetching: isLoadingMember } = useGetMemberQuery(
    projectMemberId!,
    {
      skip: !isEditMode,
    }
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

  const defaultValues = isEditMode
    ? {
        userId: memberData?.user.userId,
        role: memberData?.role,
      }
    : undefined;

  const userSelectOptions: { value: number; label: string }[] =
    isEditMode && memberData
      ? [
          {
            value: memberData.user.userId,
            label: memberData.user.fullName,
          },
        ]
      : userOptions;

  const formConfig: DynamicFormField[] = [
    {
      name: "userId",
      label: "Employee",
      type: "search-select",
      rules: { required: true },
      options: isEditMode ? userSelectOptions : userOptions,
      placeholder: "Search employee...",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      rules: { required: true },
      options: [
        { label: "Project Manager", value: ProjectRole.ProjectManager },
        { label: "Team Leader", value: ProjectRole.TeamLeader },
        { label: "Developer", value: ProjectRole.Developer },
        { label: "Tester", value: ProjectRole.Tester },
        { label: "Designer", value: ProjectRole.Designer },
      ],
    },
  ];
  console.log("member", memberData);
  const handleSubmit = async (data: any) => {
    try {
      await addOrUpdateMember({
        projectMemberId: isEditMode ? projectMemberId : undefined,
        projectId,
        userId: Number(data.userId),
        role: Number(data.role),
      }).unwrap();

      snackbar.success(
        isEditMode ? "Member updated successfully" : "Member added successfully"
      );

      onClose();
    } catch (err: any) {
      const message = err?.data?.Message || "Operation failed";
      snackbar.error(message);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader toggle={onClose}>
        {isEditMode ? "Edit Team Member" : "Add Team Member"}
      </ModalHeader>
      <ModalBody>
        <DynamicFormComponent
          formConfig={formConfig}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          onCancel={onClose}
          submitLabel={isEditMode ? "Update Member" : "Add Member"}
          loading={isLoading}
          isFetching={isFetching}
          onSearch={!isEditMode ? debouncedSearch : undefined}
        />
      </ModalBody>
    </Modal>
  );
};

export default ProjectMemberForm;
