import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useAppDispatch } from "../../../../app/hooks";
import { addTaskWorkLog } from "../../../../features/user/task/userTasksSlice";

interface Props {
  taskId: number;
  open: boolean;
  onClose: () => void;
}

const AddWorkLogModal = ({ taskId, open, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const [hours, setHours] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (hours <= 0) return;

    try {
      setLoading(true);

      await dispatch(
        addTaskWorkLog({
          taskId,
          hoursSpent: hours,
          logDate: date,
          description: desc,
        })
      ).unwrap(); // 🔑 important

      onClose();
    } catch (err) {
      console.error("Failed to add work log", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 600, pr: 5 }}>
        Log Time
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Hours Spent"
            type="number"
            inputProps={{ min: 0.25, step: 0.25 }}
            fullWidth
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />

          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            placeholder="What did you work on?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || hours <= 0}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkLogModal;
