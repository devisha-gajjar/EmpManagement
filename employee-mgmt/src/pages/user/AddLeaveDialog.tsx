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
      rules: { required: "Leave type is required" },
    },
    {
      name: "startDate",
      type: "date",
      label: "Start Date",
      rules: {
        required: "Start date is required",
        validate: (value: string) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (new Date(value) < today) {
            return "Start date cannot be in the past";
          }
          return true;
        },
      },
      gridClass: "half",
    },
    {
      name: "endDate",
      type: "date",
      label: "End Date",
      rules: {
        required: "End date is required",
        validate: (value: string, formValues: any) => {
          if (!formValues?.startDate) {
            return "Please select start date first";
          }

          const startDate = new Date(formValues.startDate);
          const endDate = new Date(value);

          if (endDate < startDate) {
            return "End date cannot be before start date";
          }

          return true;
        },
      },
      gridClass: "half",
    },
    {
      name: "reason",
      type: "text",
      label: "Reason",
      rules: { required: "Reason is required" },
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
    data.userId = Number.parseInt(userId!);

    if (leaveToEdit?.leaveRequestId) {
      data.leaveRequestId = leaveToEdit.leaveRequestId; // Valid ID
    }

    await leaveHubService.applyLeave(data);

    onClose();
    dispatch(fetchLeaves());
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
