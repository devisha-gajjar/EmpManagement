import { Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  useAddOrUpdateMemberMutation,
  useLazySearchUsersQuery,
} from "../../../../features/admin/project-mgmt/projectMembersApi";
import { ProjectRole } from "../../../../enums/enum";
import DynamicFormComponent from "../../../../components/shared/form/CommonForm";
import type { DynamicFormField } from "../../../../interfaces/form.interface";
import { useMemo, useState } from "react";
import { debounce } from "@mui/material";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
}

const ProjectMemberForm = ({ isOpen, onClose, projectId }: Props) => {
  const [addOrUpdateMember, { isLoading }] = useAddOrUpdateMemberMutation();

  const [triggerSearch, { isFetching }] = useLazySearchUsersQuery();

  const [userOptions, setUserOptions] = useState<any[]>([]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (text: string) => {
        if (!text || text.length < 2) return;

        const res = await triggerSearch(text).unwrap();
        setUserOptions(res);
      }, 400),
    [triggerSearch]
  );

  const formConfig: DynamicFormField[] = [
    {
      name: "userId",
      label: "Employee",
      type: "search-select",
      rules: { required: true },
      options: userOptions,
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

  const handleSubmit = async (data: any) => {
    await addOrUpdateMember({
      projectId,
      userId: data.userId,
      role: data.role,
    }).unwrap();

    onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader toggle={onClose}>Add Team Member</ModalHeader>
      <ModalBody>
        <DynamicFormComponent
          formConfig={formConfig}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Add Member"
          loading={isLoading}
          isFetching={isFetching}
          onSearch={debouncedSearch}
        />
      </ModalBody>
    </Modal>
  );
};

export default ProjectMemberForm;
