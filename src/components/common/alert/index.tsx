import { Snackbar, Alert } from "@mui/material";

interface AlertProps {
  onOpen: boolean;
  onClose: () => void;
  severity: "success" | "error";
  message: string;
}

const Index = ({ onOpen, onClose, severity, message }: AlertProps) => {
  return (
    <Snackbar
      open={onOpen}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Index;
