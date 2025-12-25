import PageHeader from "../../../components/shared/page-header/PageHeader";

function userTask() {
    return <>
        <div>User Task Page</div>
        <div className="mb-3">
        <PageHeader
            icon="diagram-3"
            title="Project Tasks"
            subtitle="Manage tasks, priorities, and work logs by project"
            theme="purple"
        />
      </div>
    </>;
}

export default userTask;