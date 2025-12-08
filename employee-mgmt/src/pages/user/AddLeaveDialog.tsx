import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import DynamicFormComponent from "../../components/shared/form/CommonForm";
import { createLeave, fetchLeaves } from "../../features/user/leave/leaveApi";
import type { DynamicFormField } from "../../interfaces/form.interface";
import type { CreateLeaveRequest } from "../../interfaces/leave.interface";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddLeaveDialog = ({ open, onClose }: Props) => {
  const dispatch = useAppDispatch();

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
      rules: { required: "Leave type is required" },
    },
    {
      name: "startDate",
      type: "date",
      label: "Start Date",
      rules: { required: "Start date required" },
      gridClass: "half",
    },
    {
      name: "endDate",
      type: "date",
      label: "End Date",
      rules: { required: "End date required" },
      gridClass: "half",
    },
    {
      name: "reason",
      type: "text",
      label: "Reason",
      placeholder: "Enter reason",
      rules: { required: "Reason is required" },
    },
  ];

  const handleSubmit = async (data: CreateLeaveRequest) => {
    const response = await dispatch(createLeave(data));
    console.log("responbse", response);
    if (response?.payload?.leaveRequestId > 0) {
      onClose();
      dispatch(fetchLeaves());
    }
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
