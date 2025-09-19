import { Column } from "@/components/common/data-table";

import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Edit, Delete, MoreVert } from "@mui/icons-material";
import { useState } from "react";
import { Contract } from "../types/contract";

interface ColumnsProps {
  onView?: (contract: Contract) => void;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
}

const ITEM_HEIGHT = 48;

const ActionsMenu = ({
  contract,
  onEdit,
  onDelete,
}: {
  contract: Contract;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(contract);
    }
    handleClose();
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
    handleClose();
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(contract);
    }
    setDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1, fontSize: 16 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Delete sx={{ mr: 1, fontSize: 16 }} />
          Deletar
        </MenuItem>
      </Menu>

      {/* Modal de confirmação para deletar */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Tem certeza que deseja excluir o contrato &quot;{contract.name}
            &quot;? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps = {}): Column[] => [
  {
    id: "clientName",
    label: "Nome do cliente",
    minWidth: 140,
    sortable: true,
    renderCell: (value) => {
      return value as React.ReactNode;
    },
  },
  {
    id: "name",
    label: "Nome do contrato",
    minWidth: 140,
    sortable: true,
  },
  {
    id: "partner",
    label: "Nome do parceiro",
    minWidth: 200,
    sortable: true,
  },
  {
    id: "campaigns",
    label: "Nº Campanhas",
    minWidth: 100,
    sortable: false,
    renderCell: (value: unknown, row: Record<string, unknown>) => {
      // Try to get campaigns count from different possible paths
      let campaigns = 0;

      // Check if it's in _count.campaigns
      if (
        row._count &&
        typeof row._count === "object" &&
        "campaigns" in row._count
      ) {
        campaigns = (row._count as { campaigns: number }).campaigns;
      }
      // Check if it's directly in campaigns array
      else if (Array.isArray(row.campaigns)) {
        campaigns = row.campaigns.length;
      }
      // Check if value itself is a number
      else if (typeof value === "number") {
        campaigns = value;
      }

      return (
        <Chip
          label={campaigns}
          size="small"
          color="default"
          variant="filled"
          className="w-10 text-xs font-bold"
        />
      );
    },
  },
  {
    id: "startDate",
    label: "Data de Início",
    minWidth: 200,
    sortable: true,
    renderCell: (value) => {
      if (typeof value === "string") {
        const date = new Date(value);
        return date.toLocaleDateString("pt-BR");
      }
      return value as React.ReactNode;
    },
  },
  {
    id: "endDate",
    label: "Data de Término",
    minWidth: 200,
    sortable: true,
    renderCell: (value) => {
      if (typeof value === "string") {
        const date = new Date(value);
        return date.toLocaleDateString("pt-BR");
      }
      return value as React.ReactNode;
    },
  },
  {
    id: "actions",
    label: "Ações",
    minWidth: 120,
    sortable: false,
    renderCell: (_: unknown, row: Record<string, unknown>) => {
      const contract = row as unknown as Contract;
      return (
        <ActionsMenu contract={contract} onEdit={onEdit} onDelete={onDelete} />
      );
    },
  },
];

// Manter compatibilidade com código existente
export const columns = createColumns();
