import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DynamicFormComponent from "../../components/shared/form/CommonForm";
import { fetchLeaves } from "../../features/user/leave/leaveApi";
import type { DynamicFormField } from "../../interfaces/form.interface";
import type { CreateLeaveRequest } from "../../interfaces/leave.interface";
import { leaveHubService } from "../../services/signalR/leaveHub.service";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddLeaveDialog = ({ open, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector((state) => state.auth);

  const formConfig: DynamicFormField[] = [
    {
      name: "leaveType",
      label: "Leave Type",
      type: "select",
      options: [
        { value: "Vacation", label: "Vacation" },
        { value: "Sick", label: "Sick" },
        { value: "Casual", label: "Casual" },
      ],
      rules: { required: true },
      validationMessages: { required: "Leave type is required" },
    },
    {
      name: "startDate",
      type: "date",
      label: "Start Date",
      rules: { required: true },
      validationMessages: { required: "Start date required" },
      gridClass: "half",
    },
    {
      name: "endDate",
      type: "date",
      label: "End Date",
      rules: { required: true },
      validationMessages: { required: "End date required" },
      gridClass: "half",
    },
    {
      name: "reason",
      type: "text",
      label: "Reason",
      placeholder: "Enter reason",
      rules: { required: true },
      validationMessages: { required: "Reason is required" },
    },
  ];

  const handleSubmit = async (data: CreateLeaveRequest) => {
    data.userId = parseInt(userId!);
    leaveHubService.applyLeave(data);

    // if (response?.payload?.leaveRequestId > 0) {
    onClose();
    dispatch(fetchLeaves());
    // }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Leave Request</DialogTitle>
      <DialogContent>
        <DynamicFormComponent
          formConfig={formConfig}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Submit"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddLeaveDialog;
