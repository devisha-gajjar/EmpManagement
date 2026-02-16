import { type ReactNode } from "react";
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DialogCompoundProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const DialogCompound = ({ open, onClose, children }: DialogCompoundProps) => {
  return (
    <MuiDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {children}
    </MuiDialog>
  );
};

// Sub-components
const Header = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <DialogTitle
      sx={{
        bgcolor: isDark ? "grey.900" : "grey.100",
        color: isDark ? "common.white" : "text.primary",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {children}
      {onClose && (
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

const Body = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <DialogContent
      sx={{
        bgcolor: isDark ? "grey.900" : "background.paper",
        color: isDark ? "common.white" : "text.primary",
      }}
    >
      {children}
    </DialogContent>
  );
};

const Footer = ({ children }: { children: ReactNode }) => {
  return <DialogActions>{children}</DialogActions>;
};

DialogCompound.Header = Header;
DialogCompound.Body = Body;
DialogCompound.Footer = Footer;

export default DialogCompound;
