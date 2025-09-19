import { Button, Box } from "@mui/material";
import { Plus } from "lucide-react";

interface ClientActionsProps {
  onAdd?: () => void;
}

export const ClientActions = ({ onAdd }: ClientActionsProps) => {
  return (
    <Box className="flex gap-2">
      <Button
        variant="contained"
        startIcon={<Plus size={16} />}
        onClick={onAdd}
      >
        Novo Cliente
      </Button>
    </Box>
  );
};
