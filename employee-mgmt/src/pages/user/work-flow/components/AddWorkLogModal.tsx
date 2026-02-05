import { useState } from "react";
import { useAppDispatch } from "../../../../app/hooks";
import { addTaskWorkLog } from "../../../../features/user/task/userTasksSlice";

interface Props {
  taskId: number;
  onClose: () => void;
}

const AddWorkLogModal = ({ taskId, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const [hoursSpent, setHoursSpent] = useState<number>(0);
  const [logDate, setLogDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (hoursSpent <= 0) return;

    await dispatch(
      addTaskWorkLog({
        taskId,
        hoursSpent,
        logDate,
        description,
      })
    );

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Log Time</h3>

        <div className="form-group">
          <label>Hours Spent</label>
          <input
            type="number"
            min={0.25}
            step={0.25}
            value={hoursSpent}
            onChange={(e) => setHoursSpent(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-btn" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWorkLogModal;
