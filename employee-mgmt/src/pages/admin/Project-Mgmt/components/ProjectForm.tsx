import PageHeader from "../../../../components/shared/page-header/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectStatus } from "../../../../enums/enum";
import DynamicFormComponent from "../../../../components/shared/form/CommonForm";
import { projectFormConfig } from "../configs/project-form.config";
import { Box, Card } from "@mui/material";
import {
  useGetProjectByIdQuery,
  useSaveProjectMutation,
} from "../../../../features/admin/project-mgmt/projectsMgmtApi";
import "../styles/ProjectForm.css";
import { useMemo } from "react";

const ProjectFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { data: project, isLoading } = useGetProjectByIdQuery(Number(id), {
    skip: !isEditMode,
  });

  const [saveProject, { isLoading: isSaving }] = useSaveProjectMutation();

  const onSubmit = async (formData: any) => {
    try {
      const payload = {
        ...(isEditMode && { projectId: Number(id) }),
        ...formData,
      };

      await saveProject(payload).unwrap();
      navigate("/admin/projects");
    } catch (error) {
      console.error("Save project failed", error);
    }
  };

  const defaultValues = useMemo(() => {
    console.log("project form default values recalculated");

    if (isEditMode && project) {
      return {
        projectName: project.projectName ?? "",
        description: project.description ?? "",
        startDate: project.startDate?.split("T")[0] ?? "",
        endDate: project.endDate?.split("T")[0] ?? "",
        status: project.status ?? ProjectStatus.Planning,
      };
    }

    return {
      projectName: "",
      description: "",
      startDate: "",
      endDate: "",
      status: ProjectStatus.Planning,
    };
  }, [isEditMode, project]);

  if (isEditMode && isLoading) {
    return <div className="p-4">Loading project...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <div className="mb-3">
        <PageHeader
          showBackButton
          icon="folder"
          title={isEditMode ? "Edit Project" : "Create New Project"}
          subtitle={
            isEditMode
              ? "Update project details and settings"
              : "Fill in the details to create a new project"
          }
          theme="blue"
        />
      </div>

      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid #E0E3EB",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="dynamic-form-wrapper">
          <DynamicFormComponent
            formConfig={projectFormConfig}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onCancel={() => navigate(-1)}
            submitLabel={isEditMode ? "Update Project" : "Create Project"}
            cancleLabel="Cancel"
            loading={isSaving}
          />
        </div>
      </Card>
    </Box>
  );
};

export default ProjectFormPage;
