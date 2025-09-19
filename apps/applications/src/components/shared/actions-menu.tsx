import {
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
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";

const ITEM_HEIGHT = 48;

interface ActionsMenuProps<T> {
  item: T;
  itemName: string; // nome do item para exibir no modal de confirmação
  itemType?: string; // tipo do item (ex: "contrato", "cliente") - padrão é "item"
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export const ActionsMenu = <T,>({
  item,
  itemName,
  itemType = "item",
  onEdit,
  onDelete,
}: ActionsMenuProps<T>) => {
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
      onEdit(item);
    }
    handleClose();
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
    handleClose();
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(item);
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
              width: "12ch",
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>Editar</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Deletar</MenuItem>
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
            Tem certeza que deseja excluir o {itemType} &quot;{itemName}
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
