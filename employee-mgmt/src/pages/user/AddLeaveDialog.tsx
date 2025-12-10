import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DynamicFormComponent from "../../components/shared/form/CommonForm";
import { fetchLeaves } from "../../features/user/leave/leaveApi";
import type { DynamicFormField } from "../../interfaces/form.interface";
import type { CreateLeaveRequest } from "../../interfaces/leave.interface";
import { leaveHubService } from "../../services/signalR/leaveHub.service";
import { useMemo } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  leaveToEdit: CreateLeaveRequest | null;
}

const AddLeaveDialog = ({ open, onClose, leaveToEdit }: Props) => {
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

  const defaultValues = useMemo(() => {
    if (leaveToEdit) {
      const formatDate = (d: string | Date) => {
        const date = new Date(d);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };

      return {
        leaveType: leaveToEdit.leaveType,
        startDate: formatDate(leaveToEdit.startDate),
        endDate: formatDate(leaveToEdit.endDate),
        reason: leaveToEdit.reason,
      };
    }

    return {
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    };
  }, [leaveToEdit]);

  const handleSubmit = async (data: CreateLeaveRequest) => {
    data.userId = parseInt(userId!);
    data.leaveRequestId = leaveToEdit?.leaveRequestId!;
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
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Submit"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddLeaveDialog;
